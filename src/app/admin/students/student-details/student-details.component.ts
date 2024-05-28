import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student.model';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {
  studentForm: FormGroup;
  action: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<StudentDetailsComponent>,
    private fb: FormBuilder,
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {
    this.action = data.action;
    this.studentForm = this.fb.group({
      id: [data.student?.id],
      fullName: [data.student?.fullName || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      level: [data.student?.level || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      section: [data.student?.section || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      grade: [data.student?.grade || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      current: [data.student?.current || false, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  saveStudent(): void {
    if (this.studentForm.valid) {
      if (this.action === 'Actualizar') {
        this.studentService.updateStudent(this.studentForm.value).subscribe({
          next: () => {
            this.snackBar.open('Estudiante actualizado exitosamente', 'OK', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => this.snackBar.open('Error al actualizar el estudiante', 'ERROR', { duration: 3000 })
        });
      } else {
        this.studentService.addStudent(this.studentForm.value).subscribe({
          next: () => {
            this.snackBar.open('Estudiante agregado exitosamente', 'OK', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => this.snackBar.open('Error al agregar el estudiante', 'ERROR', { duration: 3000 })
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
