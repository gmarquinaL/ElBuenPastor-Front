import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student.model';
import { StudentSimple } from 'src/app/model/studentSimple.model';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { ConfirmDialogComponent } from '../payment/confirm-dialog/confirm-dialog.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import Swal from 'sweetalert2';
import { exportStudentsToExcel } from '../students/excel-export.service';
import { logoBase64 } from '../payment/logoBase64';

interface StudentCombined extends StudentSimple {
  gender?: string;
  level?: string;
  grade?: string;
  guardian?: { fullName: string };
  siblingName?: string;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['fullName', 'gender', 'actions'];
  dataSource = new MatTableDataSource<StudentCombined>();
  private subscriptions = new Subscription();
  filterValues = {
    fullName: '',
    level: '',
    grade: '',
    hasSiblings: '',
    exportSiblingsOnly: false 
    
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private studentService: StudentService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  createFilter(): (data: StudentCombined, filter: string) => boolean {
    return (data, filter): boolean => {
      const searchTerms = JSON.parse(filter);
      const fullNameMatch = data.fullName.toLowerCase().includes(searchTerms.fullName.toLowerCase());
      const guardianNameMatch = data.guardian ? data.guardian.fullName.toLowerCase().includes(searchTerms.fullName.toLowerCase()) : false;
      const levelMatch = searchTerms.level ? data.level === searchTerms.level : true;
      const gradeMatch = searchTerms.grade ? data.grade === searchTerms.grade : true;
      const siblingMatch = searchTerms.hasSiblings === 'yes' ? data.siblingName !== 'No tiene hermanos' : searchTerms.hasSiblings === 'no' ? data.siblingName === 'No tiene hermanos' : true;

      return (fullNameMatch || guardianNameMatch) && levelMatch && gradeMatch && siblingMatch;
    };
  }

  applyFilter(): void {
    this.dataSource.filter = JSON.stringify(this.filterValues);
    this.changeDetectorRefs.detectChanges();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.filterValues = {
      fullName: '',
      level: '',
      grade: '',
      hasSiblings: '',
      exportSiblingsOnly: false 
    };
    this.applyFilter();
  }

  filterSiblings(hasSiblings: string): void {
    this.filterValues.hasSiblings = hasSiblings;
    this.applyFilter();
  }

  loadStudents(): void {
    this.subscriptions.add(this.studentService.getAllStudentsSimple().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.loadAdditionalStudentDetails();
      },
      error: () => this.showErrorMessage('Error al cargar los estudiantes')
    }));
  }

  loadAdditionalStudentDetails(): void {
    const detailsRequests = this.dataSource.data.map(studentSimple =>
      this.studentService.getStudentDetails(studentSimple.id).pipe(
        map(response => ({
          ...studentSimple,
          gender: response.data.gender,
          level: response.data.level,
          grade: response.data.grade,
          guardian: response.data.guardian,
          siblingName: response.data.siblings.length ? response.data.siblings.map(s => s.fullName).join(', ') : 'No tiene hermanos'
        })),
        catchError(() => of({
          ...studentSimple,
          gender: 'Desconocido',
          level: 'Desconocido',
          grade: 'Desconocido',
          siblingName: 'No tiene hermanos'
        }))
      )
    );

    this.subscriptions.add(forkJoin(detailsRequests).subscribe(completed => {
      this.dataSource.data = completed;
    }));
  }

  openStudentDialog(action: string, studentSimple?: StudentSimple): void {
    if (studentSimple) {
      this.studentService.getStudentDetails(studentSimple.id).subscribe({
        next: (response) => {
          const studentData = response.data;
          this.openDialog(action, studentData);
        },
        error: () => this.showErrorMessage('Error al cargar los detalles del estudiante')
      });
    } else {
      this.openDialog(action);
    }
  }

  private openDialog(action: string, studentData?: Student): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '650px',
      data: { action, student: studentData || {} as Student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudents(); 
      }
    });
  }

  deleteStudent(id: number): void {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de querer eliminar este estudiante?'
      }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performDeletion(id);
      }
    });
  }

  private performDeletion(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(student => student.id !== id);
        this.showSuccessMessage('Estudiante eliminado con éxito');
      },
      error: () => this.showErrorMessage('Error al eliminar el estudiante')
    });
  }

  openStudentDetailsDialog(studentSimple: StudentSimple): void {
    this.studentService.getStudentDetails(studentSimple.id).subscribe({
      next: (response) => {
        const studentData = response.data;
        const dialogRef = this.dialog.open(StudentDetailsComponent, {
          width: '650px',
          data: { student: studentData }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadStudents(); 
          }
        });
      },
      error: () => this.showErrorMessage('Error al cargar los detalles del estudiante')
    });
  }

  exportToExcel(): void {
    let dataToExport: StudentCombined[] = this.dataSource.filteredData;
    if (this.filterValues.exportSiblingsOnly) {
      dataToExport = dataToExport.filter(student => student.siblingName !== 'No tiene hermanos');
    }
    
    const groupedData = this.groupByGuardian(dataToExport);
    const dataToExportFormatted: any[] = [];
  
    Object.keys(groupedData).forEach(guardian => {
      const students = groupedData[guardian];
      students.forEach((student, index) => {
        dataToExportFormatted.push({
          'Guardián': index === 0 ? guardian : '',
          'Nombre Completo': student.fullName,
          'Género': student.gender,
          'Nivel': student.level,
          'Grado': student.grade,
          'Hermanos': student.siblingName
        });
      });
    });
  
    exportStudentsToExcel(dataToExportFormatted, logoBase64);
  }
  groupByGuardian(data: StudentCombined[]): { [key: string]: StudentCombined[] } {
    return data.reduce((acc, student) => {
      const guardianName = student.guardian?.fullName || 'Sin guardián';
      if (!acc[guardianName]) {
        acc[guardianName] = [];
      }
      acc[guardianName].push(student);
      return acc;
    }, {} as { [key: string]: StudentCombined[] });
  }

  showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: `<span style="font-size: 1rem;">${message}</span>`,
      showConfirmButton: true
    });
  }

  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: `<span style="font-size: 1rem;">${message}</span>`,
      showConfirmButton: true
    });
  }
}
