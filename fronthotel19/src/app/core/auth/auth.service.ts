import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './../services/base-service';
import { UserAuthorization } from './user-authorization.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private static readonly LOCAL_STORAGE_USER_KEY = 'currentUser';

  // store the URL so we can redirect after logging in
  redirectUrl: string;
  currentUser$: BehaviorSubject<UserAuthorization> = new BehaviorSubject({ user: undefined, expired: false });
  signForms$: BehaviorSubject<{ signInForm: ElementRef; signUpForm: ElementRef }> = new BehaviorSubject({ signInForm: null, signUpForm: null });
  isUserAuthenticated$: BehaviorSubject<any> = new BehaviorSubject(false);

  private readonly SIGNIN_URL = '/authenticaion/users/login';
  private readonly FORGOT_PASSWORD_URL = '/api/authentication/reset_password';
  private readonly UPDATE_PASSWORD_URL = '/api/authentication/update_password';
  private readonly SIGN_UP = '/authenticaion/users/create';
  private readonly currentUser = new ReplaySubject(1);

  // tslint:disable-next-line: unnecessary-constructor
  constructor(http: HttpClient) {
    super(http);
  }

  login(email: string, password: string, projectId: string): Observable<any> {
    return this.postAny<any>(this.SIGNIN_URL, { email, password }).pipe(
      map((res: any) => {
        if (res && res.access_token) {
          res.menu.forEach(element => {
            element.children = element.children.sort(this.compareMenuNumber);
            element.children.forEach(childMenu => {
              childMenu.children = childMenu.children.sort(this.compareMenuNumber);
            });
          });
          this.setCurrentUser(email, res, projectId);
          this.currentUser$.next({
            user: {
              menu: res.menu,
              id: res.id,
              userName: email,
              access_token: res.access_token,
              isSuperUser: res.isSuperUser,
              application: res.application,
              employeeId: res.employeeId,
              projectId
            },
            expired: false
          });
          this.isUserAuthenticated$.next(true);
        }

        return res;
      })
    );
  }

  compareMenuNumber(a, b): any {
    if (a.menuNumber < b.menuNumber) {
      return -1;
    } else if (a.menuNumber > b.menuNumber) {
      return 1;
    }

    return 0;
  }

  forgotPassword(email: string): Observable<void> {
    return this.postAny<void>(this.FORGOT_PASSWORD_URL, { email }).pipe(map((res: any) => res));
  }

  reset(password: string, confirm: string, digest: string): Observable<any> {
    return this.postAny<void>(this.FORGOT_PASSWORD_URL, { password, confirm, digest }).pipe(map((res: any) => res));
  }

  updatePass(postData: any): Observable<any> {
    return this.post<void>(this.UPDATE_PASSWORD_URL, postData).pipe(map((res: any) => res));
  }

  getCurrentUser(): any {
    return JSON.parse(this.getStorage().getItem('currentUser'));
  }

  isAuthorized(): boolean {
    const value: string = this.getStorage().getItem('currentUser');

    return value && value.length > 0;
  }

  logout(resultHandler): any {
    this.clearStorage();
    this.currentUser$.next(undefined);
    this.isUserAuthenticated$.next(false);

    return resultHandler();
  }

  clearStorage(): void {
    this.getStorage().clear();
  }

  getStorage(): Storage {
    return localStorage;
  }

  setCurrentUser(email: string, res: any, projectId: string): void {
    this.getStorage().setItem(
      AuthService.LOCAL_STORAGE_USER_KEY,
      JSON.stringify({
        email,
        id: res.id,
        token: res.access_token,
        menu: res.menu,
        isSuperUser: res.isSuperUser,
        application: res.application,
        employeeId: res.employeeId,
        contractorId: res.contractorId,
        projectId
      })
    );

    this.currentUser$.next({
      user: {
        userName: email,
        id: res.id,
        access_token: res.access_token,
        menu: res.menu,
        isSuperUser: res.isSuperUser,
        application: res.application,
        employeeId: res.employeeId,
        projectId
      },
      expired: false
    });
  }

  getClientId(): string {
    return this.getCurrentUser().id;
  }

  getEmployeeId(): string {
    return this.getCurrentUser().employeeId;
  }

  getClientApplication(): string {
    return this.getCurrentUser().application;
  }

  getClientIsSuper(): boolean {
    return this.getCurrentUser().isSuperUser;
  }

  getProjectId(): boolean {
    return this.getCurrentUser().projectId.id;
  }

  getProjectName(): boolean {
    return this.getCurrentUser().projectId?.details?.title;
  }
}
