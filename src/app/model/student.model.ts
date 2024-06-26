import { Guardian } from './guardian.model';

export class Student {
  id?: number;
  fullName: string;
  level: string;
  section: string;
  grade: string;
  gender: string;
  current: boolean;
  guardian?: Guardian;
  siblings?: Student[];
  
}
