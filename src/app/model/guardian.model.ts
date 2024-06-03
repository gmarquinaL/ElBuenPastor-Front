import { Student } from './student.model'; 

export interface Guardian {
  id?: number;  // Opcional para permitir nuevos guardianes sin ID
  fullName: string;
  livesWithStudent: boolean;
  students?: Student[]; 
}
