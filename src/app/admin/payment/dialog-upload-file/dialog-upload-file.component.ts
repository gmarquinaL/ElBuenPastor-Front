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
    const allowedExtensions = ['xlsx', 'xls'];
    const fileExtension = this.file?.name.split('.').pop()?.toLowerCase();

    if (this.file && !allowedExtensions.includes(fileExtension)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato de archivo no válido',
        text: 'Por favor, suba un archivo Excel (.xlsx o .xls).',
        showConfirmButton: true
      });
      this.file = null;
    }
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
          let errorMessage = 'Error al cargar el archivo. Por favor, verifique que es el archivo correcto.';
          if (error.status === 400) {
            switch (error.error?.status) {
              case -4:
                errorMessage = 'El archivo subido está vacío.';
                break;
              case -3:
                errorMessage = 'El archivo subido no es un archivo de pagos válido.';
                break;
              case -2:
                errorMessage = 'El archivo subido no contiene registros de pagos válidos.';
                break;
              default:
                errorMessage = 'Error al cargar el archivo. Por favor, verifique que es el archivo correcto.';
            }
          }
          Swal.fire({
            icon: 'error',
            title: 'Archivo no válido',
            text: errorMessage,
            showConfirmButton: true
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Archivo no seleccionado',
        text: 'Por favor, seleccione un archivo para subir.',
        showConfirmButton: true
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}