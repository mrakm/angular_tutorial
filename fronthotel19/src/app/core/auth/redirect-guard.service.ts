import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class RedirectGuard implements CanLoad {
  constructor(private readonly authService: AuthService, private readonly router: Router) { }
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.authService.isAuthorized()) {
      return true;
    }

    // redirect to home if user is already signed in
    this.router.navigate(['a/d/product']);
  }
}
