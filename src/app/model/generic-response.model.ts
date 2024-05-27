export interface GenericResponse<T> {
  data: T;
  additionalInfo?: {
    newPaymentsCount?: number;
    existingPaymentsCount?: number;
  };
  message: string;
  status: number;
}
