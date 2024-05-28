// student-details.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student.model';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {
  student: Student;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Student,
    private dialogRef: MatDialogRef<StudentDetailsComponent>,
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {
    this.student = { ...data }; // Copiar datos iniciales para edición
  }

  ngOnInit(): void {
    if (this.student.id) {
      // Si hay un ID, cargar los detalles del estudiante
      this.studentService.getStudentDetails(this.student.id).subscribe({
        next: (response) => {
          this.student = response;
        },
        error: () => this.snackBar.open('Error fetching student details', 'ERROR', { duration: 3000 })
      });
    }
  }

  saveStudent(): void {
    if (this.student.id) {
      // Actualizar estudiante existente
      this.studentService.updateStudent(this.student).subscribe({
        next: () => {
          this.snackBar.open('Student updated successfully', 'OK', { duration: 3000 });
          this.dialogRef.close(true); // Cerrar diálogo y recargar lista
        },
        error: () => this.snackBar.open('Error updating student', 'ERROR', { duration: 3000 })
      });
    } else {
      // Crear nuevo estudiante
      this.studentService.addStudent(this.student).subscribe({
        next: () => {
          this.snackBar.open('Student added successfully', 'OK', { duration: 3000 });
          this.dialogRef.close(true); // Cerrar diálogo y recargar lista
        },
        error: () => this.snackBar.open('Error adding student', 'ERROR', { duration: 3000 })
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
