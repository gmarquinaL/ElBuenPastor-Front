import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from '../model/menu.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu>{
  private menuChange = new Subject<Menu[]>();
  
  constructor(
    protected override http: HttpClient,
  ) {
    super(http, `${environment.HOST}/menus`);
  }
  findAllByUsername() {
    return this.http.get<Menu[]>(`${this.url}/username`);
  }

  getMenuChange(){
    return this.menuChange.asObservable();
  }

  setMenuChange(menus: Menu[]){
    this.menuChange.next(menus);
  }
}
