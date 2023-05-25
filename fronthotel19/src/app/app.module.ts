import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Eagerly Load
import { CoreModule } from './core/core.module';
import { MainModule } from './main/main.module';
import { PublicModule } from './public/public.module';
import { PageNotFoundComponent } from './shared/errors/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

// Other modules
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { AuthModule } from './core/auth/auth.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PaymentComponent } from './payment/payment.component';

export const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http);

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, PaymentComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PublicModule,
    CoreModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule,
    MainModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    LoadingBarHttpClientModule,
    AuthModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [PaymentComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
