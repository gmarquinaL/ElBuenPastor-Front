import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Payment } from 'src/app/model/payment.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-form-payment',
  templateUrl: './dialog-form-payment.component.html',
  styleUrls: ['./dialog-form-payment.component.scss']
})
export class DialogFormPaymentComponent {
  paymentForm: FormGroup;
  action: string;
  localData: any;

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
      paymentDate: [this.localData.paymentDate || '', Validators.required],
      dueDate: [this.localData.dueDate || '', Validators.required]
    });
  }

  doAction(): void {
    if (this.paymentForm.invalid) {
      this.snackBar.open('Formulario incompleto o con datos inválidos.', 'ERROR', { duration: 3000 });
      return;
    }

    const payment: Payment = this.paymentForm.value;
    if (this.action === 'Agregar') {
      this.paymentService.addPayment(payment).subscribe({
        next: (response) => {
          this.showSuccessMessage('Pago agregado correctamente');
          this.dialogRef.close({ event: 'Add', data: response.data });
        },
        error: () => this.showErrorMessage('Error al agregar pago')
      });
    } else if (this.action === 'Actualizar') {
      payment.id = this.localData.id;
      this.paymentService.editPayment(payment).subscribe({
        next: (response) => {
          this.showSuccessMessage('Pago actualizado correctamente');
          this.dialogRef.close({ event: 'Update', data: response.data });
        },
        error: () => this.showErrorMessage('Error al actualizar pago')
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showSuccessMessage(message: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: message
    });
  }

  showErrorMessage(message: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: message
    });
  }
}
