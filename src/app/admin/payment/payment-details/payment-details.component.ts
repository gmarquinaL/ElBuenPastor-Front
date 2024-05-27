import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Payment } from 'src/app/model/payment.model';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent {

  constructor(
    public dialogRef: MatDialogRef<PaymentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Payment
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
