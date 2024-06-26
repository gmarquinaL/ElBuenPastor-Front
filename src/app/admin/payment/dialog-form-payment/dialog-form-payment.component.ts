import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Payment } from 'src/app/model/payment.model';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'app-dialog-form-payment',
  templateUrl: './dialog-form-payment.component.html',
  styleUrls: ['./dialog-form-payment.component.scss']
})
export class DialogFormPaymentComponent {
  paymentForm: FormGroup;
  action: string;
  localData: any;

  currentDate: Moment = moment();
  minDate: Date = this.currentDate.clone().subtract(5, 'years').toDate();
  maxDate: Date = this.currentDate.clone().add(5, 'years').toDate();

  constructor(
    public dialogRef: MatDialogRef<DialogFormPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {
    this.localData = { ...data };
    this.action = this.localData.action;

    this.paymentForm = this.fb.group({
      id: [this.localData.id || null],
      name: [this.localData.name || '', Validators.required],
      concept: [this.localData.concept || '', Validators.required],
      amount: [this.localData.amount || '', [Validators.required, Validators.min(0.01)]],
      paymentDate: [this.localData.paymentDate || '', [Validators.required]],
      dueDate: [this.localData.dueDate || '', [Validators.required]]
    });
  }

  doAction(): void {
    if (this.paymentForm.invalid) {
      this.snackBar.open('Formulario incompleto o con datos inválidos.', 'ERROR', { duration: 3000 });
      return;
    }

    const payment: Payment = this.paymentForm.value;
    payment.id = this.localData.id;
    this.paymentService.editPayment(payment.id, payment).subscribe({
      next: (response) => {
        this.dialogRef.close({ event: 'Update', data: response.data });
      },
      error: () => this.showErrorMessage('Error al actualizar pago')
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showSuccessMessage(message: string): void {
    Swal.fire({
      icon: "success",
      title: `<div style="font-size: 24px;">${message}</div>`,
      showConfirmButton: false,
      timer: 3000
    });
  }

  showErrorMessage(message: string): void {
    Swal.fire({
      icon: "error",
      title: `<div style="font-size: 24px;">${message}</div>`,
      showConfirmButton: false,
      timer: 3000
    });
  }
}
