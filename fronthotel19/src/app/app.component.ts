import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { LoadScriptService } from './core';
import { AuthService } from './core/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [style({ opacity: 0.25 }), animate(300)]),
      transition('* => void', [animate(200, style({ opacity: 0.25 }))])
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  @ViewChild('signInForm') signInForm;
  @ViewChild('signUpForm') signUpForm;
  @ViewChild('forgotPasswordForm') forgotPasswordForm;
  online$: Observable<boolean>;
  connectionStatus: boolean;

  constructor(
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly domSanitizer: DomSanitizer,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly loadScriptService: LoadScriptService
  ) {
    this.translate.use('en');
    this.matIconRegistry.addSvgIcon('pdf', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icons/pdf.svg'));
    this.matIconRegistry.addSvgIcon('word', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icons/word.svg'));

    this.online$ = merge(of(navigator.onLine), fromEvent(window, 'online').pipe(mapTo(true)), fromEvent(window, 'offline').pipe(mapTo(false)));
    this.networkStatus();
  }

  ngAfterViewInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.authService.isUserAuthenticated$.next(false);
    } else {
      this.authService.isUserAuthenticated$.next(true);
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  networkStatus(): void {
    this.online$.subscribe(value => {
      this.connectionStatus = value;
    });
  }
}
