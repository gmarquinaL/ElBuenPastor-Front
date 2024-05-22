import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs'; 
import { tap, catchError, retry, finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {

    constructor(
                private snackBar: MatSnackBar, 
                private router : Router,
                public loaderService: LoaderService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.isLoading.next(true);
        return next.handle(request).pipe(retry(environment.REINTENTOS))
            .pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        throw new Error(event.body.errorMessage);
                    }/*else{
                        this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });    
                    }*/
                }
                //variable err tiene el response json del backend
            })).pipe(catchError((err) => {     
               // console.log(err);  
                //https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
                if (err.status === 400) {
                    this.snackBar.open(err.error?.message, 'ERROR 400', { duration: 3000, panelClass: ['warn-snackbar']});
                }
                else if (err.status === 404){
                    this.snackBar.open(err.error?.message, 'ERROR 404', { duration: 3000, panelClass: ['warn-snackbar']});
                }
                else if (err.status === 403 || err.status === 401) {
                    this.snackBar.open('La sesión ha expirado', 'ERROR 403', { duration: 3000, panelClass: ['warn-snackbar']});
                    sessionStorage.clear();
                    this.router.navigate(['/authentication/side-login']);
                }
                else if (err.status === 500) {                    
                    this.snackBar.open(err.error.message, 'ERROR 500', { duration: 3000, panelClass: ['warn-snackbar']});
                } else {
                    this.snackBar.open(err.error.message, 'ERROR', { duration: 3000, panelClass: ['warn-snackbar']});
                }
                return EMPTY;
            }),
                finalize(() => {
                    // Este bloque se ejecutará siempre al finalizar la petición, ya sea exitosa o fallida
                    this.loaderService.isLoading.next(false);
                })
            );
    }
}