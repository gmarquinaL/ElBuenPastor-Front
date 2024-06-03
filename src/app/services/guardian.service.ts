import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guardian } from '../model/guardian.model';
import { GenericResponse } from '../model/generic-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuardianService {

  private apiUrl = `${environment.HOST}/guardians`;

  constructor(private http: HttpClient) { }

  getAllGuardians(): Observable<GenericResponse<Guardian[]>> {
    return this.http.get<GenericResponse<Guardian[]>>(`${this.apiUrl}/all`);
  }

  getGuardianDetails(id: number): Observable<GenericResponse<Guardian>> {
    return this.http.get<GenericResponse<Guardian>>(`${this.apiUrl}/${id}`);
  }

  addGuardian(guardian: Guardian): Observable<GenericResponse<Guardian>> {
    return this.http.post<GenericResponse<Guardian>>(`${this.apiUrl}/add`, guardian);
  }

  updateGuardian(id: number, guardian: Guardian): Observable<GenericResponse<Guardian>> {
    return this.http.put<GenericResponse<Guardian>>(`${this.apiUrl}/update/${id}`, guardian);
  }

  deleteGuardian(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }
  searchGuardians(query: string): Observable<GenericResponse<Guardian[]>> {
    return this.http.get<GenericResponse<Guardian[]>>(`${this.apiUrl}/search?query=${query}`);
  }
}
