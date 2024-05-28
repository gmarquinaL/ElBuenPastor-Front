import { Person } from "./person.model";
import { Guardian } from './guardian.model';

export class Student extends Person{
    level: string;
    section: string;
    grade: string;
    current: boolean;
    guardian?: Guardian;
    siblings?: Student[];
}