import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student.model';
import { StudentSimple } from 'src/app/model/studentSimple.model';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['fullName', 'actions'];
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
    this.subscriptions.unsubscribe();
  }

  loadStudents(): void {
    this.subscriptions.add(this.studentService.getAllStudentsSimple().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.snackBar.open('Error al cargar los estudiantes', 'ERROR', { duration: 3000 })
    }));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openStudentDialog(action: string, studentSimple?: StudentSimple): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '650px',
      data: { action, student: studentSimple ? { ...studentSimple } : {} as Student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.loadStudents(); // Recargar la lista de estudiantes si hubo cambios
      }
    });
  }

  deleteStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.snackBar.open('Estudiante eliminado con éxito', 'OK', { duration: 3000 });
        this.loadStudents();
      },
      error: () => this.snackBar.open('Error al eliminar el estudiante', 'ERROR', { duration: 3000 })
    });
  }
}
