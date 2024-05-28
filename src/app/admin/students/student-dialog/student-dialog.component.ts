// student-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student.model';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent implements OnInit {
  studentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student
  ) {
    this.studentForm = this.fb.group({
      fullName: ['', [Validators.required]],
      level: ['', [Validators.required]],
      section: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      current: [false, [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.id) { // Si hay datos, estamos editando
      this.studentForm.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.studentForm.valid) {
      const studentData = this.studentForm.value;
      if (this.data && this.data.id) {
        // Editar estudiante existente
        this.studentService.updateStudent({ ...this.data, ...studentData }).subscribe({
          next: () => {
            this.dialogRef.close('confirm');
          },
          error: (err) => console.error(err)
        });
      } else {
        // Crear nuevo estudiante
        this.studentService.addStudent(studentData).subscribe({
          next: () => {
            this.dialogRef.close('confirm');
          },
          error: (err) => console.error(err)
        });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
