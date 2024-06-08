import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['fullName', 'gender', 'actions'];
  dataSource = new MatTableDataSource<StudentSimple & { gender?: string }>();
  private subscriptions = new Subscription();
  filterValues = {
    fullName: '',
    level: '',
    grade: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    // Initialize filter predicate
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data, filter): boolean => {
      const searchTerms = JSON.parse(filter);
      return data.fullName.toLowerCase().includes(searchTerms.fullName)
        && (searchTerms.level ? data.level === searchTerms.level : true)
        && (searchTerms.grade ? data.grade === searchTerms.grade : true);
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
      grade: ''
    };
    this.applyFilter();
  }

  loadStudents(): void {
    this.subscriptions.add(this.studentService.getAllStudentsSimple().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.loadAdditionalStudentDetails();
      },
      error: () => this.snackBar.open('Error al cargar los estudiantes', 'ERROR', { duration: 3000 })
    }));
  }

  loadAdditionalStudentDetails(): void {
    const detailsRequests = this.dataSource.data.map(studentSimple =>
      this.studentService.getStudentDetails(studentSimple.id).pipe(
        map(response => ({ ...studentSimple, gender: response.data.gender, level: response.data.level, grade: response.data.grade })),
        catchError(() => of({ ...studentSimple, gender: 'Desconocido', level: 'Desconocido', grade: 'Desconocido' }))
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
        error: () => this.snackBar.open('Error al cargar los detalles del estudiante', 'ERROR', { duration: 3000 })
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
        this.loadStudents(); // Volver a cargar la lista de estudiantes
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
        this.snackBar.open('Estudiante eliminado con éxito', 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error al eliminar el estudiante', 'ERROR', { duration: 3000 })
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
            this.loadStudents(); // Reload the student list if any changes were made
          }
        });
      },
      error: () => this.snackBar.open('Error al cargar los detalles del estudiante', 'ERROR', { duration: 3000 })
    });
  }
}
