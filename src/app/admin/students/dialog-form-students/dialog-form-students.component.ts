import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student } from 'src/app/model/student.model';
import { User } from 'src/app/model/user.model';
import { EMAIL_REGEX, GENDERS, GRADE_INSTITUTIONS, ROLES, TYPE_STUDENTS, dateUTC, validatePassword } from 'src/app/shared/util/constants.util';

@Component({
  selector: 'app-dialog-form-students',
  templateUrl: './dialog-form-students.component.html',
  styleUrls: ['./dialog-form-students.component.scss']
})
export class DialogFormStudentsComponent implements OnInit {

  local_data: any;
  action: string;
  maxDate: Date = new Date();

  hide = true;
  hide2 = true;
  
  genders = GENDERS;
  typeStudents = TYPE_STUDENTS;
  gradeInstituons = GRADE_INSTITUTIONS;
  
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm:  FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogFormStudentsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Student,
    private fb: FormBuilder,
    private matSnackBar: MatSnackBar,

  ) {
  
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  ngOnInit(): void {
    this.createFirstForm();
    this.createSecondForm();
    this.createThirdForm();
  }


  createFirstForm()
  {
    this.firstForm = this.fb.group({
      id: [this.local_data?.id],
      name: [this.local_data.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      paternalSurname: [this.local_data.paternalSurname, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      maternalSurname: [this.local_data.maternalSurname, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      birthdate: [dateUTC(this.local_data?.birthdate), [Validators.required]],
      ruc: [this.local_data.ruc, [Validators.pattern(/^[0-9]{11}$/)]],
      address: [this.local_data.address, [Validators.required, Validators.minLength(5)]],
      phone: [this.local_data.phone, [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      email: [this.local_data.email, [Validators.required, Validators.email, Validators.pattern(EMAIL_REGEX)]],
      gender: [this.local_data?.gender, [Validators.required]]
    });
  }

  createSecondForm()
  {
    this.secondForm = this.fb.group({
      registrationDate: [this.local_data.registrationDate ? dateUTC(this.local_data?.registrationDate) : new Date(), [Validators.required]],
      nroGradeInstitution: [this.local_data.nroGradeInstitution, [Validators.required, Validators.min(1), Validators.max(6)]],
      gradeInstitutionName: [this.local_data.gradeInstitutionName, [Validators.required]],
      typeParticipant: [this.local_data.typeParticipant, [Validators.required]]
    });
  }

  createThirdForm()
  {
    this.thirdForm = this.fb.group({
      id: [this.local_data.user?.id],
      username: [this.local_data.user?.username, [Validators.required, Validators.minLength(5)]],
      password: [this.local_data.user?.password, [Validators.minLength(6), Validators.maxLength(30)]],
      confirmPassword: [this.local_data.user?.password, [Validators.minLength(6), Validators.maxLength(30)]],
      enabled: [this.local_data.user?.enabled]
    });
  }

 
  updateUsername(){
    let username = this.firstForm.get('email').value;
    this.thirdForm.get('username').setValue(username.toLowerCase());
  }

  doAction()
  {
    if(this.firstForm.valid && this.secondForm.valid && this.thirdForm.valid && this.validate()){
      const student = this.buildStudent();
      this.dialogRef.close({ event: this.action, data: student });
    }else{
      this.matSnackBar.open('Complete correctamente los campos requeridos', 'INFO', {duration: 5000});
      this.firstForm.markAllAsTouched();
      this.secondForm.markAllAsTouched();
      this.thirdForm.markAllAsTouched();
    }
  }

  validate(): boolean
  {
    return validatePassword(this.thirdForm.get('password').value,this.thirdForm.get('confirmPassword').value);
  }
  
  closeDialog()
  {
    this.dialogRef.close({ event: 'Cancel' });
  }

  buildStudent()
  {
    let student = new Student();
    student.id = this.firstForm.get('id').value;
    student.name = this.firstForm.get('name').value;
    student.paternalSurname = this.firstForm.get('paternalSurname').value;
    student.maternalSurname = this.firstForm.get('maternalSurname').value;
    student.birthdate = this.firstForm.get('birthdate').value;
    student.ruc = this.firstForm.get('ruc').value;
    student.address = this.firstForm.get('address').value;
    student.phone = this.firstForm.get('phone').value;
    student.email = this.firstForm.get('email').value;
    student.gender = this.firstForm.get('gender').value;

    student.registrationDate = this.secondForm.get('registrationDate').value;
    student.nroGradeInstitution = this.secondForm.get('nroGradeInstitution').value;
    student.gradeInstitutionName = this.secondForm.get('gradeInstitutionName').value;
    student.typeParticipant = this.secondForm.get('typeParticipant').value;
    
    let user = new User();
    user.id = this.thirdForm.get('id').value;
    user.username = this.firstForm.get('email').value;
   
    
    if(this.thirdForm.get('password').value) 
    {
      user.password = this.thirdForm.get('password').value;
    }

    student.user = user;

    return student;
  } 
}
