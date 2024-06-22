import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { StudentComponent } from './students/student.component';
import { PaymentComponent } from './payment/payment.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { SharedModule } from '../shared/shared.module';
import { DialogFormPaymentComponent } from './payment/dialog-form-payment/dialog-form-payment.component';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { CustomDateAdapter } from '../shared/custom-adapter';
import { DialogUploadFileComponent } from './payment/dialog-upload-file/dialog-upload-file.component';
import { StudentDialogComponent } from './students/student-dialog/student-dialog.component';
import { StudentDetailsComponent } from './students/student-details/student-details.component';
import { OnlyLettersDirective } from './only-letters.directive';
import { AutoFormatDateDirective } from './auto-format-date.directive';
import { UppercaseLettersAndHyphensDirective } from './appUppercaseLettersAndHyphens';
@NgModule({
  declarations: [
    StudentComponent,
    PaymentComponent,
    DialogFormPaymentComponent,
    DialogUploadFileComponent,
    StudentDialogComponent,
    StudentDetailsComponent,
    OnlyLettersDirective,
    AutoFormatDateDirective,
    UppercaseLettersAndHyphensDirective
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
    ReactiveFormsModule,

  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
})
export class AdminModule { }
