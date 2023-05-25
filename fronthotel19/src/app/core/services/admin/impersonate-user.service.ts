import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base-service';

@Injectable({
  providedIn: 'root'
})
export class ImpersonateUserService extends BaseService {
  private readonly USER_ROLE_URL: string = '/api/user/role';

  // tslint:disable-next-line: unnecessary-constructor
  constructor(http: HttpClient) {
    super(http);
  }

  impersonateUserRole(): Observable<any> {
    return this.get(this.USER_ROLE_URL, {});
  }
}
