import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment } from 'src/app/model/payment.model';
import { DialogFormPaymentComponent } from './dialog-form-payment/dialog-form-payment.component';
import { DialogUploadFileComponent } from './dialog-upload-file/dialog-upload-file.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  displayedColumns: string[] = ['name', 'concept', 'amount', 'paymentDate', 'dueDate', 'actions'];

  constructor(
    public dialog: MatDialog,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getPayments();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPayments = this.payments.filter(payment =>
      payment.name.toLowerCase().includes(filterValue) ||
      payment.concept.toLowerCase().includes(filterValue)
    );
  }

  getPayments(): void {
    this.paymentService.getAll().subscribe({
      next: (response) => {
        this.payments = response.data;
        this.filteredPayments = response.data;
      },
      error: () => this.snackBar.open('Error loading payments', 'ERROR', { duration: 3000 })
    });
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogFormPaymentComponent, {
      data: obj,
      disableClose: true,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event === 'UpdateList') {
        this.getPayments();
      }
    });
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(DialogUploadFileComponent, {
      disableClose: true,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event === 'Upload') {
        this.getPayments();
      }
    });
  }
}
