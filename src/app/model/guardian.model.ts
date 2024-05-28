import { Student } from './student.model'; 

export interface Guardian {
  id : number;
  fullName: String;
  livesWithStudent: boolean;
  students?: Student[]; 
}
