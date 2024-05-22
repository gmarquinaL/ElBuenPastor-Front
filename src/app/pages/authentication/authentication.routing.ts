import { Routes } from '@angular/router';

import { AppErrorComponent } from './error/error.component';
import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { loginGuard } from 'src/app/guards/login.guard';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'error',
        component: AppErrorComponent,
      },

      {
        path: 'side-login',
        component: AppSideLoginComponent,
        canActivate: [loginGuard]
      },
      {
        path: 'side-register',
        component: AppSideRegisterComponent,
      },
    ],
  },
];
