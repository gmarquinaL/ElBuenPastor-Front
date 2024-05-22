import { JwtHelperService } from "@auth0/angular-jwt";
import { parseISO } from "date-fns";
import { environment } from "src/environments/environment";

export const COURSE_STATUS = 
[
    {value: 'ACTIVE', name: 'ACTIVO'},
    {value: 'INACTIVE', name: 'INACTIVO'}
];

export const DURATION_TIMES =
[
    {value: 'DIAS', name: 'DIAS'},
    {value: 'SEMANAS', name: 'SEMANAS'},
    {value: 'MESES', name: 'MESES'},
]

export const GENDERS =
[
    {value: 'MALE', name: 'MASCULINO'},
    {value: 'FEMALE', name: 'FEMENINO'},
]

export const ROLES = [
    {id: 1, name: 'ADMIN'},
    {id: 2, name: 'TEACHER'},
    {id: 3, name: 'STUDENT'}
]

export const TYPE_STUDENTS = [
    {value: 'NEW', name: 'NUEVO'},
    {value: 'OLD', name: 'ANTIGUO'},
]

export const GRADE_INSTITUTIONS = [
    {value: 'PRIMARY', name: 'PRIMARIA'},
    {value: 'SECONDARY', name: 'SECUNDARIA'},
]

export const TYPE_COURSES = [
    {value: 'ONLINE', name: 'VIRTUAL'},
    {value: 'ON_SITE', name: 'PRESENCIAL'},
];

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function getToken(): any{
    const helper = new JwtHelperService();  
    return helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
}

export function validatePassword(password: string, confirmPassword: string): boolean
{
    return password === confirmPassword;
}

export function dateUTC(date: Date) {
    return parseISO(date?.toString());
}

export const OPTIONS_DATE: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
    timeZone: 'America/Lima'
  };