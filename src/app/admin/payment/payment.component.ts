import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment } from 'src/app/model/payment.model';
import { DialogFormPaymentComponent } from './dialog-form-payment/dialog-form-payment.component';
import { DialogUploadFileComponent } from './dialog-upload-file/dialog-upload-file.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { exportPaymentsToExcel } from 'src/assets/excel-export.js';
import { logoBase64 } from '../payment/logoBase64';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  payments: Payment[] = [];
  dataSource = new MatTableDataSource<Payment>();
  displayedColumns: string[] = ['name', 'concept', 'amount', 'paymentDate', 'dueDate', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    this.paymentService.getAll().subscribe(response => {
      this.payments = response.data;
    });
    this.loadPayments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadPayments(): void {
    this.paymentService.getAll().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.snackBar.open('Error al cargar los pagos', 'ERROR', { duration: 3000 })
    });
  }

  applyTextFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.textFilter = filterValue;
    this.applyFilters();
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter = JSON.stringify({ text: this.textFilter, fromDate: this.paymentDateFrom, toDate: this.paymentDateTo });
  }

  createFilter(): (data: Payment, filter: string) => boolean {
    let filterFunction = function(data: Payment, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      const textMatch = data.name.toLowerCase().includes(searchTerms.text.toLowerCase()) || data.concept.toLowerCase().includes(searchTerms.text.toLowerCase());
      const paymentDate = new Date(data.paymentDate).getTime();
      const fromDate = searchTerms.fromDate ? new Date(searchTerms.fromDate).getTime() : null;
      const toDate = searchTerms.toDate ? new Date(searchTerms.toDate).getTime() : null;
      return textMatch && 
             (fromDate ? paymentDate >= fromDate : true) && 
             (toDate ? paymentDate <= toDate : true);
    };
    return filterFunction;
  }
  clearFilters(): void {
    this.textFilter = '';
    this.paymentDateFrom = null;
    this.paymentDateTo = null;
    this.dataSource.filter = '';
  }

  
  openDialog(action: string, obj: any = {}): void {
    const dialogRef = this.dialog.open(DialogFormPaymentComponent, {
      data: { ...obj, action: action },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.event === 'Update') {
        let index = this.dataSource.data.findIndex(p => p.id === obj.id);
        if (index !== -1) {
          this.dataSource.data[index] = { ...this.dataSource.data[index], ...result.data };
          this.dataSource._updateChangeSubscription(); // Refresh the data source to update the table
        }
        this.showSuccessMessage('Pago actualizado correctamente');
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
    this.loadPayments();
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
            this.loadPayments();
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

 /* exportToExcel(): void {
    // Convertir las fechas a formato ISO solo fecha (yyyy-MM-dd)
    const filters = {
      name: this.textFilter,
      startDate: this.paymentDateFrom ? this.formatDate(this.paymentDateFrom) : null,
      endDate: this.paymentDateTo ? this.formatDate(this.paymentDateTo) : null
    };
  
    this.paymentService.exportFilteredPayments(filters.name, filters.startDate, filters.endDate).subscribe(data => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'filtered_payments_report.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      this.snackBar.open('Error al descargar el archivo: ' + error.message, 'ERROR', { duration: 5000 });
    });
  }
  
  // Función auxiliar para formatear fechas
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Extrae y retorna solo la fecha en formato yyyy-MM-dd
  }
  
  */
  
  exportToExcel(): void {
    const filteredData = this.dataSource.filteredData.length ? this.dataSource.filteredData : this.dataSource.data;
    exportPaymentsToExcel(filteredData, logoBase64);
  }

  
  viewPaymentDetails(payment: Payment): void {
    this.dialog.open(PaymentDetailsComponent, {
      width: '400px',
      data: payment
    });
  }

  showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: true
    });
  }

  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: message,
      showConfirmButton: true
    });
  }
}
