import { Injectable } from '@angular/core';
import { Student } from '../model/student.model';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService extends GenericService<Student>{

  dataChange: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);
  constructor(
    protected override http: HttpClient
  ) { 
    super(http, `${environment.HOST}/students`);
  }

  get data(): Student[] {
    return this.dataChange.value;
  }
  
  getAll(): void {
    this.http.get<Student[]>(`${environment.HOST}/students`).subscribe((data) => {
      this.dataChange.next(data);
    });
  }

  findAllEnabled()
  {
    return this.http.get<Student[]>(`${this.url}/enabled`);
  }
}
