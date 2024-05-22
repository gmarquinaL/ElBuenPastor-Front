import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sede } from 'src/app/model/sede.model';

@Component({
  selector: 'app-dialog-form-sede',
  templateUrl: './dialog-form-sede.component.html',
  styleUrls: ['./dialog-form-sede.component.scss']
})
export class DialogFormSedeComponent implements OnInit{

  action: string;
  form: FormGroup;
  local_data: any;
  joiningDate: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogFormSedeComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Sede,
    private matSnackBar: MatSnackBar,
    private fb: FormBuilder
  ) { 
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(new Date(this.local_data.DateOfJoining),'yyyy-MM-dd');
    }
  }

  ngOnInit(): void {
   
    this.createForm();
  }

  get f () { return this.form.controls; }

  createForm(): void 
  {
    this.form = this.fb.group({
      id: [this.local_data?.id],
      description: [this.local_data.description, [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      address: [this.local_data.address, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      phone: [this.local_data.phone, [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      contact: [this.local_data.contact, [Validators.required]],
    });
  }

  doAction(): void
  {
    if(this.form.valid){
      this.dialogRef.close({ event: this.action, data: this.form.value });
    }else{
      this.matSnackBar.open('Los datos no son válidos', 'INFO', { duration: 2000 });
      this.form.markAllAsTouched();
    }
  }

  closeDialog(): void
  {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
