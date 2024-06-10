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

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.file = target.files ? target.files[0] : null;
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
          Swal.fire({
            html: `<span style="font-size: 22px;">${response.message}</span>`, 
            icon: 'success',
            showConfirmButton: true
          }).then(() => {
            this.dialogRef.close(response); 
          });
        },
        error: (error) => {
          let errorMessage = 'Error al cargar el archivo. Por favor, verifique que es el archivo correcto.';
          if (error.status === 400) {
            errorMessage = error.error.message || errorMessage;
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
