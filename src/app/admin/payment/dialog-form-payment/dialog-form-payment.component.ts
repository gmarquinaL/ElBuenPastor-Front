import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Payment } from 'src/app/model/payment.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-form-payment',
  templateUrl: './dialog-form-payment.component.html',
  styleUrls: ['./dialog-form-payment.component.scss']
})
export class DialogFormPaymentComponent {
  action: string;
  localData: any;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogFormPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.localData = { ...data };
    this.action = this.localData.action || data.action;
    this.form = this.fb.group({
      id: [this.localData.id],
      name: [this.localData.name, [Validators.required]],
      concept: [this.localData.concept, [Validators.required]],
      amount: [this.localData.amount, [Validators.required, Validators.min(0)]],
      paymentDate: [this.localData.paymentDate, [Validators.required]],
      dueDate: [this.localData.dueDate, [Validators.required]],
    });
  }

  get f() { return this.form.controls; }

  doAction(): void {
    if (this.form.valid) {
      this.dialogRef.close({ event: this.action, data: this.form.value });
    } else {
      this.snackBar.open('Por favor, completa todos los campos correctamente.', 'ERROR', {
        duration: 2000,
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancelar' });
  }
}
