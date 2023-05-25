import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {
  private static readonly BASE = '/configurations/roles';

  // tslint:disable-next-line: unnecessary-constructor
  constructor(http: HttpClient) {
    super(http);
  }

  findAll(): Observable<any> {
    return this.get(this.makeUrl(`findAll`));
  }

  find(id: any): Observable<any> {
    return this.get(this.makeUrl(`find/${id}`));
  }

  create(role: any): Observable<any> {
    return this.post(this.makeUrl('create'), role);
  }

  update(id: any, role: any): Observable<any> {
    return this.put(this.makeUrl(`update/${id}`), role);
  }

  remove(id: any): Observable<any> {
    return this.delete(this.makeUrl(`delete/${id}`));
  }

  protected baseUrl(): string {
    return RoleService.BASE;
  }
}
