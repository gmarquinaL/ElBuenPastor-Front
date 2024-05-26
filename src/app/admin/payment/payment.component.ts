import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment } from 'src/app/model/payment.model';
import { DialogFormPaymentComponent } from './dialog-form-payment/dialog-form-payment.component';
import { DialogUploadFileComponent } from './dialog-upload-file/dialog-upload-file.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  displayedColumns: string[] = ['name', 'concept', 'amount', 'paymentDate', 'dueDate', 'actions'];
  paymentDateFrom: Date | null = null;
  paymentDateTo: Date | null = null;
  textFilter: string = '';

  constructor(
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getPayments();
  }

  applyTextFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.textFilter = filterValue;
    this.applyFilters();
  }

  applyDateFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const matchesText = payment.name.toLowerCase().includes(this.textFilter) || 
                          payment.concept.toLowerCase().includes(this.textFilter);
      const matchesDate = (!this.paymentDateFrom || new Date(payment.paymentDate) >= this.paymentDateFrom) &&
                          (!this.paymentDateTo || new Date(payment.paymentDate) <= this.paymentDateTo);
      return matchesText && matchesDate;
    });
    this.cdRef.detectChanges();
  }

  getPayments(): void {
    this.paymentService.getAll().subscribe({
      next: (response) => {
        this.payments = [...response.data];
        this.filteredPayments = [...response.data];
        this.applyFilters(); // Ensure filters are applied initially
      },
      error: () => this.snackBar.open('Error al cargar los pagos', 'ERROR', { duration: 3000 })
    });
  }

  openDialog(action: string, obj: any = {}): void {
    const dialogRef = this.dialog.open(DialogFormPaymentComponent, {
      data: { ...obj, action: action },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === 'Add') {
          this.payments.push(result.data);
          this.filteredPayments = [...this.payments];
        } else if (result.event === 'Update') {
          this.updateLocalPayment(result.data);
        }
        this.applyFilters(); 
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

  deletePayment(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: '¿Estás seguro que deseas eliminarlo?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.delete(id).subscribe({
          next: () => {
            this.payments = this.payments.filter(p => p.id !== id);
            this.filteredPayments = this.filteredPayments.filter(p => p.id !== id);
            this.refreshTable();
            this.showSuccessMessage('Pago eliminado correctamente');
          },
          error: () => this.showErrorMessage('Error al eliminar el pago')
        });
      }
    });
  }

  editPayment(payment: Payment): void {
    this.openDialog('Actualizar', payment);
  }

  updateLocalPayment(updatedPayment: Payment): void {
    const index = this.payments.findIndex(p => p.id === updatedPayment.id);
    if (index !== -1) {
      this.payments[index] = updatedPayment;
      this.filteredPayments[index] = updatedPayment;
      this.refreshTable();
    }
  }

  refreshTable(): void {
    this.payments = [...this.payments];
    this.filteredPayments = [...this.filteredPayments];
    this.cdRef.detectChanges();
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
