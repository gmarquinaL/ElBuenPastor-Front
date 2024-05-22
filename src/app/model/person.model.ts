import { usuario } from "./user.model";

export class Person 
{
    id: number;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    birthdate: Date;
    ruc: string;
    address: string;
    phone: string;
    email: string;
    gender: string;
    user: usuario;
}