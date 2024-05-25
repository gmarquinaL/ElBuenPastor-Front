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

  // Obtener todos los pagos
  getAll(): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/listAll`);
  }

  // Subir archivo
  uploadFile(file: File): Observable<GenericResponse<Payment[]>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<GenericResponse<Payment[]>>(`${this.apiUrl}/upload`, formData);
  }

  // Obtener pagos por nombre
  getByName(name: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byName?name=${name}`);
  }

  // Obtener pagos por código
  getByCode(code: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byCode?code=${code}`);
  }

  // Obtener pagos por concepto
  getByConcept(concept: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byConcept?concept=${concept}`);
  }

  // Obtener pagos por fecha de pago
  getByPaymentDate(paymentDate: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byPaymentDate?paymentDate=${paymentDate}`);
  }

  // Obtener pagos por múltiples filtros
  getByNameCodeConceptPaymentDate(name: string, code: string, concept: string, paymentDate: string): Observable<GenericResponse<Payment[]>> {
    return this.http.get<GenericResponse<Payment[]>>(`${this.apiUrl}/byNameCodeConceptPaymentDate?name=${name}&code=${code}&concept=${concept}&paymentDate=${paymentDate}`);
  }

  // Guardar un nuevo pago
  save(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}`, payment);
  }

  // Actualizar un pago existente
  update(payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${payment.id}`, payment);
  }

  // Eliminar un pago por ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtener códigos distintos
  getDistinctCodes(): Observable<GenericResponse<string[]>> {
    return this.http.get<GenericResponse<string[]>>(`${this.apiUrl}/distinct/codes`);
  }

  // Obtener conceptos distintos
  getDistinctConcepts(): Observable<GenericResponse<string[]>> {
    return this.http.get<GenericResponse<string[]>>(`${this.apiUrl}/distinct/concepts`);
  }

  // Obtener fechas de pago distintas
  getDistinctPaymentDates(): Observable<GenericResponse<Date[]>> {
    return this.http.get<GenericResponse<Date[]>>(`${this.apiUrl}/distinct/paymentDates`);
  }

  // Obtener nombres distintos
  getDistinctNames(): Observable<GenericResponse<string[]>> {
    return this.http.get<GenericResponse<string[]>>(`${this.apiUrl}/distinct/names`);
  }
}
