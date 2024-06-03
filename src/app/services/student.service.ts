// student.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../model/student.model';
import { StudentSimple } from '../model/studentSimple.model';
import { GenericResponse } from '../model/generic-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = `${environment.HOST}/students`;

  constructor(private http: HttpClient) { }

  getAllStudentsSimple(): Observable<GenericResponse<StudentSimple[]>> {
    return this.http.get<GenericResponse<StudentSimple[]>>(`${this.apiUrl}/simple`);
  }

  getStudentDetails(id: number): Observable<GenericResponse<Student>> {
    return this.http.get<GenericResponse<Student>>(`${this.apiUrl}/${id}`);
  }

  addStudent(student: Student): Observable<GenericResponse<Student>> {
    return this.http.post<GenericResponse<Student>>(`${this.apiUrl}/add`, student);
  }

  updateStudent(student: Student): Observable<GenericResponse<Student>> {
    return this.http.put<GenericResponse<Student>>(`${this.apiUrl}/update/${student.id}`, student);
  }

  deleteStudent(id: number): Observable<GenericResponse<void>> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/delete/${id}`);
  }

  assignGuardianToStudent(studentId: number, guardianId: number): Observable<GenericResponse<Student>> {
    return this.http.post<GenericResponse<Student>>(`${this.apiUrl}/assignGuardian/${studentId}/${guardianId}`, {});
  }

  assignSiblingToStudent(studentId: number, siblingId: number): Observable<GenericResponse<Student>> {
    return this.http.post<GenericResponse<Student>>(`${this.apiUrl}/assignSibling/${studentId}/${siblingId}`, {});
  }
  searchStudents(query: string): Observable<GenericResponse<StudentSimple[]>> {
    return this.http.get<GenericResponse<StudentSimple[]>>(`${this.apiUrl}/search?query=${query}`);
  }
}
