import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from 'src/app/services/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-upload-file',
  templateUrl: './dialog-upload-file.component.html',
  styleUrls: ['./dialog-upload-file.component.scss']
})
export class DialogUploadFileComponent {
  file: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<DialogUploadFileComponent>,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) { }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }

  uploadFile(): void {
    if (this.file) {
      this.paymentService.uploadFile(this.file).subscribe({
        next: (response) => {
          const newPaymentsCount = response.additionalInfo?.newPaymentsCount || 0;
          const existingPaymentsCount = response.additionalInfo?.existingPaymentsCount || 0;
          let message = `<span style="font-size: 24px;">Se agregaron ${newPaymentsCount} pagos nuevos.</span>`;
          if (existingPaymentsCount > 0) {
            message += `<br><span style="font-size: 18px;">${existingPaymentsCount} pagos ya existían y no se añadieron.</span>`;
          }
          Swal.fire({
            icon: 'success',
            title: message,
            showConfirmButton: true
          }).then(() => {
            this.dialogRef.close({ event: 'Upload', newPaymentsCount, existingPaymentsCount });
          });
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Error al cargar el archivo';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
