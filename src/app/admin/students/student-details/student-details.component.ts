import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
    this.action = data.action || 'Agregar';
    this.initForm(data.student);
  }

  ngOnInit(): void {}

  initForm(student?: Student): void {
    this.studentForm = this.fb.group({
      id: [student?.id],
      fullName: [student?.fullName || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      level: [student?.level || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      section: [student?.section || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      grade: [student?.grade || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      current: [student?.current || false, [Validators.required]],
      gender: [student?.gender || '', [Validators.required]],
      guardian: this.fb.group({
        id: [student?.guardian?.id],
        fullName: [student?.guardian?.fullName || '', Validators.required],
        livesWithStudent: [student?.guardian?.livesWithStudent || false, Validators.required]
      }),
      siblings: this.fb.array(student?.siblings?.map(s => this.initSiblingForm(s)) || [])
    });
  }

  initSiblingForm(sibling?: Student): FormGroup {
    return this.fb.group({
      id: [sibling?.id, Validators.required],
      fullName: [sibling?.fullName, Validators.required]
    });
  }

  get siblings(): FormArray {
    return this.studentForm.get('siblings') as FormArray;
  }

  addSibling(): void {
    this.siblings.push(this.initSiblingForm());
  }

  removeSibling(index: number): void {
    this.siblings.removeAt(index);
  }

  saveStudent(): void {
    if (this.studentForm.valid) {
      const studentData: Student = this.studentForm.value;
      const operation = studentData.id ?
        this.studentService.updateStudent(studentData) :
        this.studentService.addStudent(studentData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(`Estudiante ${this.action === 'Agregar' ? 'agregado' : 'actualizado'} exitosamente`, 'OK', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error al guardar el estudiante', error);
          this.snackBar.open('Error al guardar el estudiante', 'ERROR', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Por favor, complete el formulario correctamente', 'ERROR', { duration: 3000 });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
