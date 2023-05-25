import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router, private readonly snackBar: MatSnackBar) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // this will be passed from the route config on the data property
    const expectedRole = route.data.expectedRole;

    return this.checkAccess(expectedRole);
  }

  checkAccess(expectedRole: string): boolean {
    // const role = this.authService.getRole();

    // if (role === expectedRole) {
    return true;
    // }

    // navigate to dashboard
    // this.gotoDashboard();
  }

  private gotoDashboard(): void {
    this.snackBar.open('You are not allowed on this page.');
    // const dbNavigator = new DashboardNavigator(this.authService.getRole(), this.authService.getCurrentUser().settings);
    // this.router.navigate([dbNavigator.go().url]);
  }
}
