import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends BaseService {
  private static readonly BASE = '/configurations/menus';

  // tslint:disable-next-line: unnecessary-constructor
  constructor(http: HttpClient) {
    super(http);
  }

  findAll(): Observable<any> {
    return this.get(this.makeUrl('findAll'));
  }

  find(): Observable<any> {
    return this.get(this.makeUrl(`find`));
  }

  create(department: any): Observable<any> {
    return this.post(this.makeUrl('create'), department);
  }

  update(id: any, department: any): Observable<any> {
    return this.put(this.makeUrl(`update/${id}`), department);
  }

  remove(id: any): Observable<any> {
    return this.delete(this.makeUrl(`delete/${id}`));
  }

  protected baseUrl(): string {
    return MenuService.BASE;
  }
}
