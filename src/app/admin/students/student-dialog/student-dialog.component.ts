import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
export class StudentDialogComponent implements OnInit, OnDestroy {
  studentForm: FormGroup;
  guardians: Guardian[] = [];
  students: StudentSimple[] = [];
  filteredStudents: Observable<StudentSimple[]>[] = [];
  filteredGuardians: Observable<Guardian[]>; // For real-time guardian search
  subscriptions = new Subscription();
  action: string;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private guardianService: GuardianService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action || 'Agregar';
    this.initForm(data.student);
  }

  ngOnInit(): void {
    this.loadGuardians();
    this.loadSiblings();
    this.filteredGuardians = this.studentForm.get('guardianName')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGuardians(value))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initForm(student?: Student): void {
    this.studentForm = this.fb.group({
      id: [student?.id],
      fullName: [student?.fullName || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      level: [student?.level || '', [Validators.required]],
      section: [student?.section || '', [Validators.required]],
      grade: [student?.grade || '', [Validators.required]],
      gender: [student?.gender || '', [Validators.required]],
      current: [student?.current || false],
      siblings: this.fb.array([]),
      guardianId: [student?.guardian?.id],
      guardianName: [student?.guardian?.fullName || '', Validators.required],
      guardianLivesWithStudent: [student?.guardian?.livesWithStudent || false]
    });

    if (student?.siblings) {
      student.siblings.forEach(sibling => this.addSibling(sibling));
    }
  }

  get siblings(): FormArray {
    return this.studentForm.get('siblings') as FormArray;
  }

  addSibling(sibling?: Student): void {
    const siblingFormGroup = this.fb.group({
      id: [sibling?.id],
      fullName: ['', Validators.required]
    });
    this.siblings.push(siblingFormGroup);
    this.filteredStudents.push(this.createFilterForSibling(siblingFormGroup.get('fullName') as FormControl, siblingFormGroup));
  }

  createFilterForSibling(control: FormControl, siblingFormGroup: FormGroup): Observable<StudentSimple[]> {
    return control.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value.toLowerCase() : value),
      map(name => name ? this.filterStudents(name) : this.students.slice()),
      map(filtered => {
        control.valueChanges.subscribe(val => {
          const selectedStudent = this.students.find(student => student.fullName.toLowerCase() === val.toLowerCase());
          if (selectedStudent) {
            siblingFormGroup.get('id').setValue(selectedStudent.id);
          }
        });
        return filtered;
      })
    );
  }

  filterStudents(name: string): StudentSimple[] {
    return this.students.filter(student => student.fullName.toLowerCase().includes(name.toLowerCase()));
  }

  removeSibling(index: number): void {
    this.siblings.removeAt(index);
    this.filteredStudents.splice(index, 1);
  }

  loadGuardians(): void {
    this.subscriptions.add(
      this.guardianService.getAllGuardians().subscribe({
        next: (response) => {
          this.guardians = response.data;
          this.filteredGuardians = this.studentForm.get('guardianName')!.valueChanges.pipe(
            startWith(''),
            map(value => this._filterGuardians(value))
          );
        },
        error: () => this.snackBar.open('Error al cargar guardianes', 'ERROR', { duration: 3000 })
      })
    );
  }

  loadSiblings(): void {
    this.subscriptions.add(
      this.studentService.getAllStudentsSimple().subscribe({
        next: (response) => {
          this.students = response.data;
          this.siblings.controls.forEach((control, index) => {
            const siblingId = control.get('id')?.value;
            if (siblingId) {
              const sibling = this.students.find(student => student.id === siblingId);
              if (sibling) {
                control.get('fullName')?.setValue(sibling.fullName);
              }
            }
            this.filteredStudents[index] = this.createFilterForSibling(control.get('fullName') as FormControl, control as FormGroup);
          });
        },
        error: () => this.snackBar.open('Error al cargar hermanos', 'ERROR', { duration: 3000 })
      })
    );
  }

  private _filterGuardians(value: string): Guardian[] {
    const filterValue = value.toLowerCase();
    return this.guardians.filter(guardian => guardian.fullName.toLowerCase().includes(filterValue));
  }

  onSave(): void {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
      const guardian = this.guardians.find(g => g.fullName === formData.guardianName);
      const studentData: Student = {
        ...formData,
        guardian: guardian ? {
          id: guardian.id,
          fullName: guardian.fullName,
          livesWithStudent: guardian.livesWithStudent
        } : {
          fullName: formData.guardianName,
          livesWithStudent: formData.guardianLivesWithStudent
        },
        siblings: this.siblings.value.filter(s => s.id)
      };

      const operation = studentData.id ?
        this.studentService.updateStudent(studentData) :
        this.studentService.addStudent(studentData);

      this.subscriptions.add(
        operation.subscribe({
          next: () => {
            this.snackBar.open(`Estudiante ${this.action === 'Agregar' ? 'agregado' : 'actualizado'} con éxito`, 'OK', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error al guardar el estudiante:', error);
            this.snackBar.open('Error al guardar el estudiante: ' + (error.error.message || 'Error desconocido'), 'ERROR', { duration: 3000 });
          }
        })
      );
    } else {
      this.snackBar.open('Por favor, complete el formulario correctamente', 'ERROR', { duration: 3000 });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
