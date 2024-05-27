import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Import Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { FilterPipe } from './pipe/filter.pipe';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ServerErrorsInterceptor } from './shared/server-errors.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CustomDateAdapter } from './shared/custom-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';

import { JwtModule } from "@auth0/angular-jwt";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './admin/payment/confirm-dialog/confirm-dialog.component';
import { PaymentDetailsComponent } from './admin/payment/payment-details/payment-details.component';


export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter(){
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [AppComponent, BlankComponent, FilterPipe, ConfirmDialogComponent, PaymentDetailsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatCardModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    TablerIconsModule.pick(TablerIcons),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:8080"],
        disallowedRoutes: [
        "http://localhost:8080/api/auth/login", 
        ],
      }
    }),
    NgScrollbarModule,
    FullComponent,
  ],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MatDialogRef, useValue: {} }

  ],
})
export class AppModule {}
