import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentService } from 'src/app/services/student.service';
import { GuardianService } from 'src/app/services/guardian.service';
import { Student } from 'src/app/model/student.model';
import { Guardian } from 'src/app/model/guardian.model';
import { StudentSimple } from 'src/app/model/studentSimple.model';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent implements OnInit {
  firstForm: FormGroup;
  secondForm: FormGroup;
  guardians: Guardian[] = [];
  students: StudentSimple[] = [];
  hasSibling: boolean = false;
  maxDate: Date = new Date();
  action: string;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private guardianService: GuardianService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;

    this.firstForm = this.fb.group({
      id: [data.student?.id],
      fullName: [data.student?.fullName || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      level: [data.student?.level || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      section: [data.student?.section || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      grade: [data.student?.grade || '', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      current: [data.student?.current || false, [Validators.required]],
      hasSibling: [false],
      siblingId: [''],
      gender: [data.student?.gender || '', [Validators.required]]  
    });
    

    this.secondForm = this.fb.group({
      guardianName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      guardianLivesWithStudent: [false, [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data.student && this.data.student.id) {
      this.firstForm.patchValue(this.data.student);
      this.hasSibling = !!this.data.student.siblings && this.data.student.siblings.length > 0;
      if (this.data.student.siblings && this.data.student.siblings.length > 0) {
        this.firstForm.patchValue({ siblingId: this.data.student.siblings[0].id });
      }
    }
    this.loadGuardians();
    this.loadSiblings();
  }

  loadGuardians(): void {
    this.guardianService.getAllGuardians().subscribe({
      next: (response) => {
        this.guardians = response.data;
      },
      error: () => this.snackBar.open('Error al cargar guardianes', 'ERROR', { duration: 3000 })
    });
  }

  loadSiblings(): void {
    this.studentService.getAllStudentsSimple().subscribe({
      next: (response) => {
        this.students = response.data;
      },
      error: () => this.snackBar.open('Error al cargar hermanos', 'ERROR', { duration: 3000 })
    });
  }

  onSave(): void {
    if (this.firstForm.valid && this.secondForm.valid) {
      const guardianData: Guardian = {
        id: null,  // Establecemos id como null porque es un nuevo guardián
        fullName: this.secondForm.value.guardianName,
        livesWithStudent: this.secondForm.value.guardianLivesWithStudent
      };
  
      const studentData: Student = {
        ...this.firstForm.value,
        guardian: guardianData,
        siblings: this.hasSibling && this.firstForm.value.siblingId ? [{ id: this.firstForm.value.siblingId }] : []
      };
  
      if (this.data.student && this.data.student.id) {
        this.studentService.updateStudent(studentData).subscribe({
          next: () => this.handleResponse('Estudiante actualizado con éxito'),
          error: () => this.handleResponse('Error al actualizar estudiante', true)
        });
      } else {
        this.studentService.addStudent(studentData).subscribe({
          next: () => this.handleResponse('Estudiante agregado con éxito'),
          error: () => this.handleResponse('Error al agregar estudiante', true)
        });
      }
    }
  }

  handleResponse(message: string, isError: boolean = false): void {
    this.snackBar.open(message, isError ? 'ERROR' : 'OK', { duration: 3000 });
    if (!isError) {
      this.dialogRef.close('confirm');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
