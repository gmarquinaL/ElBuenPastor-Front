import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MenuService } from '../services/menu.service';
import { map } from 'rxjs';
import { Menu } from '../model/menu.model';

export const guardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const menuService = inject(MenuService);
  
  let rpta = authService.isLogged();
    if (!rpta) {
     // authService.logout();
     sessionStorage.clear();
     router.navigate(['/authentication/side-login']);
      return false;
    }

    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    if (!helper.isTokenExpired(token)) {
      let url = state.url;

      return menuService.findAllByUsername().pipe(map( (data: Menu[]) => {
        menuService.setMenuChange(data);

        let cont = 0;
        for (let m of data) {
          if (url.startsWith(m.route)) {
            cont++;
            break;
          }
        }

        if (cont > 0) {
          return true;
        } else {
          router.navigate(['/pages/not-403']);
          return false;
        }

      }));

    } else {
      authService.logout();
      return false;
    }

};
