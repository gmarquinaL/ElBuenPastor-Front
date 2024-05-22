import { Person } from "./person.model";

export class Student extends Person
{
    registrationDate: Date;
    nroGradeInstitution: number;
    gradeInstitutionName: string;
    typeParticipant: string;
}