import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './students/student.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: 'students',
    component: StudentComponent
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
