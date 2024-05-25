import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { StudentsComponent } from './students/students.component';
import { PaymentComponent } from './payment/payment.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { SharedModule } from '../shared/shared.module';
import { DialogFormStudentsComponent } from './students/dialog-form-students/dialog-form-students.component';
import { DialogFormPaymentComponent } from './payment/dialog-form-payment/dialog-form-payment.component';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { CustomDateAdapter } from '../shared/custom-adapter';
import { DialogUploadFileComponent } from './payment/dialog-upload-file/dialog-upload-file.component';

@NgModule({
  declarations: [
    StudentsComponent,
    PaymentComponent,
    DialogFormStudentsComponent,
    DialogFormPaymentComponent,
    DialogUploadFileComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
})
export class AdminModule { }
