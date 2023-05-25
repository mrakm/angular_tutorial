import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PublicRoutingModule } from './public-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from '../shared/shared.module';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';

@NgModule({
  declarations: [TermsOfUseComponent],
  imports: [TranslateModule, PublicRoutingModule, SharedModule, NgxSpinnerModule, AngularMaterialModule],
  providers: [CookieService]
})
export class PublicModule { }
