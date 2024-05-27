import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Student } from 'src/app/model/student.model';
import { StudentService } from 'src/app/services/student.service';
import { GENDERS } from 'src/app/shared/util/constants.util';
import { DialogFormStudentsComponent } from './dialog-form-students/dialog-form-students.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit{

  students: Student[] = [];
  searchText: any;
  genders = GENDERS;
  constructor(
    public dialog: MatDialog,
    private studentService: StudentService,
    private matSnackBar: MatSnackBar
  ) {
    
    //console.log(this.contacts);
  }

  ngOnInit(): void {
    this.getStudents();
  }



  openDialog(action: string, obj: any)
  {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogFormStudentsComponent, {
      data: obj,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Registrar') {
        this.add(result.data);
      } else if (result.event === 'Actualizar') {
        this.update(result.data);
      } else if (result.event === 'Eliminar') {
        this.delete(result.data);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.students = this.filter(filterValue);
  }

  filter(v: string): Student[] {
    return this.getStudents()
      .filter(
        (x) => x.name.toLowerCase().indexOf(v.toLowerCase()) !== -1
      );
  }

  getStudents(): Student[] {
    let students: Student[] = [];
    this.studentService.getAll();
    this.studentService.dataChange.subscribe((data) => {
      students = data;
    });
  
    return students;
  }

  add(obj: any): void {
    this.studentService.save(obj).subscribe((data) => {
      this.matSnackBar.open('Estudiante registrado correctamente', 'INFO', {duration: 2000});

    });  
  }

  update(obj: any): void {
    this.studentService.update(obj, obj.id).subscribe((data) => {
      this.matSnackBar.open('Estudiante actualizado correctamente', 'INFO', {duration: 2000});

    });  
  }

  delete(obj: any): void {
    this.studentService.delete(obj.id).subscribe((data) => {
      this.matSnackBar.open('Estudiante eliminado correctamente', 'INFO', {duration: 2000});

    });
  }
}
