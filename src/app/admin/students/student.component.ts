// student.component.ts
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student.model';
import { StudentSimple } from 'src/app/model/studentSimple.model';
import { StudentDetailsComponent } from './student-details/student-details.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['fullName', 'level', 'section', 'grade', 'actions'];
  dataSource = new MatTableDataSource<StudentSimple>();
  private subscriptions = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Limpiar todas las suscripciones
  }

  loadStudents(): void {
    this.subscriptions.add(this.studentService.getAllStudentsSimple().subscribe({
      next: (students) => {
        this.dataSource.data = students;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.snackBar.open('Error al cargar los estudiantes', 'ERROR', { duration: 3000 })
    }));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openStudentDialog(studentSimple?: StudentSimple): void {
    if (studentSimple) {
      this.studentService.getStudentDetails(studentSimple.id).subscribe({
        next: (student) => {
          this.dialog.open(StudentDetailsComponent, {
            width: '650px',
            data: student
          }).afterClosed().subscribe(result => {
            if (result) {
              this.loadStudents();
            }
          });
        },
        error: () => this.snackBar.open('Error al cargar detalles del estudiante', 'ERROR', { duration: 3000 })
      });
    } else {
      this.dialog.open(StudentDetailsComponent, {
        width: '650px',
        data: {} as Student  // Usa un objeto literal vacío que cumpla con la interfaz Student
      }).afterClosed().subscribe(result => {
        if (result) {
          this.loadStudents();
        }
      });
    }
  }

  deleteStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.snackBar.open('Estudiante eliminado con éxito', 'OK', { duration: 3000 });
        this.loadStudents(); // Recargar lista de estudiantes
      },
      error: () => this.snackBar.open('Error al eliminar el estudiante', 'ERROR', { duration: 3000 })
    });
  }

  assignGuardian(studentId: number, guardianId: number): void {
    this.studentService.assignGuardianToStudent(studentId, guardianId).subscribe({
      next: () => {
        this.snackBar.open('Guardián asignado con éxito', 'OK', { duration: 3000 });
        this.loadStudents();
      },
      error: () => this.snackBar.open('Error al asignar guardián', 'ERROR', { duration: 3000 })
    });
  }

  relateSibling(studentId: number, siblingId: number): void {
    this.studentService.assignSiblingToStudent(studentId, siblingId).subscribe({
      next: () => {
        this.snackBar.open('Relación de hermano establecida con éxito', 'OK', { duration: 3000 });
        this.loadStudents();
      },
      error: () => this.snackBar.open('Error al establecer relación de hermano', 'ERROR', { duration: 3000 })
    });
  }
}
