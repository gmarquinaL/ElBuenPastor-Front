import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Sede } from '../model/sede.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SedesService extends GenericService<Sede>{

  constructor(
    protected override http: HttpClient,
  ) {
    super(http, `${environment.HOST}/sedes`);
   }
}
