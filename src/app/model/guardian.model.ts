import { Person } from './person.model';
import { Student } from './student.model'; 

export interface Guardian extends Person {
  livesWithStudent: boolean;
  students?: Student[]; 
}
