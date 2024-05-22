import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtRequest } from '../model/jwtRequest.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url : string = `${environment.HOST}/auth`

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(jwtRequest : JwtRequest)
  {
    const encodedUser = {
      username: encodeURIComponent(jwtRequest.username),
      password: encodeURIComponent(jwtRequest.password)
    };
  
    const headers = {
      'Content-Type': 'application/json' 
    };

    return this.http.post<any>(`${this.url}/login`, encodedUser, {headers: headers});
  }

  isLogged(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null
  }

  logout()
  {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    this.http.get(`${environment.HOST}/logout`, { headers: headers }).subscribe({
      next: () => {
        sessionStorage.clear();
        this.router.navigate(['authentication/side-login']);
      }
    });
  }

  private code_login(username: string, password: string){
    const encodedData = {
      username: encodeURIComponent(username),
      password: encodeURIComponent(password)
    }

    return encodedData;
  }
}
