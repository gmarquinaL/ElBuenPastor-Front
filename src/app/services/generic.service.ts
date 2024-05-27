import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericResponse } from '../model/generic-response.model';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(
    protected http: HttpClient,
    @Inject(String) protected url: string,
  ) { }

  findAll(): Observable<GenericResponse<T[]>> {
    return this.http.get<GenericResponse<T[]>>(this.url);
  }

  findById(id: number): Observable<GenericResponse<T>> {
    return this.http.get<GenericResponse<T>>(`${this.url}/${id}`);
  }

  save(t: T): Observable<GenericResponse<T>> {
    return this.http.post<GenericResponse<T>>(this.url, t);
  }

  update(t: T, id: number): Observable<GenericResponse<T>> {
    return this.http.put<GenericResponse<T>>(`${this.url}/${id}`, t);
  }

  delete(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.url}/${id}`);
  }
}
