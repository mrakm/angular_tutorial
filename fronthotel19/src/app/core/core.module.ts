import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthRoleGuard } from './auth/auth-role-guard.service';
import { AuthService } from './auth/auth.service';
import { RedirectGuard } from './auth/redirect-guard.service';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { UrlInterceptor } from './interceptor/url.interceptor';
import { PNotifyService } from './pnotify';
import { RouteChangeService } from './route-change';
import { BrowserVersionService, ImpersonateUserService } from './services';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthGuard,
    RedirectGuard,
    AuthRoleGuard,
    AuthService,
    RouteChangeService,
    PNotifyService,
    ImpersonateUserService,
    BrowserVersionService
  ],
  exports: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
