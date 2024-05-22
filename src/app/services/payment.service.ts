import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../model/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/api/payments'; // Double-check this URL is correct, especially the double '/api/api'

  constructor(private http: HttpClient) { }

  // Obtain all payments
  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/listAll`);
  }

  // Upload a file and handle the file server-side
  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // Save a new payment
  save(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/add`, payment); // Ensure you have an endpoint to handle POST on '/add'
  }

  // Update an existing payment
  update(payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${payment.id}`, payment);
  }

  // Delete a payment by ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
