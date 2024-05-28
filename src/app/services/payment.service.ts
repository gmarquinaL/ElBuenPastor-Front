import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../model/payment.model';
import { GenericResponse } from '../model/generic-response.model';
import { GenericService } from './generic.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaymentService extends GenericService<Payment> {

  private apiUrl = `${environment.HOST}/payments`;

  constructor(http: HttpClient) {
    super(http, `${environment.HOST}/payments`);
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
  exportPayments(filters: any): Observable<Blob> {
    let params = new HttpParams();
    if (filters.name) {
      params = params.append('name', filters.name);
    }
    if (filters.fromDate) {
      params = params.append('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      params = params.append('toDate', filters.toDate);
    }
    
    return this.http.get(`${this.apiUrl}/export`, {
      params: params,
      responseType: 'blob'
    });
  
  }

}
