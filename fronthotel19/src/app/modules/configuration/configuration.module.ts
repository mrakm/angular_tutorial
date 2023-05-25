import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';


import { UserFormComponent } from './components/user-roles/form/user-form.component';
import { UserListComponent } from './components/user-roles/list/user-list.component';

import { ConfigurationRoutingModule } from './configuration-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductItemsListComponent } from './components/foodItems/list/product-items-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductItemsFormComponent } from './components/foodItems/form/product-items-form.component';

const components = [ UserListComponent, UserFormComponent];
@NgModule({
  declarations: [
    ...components,ProductItemsFormComponent,ProductItemsListComponent
   
  ],
  imports: [
    TranslateModule,
    ConfigurationRoutingModule,
    SharedModule,
    MatFormFieldModule,
    NgxSpinnerModule,
    AngularMaterialModule,
    NgxMaskModule.forRoot(),
    TextMaskModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CookieService],
  entryComponents: [
    ProductItemsFormComponent
  ]
})
export class ConfigurationModule {}
