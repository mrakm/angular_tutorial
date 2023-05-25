import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GLOBALS } from 'src/app/config/globals';
import { ResetPasswordComponent } from 'src/app/shared/components/reset-password/reset-password.component';
import { Notification, PNotifyService } from '../../core';
import { AuthDialogService, AuthService, UserAuthorization } from '../../core/auth';
import { SidenavService } from '../services/sidenav.service';
import { TranslationService } from '../services/translation.service';
import { SideNavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  langToFlagsNameMap: any = {
    en: 'us',
    'es-MX': 'mx',
    es: 'mx'
  };

  user: any = {};
  flagName;
  isGuest = false;
  isClient = false;
  email: string;
  notifications: Array<Notification> = [];
  hasUnreadNotifications = false;
  menuItems: any = [];
  activeSource = '';
  domesticViolenceSelected = false;

  hiddenPages: any = [];
  selectedOption: string;
  selectedImageValue: string;

  settings$: Observable<any>;

  currentUser$: BehaviorSubject<UserAuthorization> = new BehaviorSubject({ user: null, expired: false });
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;
  selectedProject = this.authService.getProjectName();
  private readonly unsubscribe: Subject<void> = new Subject();

  constructor(
    private readonly translate: TranslateService,
    private readonly translationService: TranslationService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authDialogService: AuthDialogService,
    private readonly pnotifyService: PNotifyService,
    readonly sidenavService: SidenavService,
    public matDialog: MatDialog
  ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.flagName = this.langToFlagsNameMap[this.translate.currentLang];
    });
  }

  ngOnInit(): void {
    // this.translationService
    //   .defaultLanguage()
    //   .pipe(take(1))
    //   .subscribe(language => {
    this.flagName = this.langToFlagsNameMap['en'];
    // });

    this.user = this.authService.getCurrentUser();
    this.isGuest = this.user.email === undefined;
    // this.settings$ = this.settingsService.show();

    // current user as Observable
    this.authService.currentUser$.next({
      user: {
        id: this.user.id,
        userName: this.user.email,
        access_token: this.user.token,
        menu: this.authService.getCurrentUser().menu,
        isSuperUser: this.user.isSuperUser,
        application: this.user.application,
        employeeId: this.user.employeeId
      },
      expired: false
    });
    this.currentUser$ = this.authService.currentUser$;

    this.route.queryParams.subscribe(params => {
      this.currentUser$.pipe(takeUntil(this.unsubscribe)).subscribe((userAuth: UserAuthorization) => {
        if (userAuth && userAuth.expired) {
          // TODO: Add redirect URL.
          this.router.navigate(['/auth/login']);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  logout(): void {
    this.authService.logout(data => {
      this.router.navigate(['/auth/login']);
    });
  }

  onNotificationChangeEvent(hasUnreadNotifications: boolean): void {
    this.hasUnreadNotifications = hasUnreadNotifications;
  }

  displayEmail(): string {
    if (this.isGuest) {
      return 'Guest';
    }

    this.getFormatedEmail(this.user.email);
  }

  getFormatedEmail(email: string): string {
    if (email.length > 9) {
      return `${email.split('@')[0].slice(0, 9)}...'`;
    }

    return email.split('@')[0];
  }

  handleFixToggler(): void {
    this.sidenavService.toggleLargeDock();
    this.sidenavService.toggleSideNav();
  }

  openMyMenu(): void {
    this.matMenuTrigger.openMenu();
  }

  resetPassword(): void {
    this.route.params.subscribe(params => {
      this.matDialog
        .open(ResetPasswordComponent, {
          width: GLOBALS.formDialog.width,
          data: { locationId: params.id }
        })
        .afterClosed()
        .subscribe((loadData: boolean) => {});
    });
  }

  gotoDashboard(): void {
    const sidenav = new SideNavComponent(this.sidenavService, this.router);
    // sidenav.gotoDashboard('Dashboard');
  }

  isGuestUser(): boolean {
    return this.isGuest;
  }
}
