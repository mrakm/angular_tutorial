import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/services/base-service';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends BaseService {
  private static readonly BASE = '/configurations/vendors';

  // tslint:disable-next-line: unnecessary-constructor
  constructor(http: HttpClient) {
    super(http);
  }

  findAll(): Observable<any> {
    return this.get(this.makeUrl('findAll'));
  }

  find(id: any): Observable<any> {
    return this.get(this.makeUrl(`find/${id}`));
  }
  findMaterial(id: any): Observable<any> {
    return this.get(this.makeUrl(`findMaterial/${id}`));
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
    return VendorService.BASE;
  }
}
