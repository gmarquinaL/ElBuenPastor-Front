import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../model/payment.model';
import { GenericResponse } from '../model/generic-response.model';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends GenericService<Payment> {

  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/payments');
  }

  getAll(): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/listAll`);
  }

  uploadFile(file: File): Observable<GenericResponse<any>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<GenericResponse<any>>(`${this.apiUrl}/upload`, formData);
  }

  getByName(name: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byName?name=${name}`);
  }

  getByCode(code: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byCode?code=${code}`);
  }

  getByConcept(concept: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byConcept?concept=${concept}`);
  }

  getByPaymentDate(paymentDate: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byPaymentDate?paymentDate=${paymentDate}`);
  }

  editPayment(id: number, payment: Payment): Observable<GenericResponse<Payment>> {
    return this.http.put<GenericResponse<Payment>>(`${this.apiUrl}/edit/${id}`, payment);
  }

  override delete(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }
}
