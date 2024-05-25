import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from 'src/app/services/payment.service';

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
        next: () => {
          this.snackBar.open('Archivo cargado exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close({ event: 'Upload' });
        },
        error: () => {
          this.snackBar.open('Error al cargar el archivo', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
