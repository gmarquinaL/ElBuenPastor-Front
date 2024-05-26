import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../model/payment.model';
import { GenericResponse } from '../model/generic-response.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) { }

  // Obtain all payments
  getAll(): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/listAll`);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // Retrieve payments by name
  getByName(name: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byName?name=${name}`);
  }

  // Retrieve payments by code
  getByCode(code: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byCode?code=${code}`);
  }

  // Retrieve payments by concept
  getByConcept(concept: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byConcept?concept=${concept}`);
  }

  // Retrieve payments by payment date
  getByPaymentDate(paymentDate: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byPaymentDate?paymentDate=${paymentDate}`);
  }

  // Save a new payment
  addPayment(payment: Payment): Observable<GenericResponse<Payment>> {
    return this.http.post<GenericResponse<Payment>>(`${this.apiUrl}/add`, payment);
  }

  // Update an existing payment
  editPayment(payment: Payment): Observable<GenericResponse<Payment>> {
    return this.http.put<GenericResponse<Payment>>(`${this.apiUrl}/edit/${payment.id}`, payment);
  }

  // Delete a payment by ID
  delete(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }
}
