import { Component, Inject, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable, of } from 'rxjs'; 
import { map, startWith } from 'rxjs/operators';
import { StudentService } from 'src/app/services/student.service';
import { GuardianService } from 'src/app/services/guardian.service';
import { Student } from 'src/app/model/student.model';
import { Guardian } from 'src/app/model/guardian.model';
import { StudentSimple } from 'src/app/model/studentSimple.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent implements OnInit, OnDestroy {
  @Output() studentUpdated = new EventEmitter<Student>();
  studentForm: FormGroup;
  guardians: Guardian[] = [];
  students: StudentSimple[] = [];
  
  filteredStudents: Observable<StudentSimple[]>[] = [];
  filteredGuardians: Observable<Guardian[]>; 
  subscriptions = new Subscription();
  action: string;
  selectedGuardianOption: string;
  createdGuardianId: number;

  gradeOptions = {
    inicial: ['3 años', '4 años', '5 años'],
    primaria: ['1er grado', '2do grado', '3er grado', '4to grado', '5to grado', '6to grado'],
    secundaria: ['1er grado', '2do grado', '3er grado', '4to grado', '5to grado']
  };
  currentGradeOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private guardianService: GuardianService,
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action || 'Agregar';
    this.selectedGuardianOption = 'existing'; 
    this.initForm(data.student);
  }

  ngOnInit(): void {
    this.loadGuardians();
    this.loadSiblings();
    this.filteredGuardians = this.studentForm.get('guardianName')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterGuardians(value))
    );

    this.studentForm.get('level')!.valueChanges.subscribe(level => {
      this.updateGradeOptions(level);
    });

    if (this.studentForm.get('level')!.value) {
      this.updateGradeOptions(this.studentForm.get('level')!.value);
    }
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
      guardianOption: [student?.guardian ? 'existing' : 'new'], 
      guardianId: [student?.guardian?.id],
      guardianName: [student?.guardian?.fullName || '', Validators.required],
      guardianLivesWithStudent: [student?.guardian?.livesWithStudent || false],
      newGuardianName: [''], 
      newGuardianLivesWithStudent: [false] 
    });

    if (student?.siblings) {
      student.siblings.forEach(sibling => this.addSibling(sibling));
    }

    if (student?.guardian) {
      this.selectedGuardianOption = 'existing';
      this.filteredGuardians = of([student.guardian]);
    } else {
      this.selectedGuardianOption = 'new';
    }

    if (student?.level) {
      this.updateGradeOptions(student.level);
    }

    // Deshabilitar los controles de los hermanos
    this.disableSiblingControls();
  }

  get siblings(): FormArray {
    return this.studentForm.get('siblings') as FormArray;
  }

  addSibling(sibling?: Student): void {
    const siblingFormGroup = this.fb.group({
      id: [sibling?.id],
      fullName: [{ value: sibling?.fullName || '', disabled: true }, Validators.required]
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
        error: () => this.showErrorMessage('Error al cargar apoderados')
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
        error: () => this.showErrorMessage('Error al cargar hermanos')
      })
    );
  }

  private _filterGuardians(value: string): Guardian[] {
    const filterValue = value.toLowerCase();
    return this.guardians.filter(guardian => guardian.fullName.toLowerCase().includes(filterValue));
  }

  onCreateGuardian(): void {
    const newGuardianData = this.studentForm.get('newGuardianName').value;
    if (newGuardianData) {
        const newGuardian: Guardian = {
            fullName: newGuardianData,
            livesWithStudent: this.studentForm.get('newGuardianLivesWithStudent').value
        };
        this.guardianService.addGuardian(newGuardian).subscribe({
            next: (response) => {
                const guardian = response.data;
                this.createdGuardianId = guardian.id;
                this.showSuccessMessage('Nuevo apoderado creado con éxito. Ahora puede asignarlo al estudiante.');
                this.selectedGuardianOption = 'existing';
                this.studentForm.patchValue({
                    guardianId: guardian.id, 
                    guardianName: guardian.fullName
                });
                this.loadGuardians();
            },
            error: (error) => {
                this.showErrorMessage('Error al crear apoderado: ' + error.message);
            }
        });
    } else {
        this.showErrorMessage('Por favor, ingrese los datos del nuevo apoderado');
    }
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
        next: (response) => {
          this.showSuccessMessage(`Estudiante ${this.action === 'Agregar' ? 'agregado' : 'actualizado'} con éxito`);
          this.studentUpdated.emit(response.data);
          this.dialogRef.close({ updatedStudent: response.data });
        },
        error: (error) => {
          console.error('Error al guardar el estudiante:', error);
          this.showErrorMessage('Error al guardar el estudiante: ' + (error.error.message || 'Error desconocido'));
        }
      })
    );
  } else {
    this.showErrorMessage('Por favor, complete el formulario correctamente');
  }
}



  updateGradeOptions(level: string): void {
    this.currentGradeOptions = this.gradeOptions[level] || [];
    const currentGrade = this.studentForm.get('grade')!.value;
    if (!this.currentGradeOptions.includes(currentGrade)) {
      this.studentForm.get('grade')!.setValue('');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      html: `<span style="font-size: 1.3em;">${message}</span>`,
      showConfirmButton: true
    });
  }

  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      html: `<span style="font-size: 1.3em;">${message}</span>`,
      showConfirmButton: true
    });
  }

  private disableSiblingControls(): void {
    this.siblings.controls.forEach(control => control.get('fullName')?.disable());
  }
}
