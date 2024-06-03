import { Student } from './student.model';

export class Guardian {
  id?: number;
  fullName: string;
  livesWithStudent: boolean;
  students?: Student[];
}
