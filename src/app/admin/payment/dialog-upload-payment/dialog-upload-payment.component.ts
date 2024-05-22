import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-upload-file',
  templateUrl: './dialog-upload-payment.component.html',
  styleUrls: ['./dialog-upload-payment.component.scss']
})
export class DialogUploadFileComponent {
  file: File | null = null;
  isLoading = false; 

  constructor(
    public dialogRef: MatDialogRef<DialogUploadFileComponent>,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  onFileSelected(event: any): void {
    this.file = event.target.files[0] || null; 
  }

  uploadFile(): void {
    if (!this.file) {
      this.snackBar.open('Por favor, seleccione un archivo primero.', 'INFO', { duration: 2000 });
      return;
    }
    this.isLoading = true;
    this.paymentService.uploadFile(this.file).subscribe({
      next: () => {
        this.snackBar.open('Archivo cargado correctamente', 'INFO', { duration: 2000 });
        this.dialogRef.close({ event: 'Cargar' });
      },
      error: (error) => {
        this.snackBar.open(`Error al cargar el archivo: ${error.error.message}`, 'ERROR', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancelar' });
  }
}
