import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Role } from '../model/role.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends GenericService<Role> {

  constructor(
    protected override http: HttpClient
  ) { 
    super(http, `${environment.HOST}/roles`);
  }

  findByEnabled()
  {
    return this.http.get<Role[]>(`${this.url}/enabled`);
  }
}
