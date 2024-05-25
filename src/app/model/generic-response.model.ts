export interface GenericResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}
