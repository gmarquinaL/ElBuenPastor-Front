export interface Payment {
  id: number;
  code: string;
  name: string;
  referenceDoc: string;
  concept: string;
  amount: number;
  agency: string;
  paymentDate: Date;
  dueDate: Date;
  paymentMethod: string;
  username: string;
}
