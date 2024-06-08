import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentService } from 'src/app/services/student.service';
import { Student } from 'src/app/model/student.model';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {
  student: Student;

  constructor(
    private studentService: StudentService,
    public dialogRef: MatDialogRef<StudentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.student = data.student;
  }

  ngOnInit(): void {
    this.getStudentDetails(this.student.id);
  }

  getStudentDetails(id: number): void {
    this.studentService.getStudentDetails(id).subscribe(response => {
      this.student = response.data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
