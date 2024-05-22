import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  
  let rpta = authService.isLogged();
  if (!rpta) {
    return true;
  }

  return false;
};
