import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'ng-sidebar';
import { AppRoutingModule } from '../app-routing.module';
import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';
import { PublicModule } from '../public/public.module';
import { SharedModule } from '../shared/shared.module';
import { CopyrightBottomSheetComponent } from './footer/copyright-bottom-sheet.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { NotificationComponent } from './notification/notification.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { SidenavService } from './services/sidenav.service';
import { TranslationService } from './services/translation.service';
import { SideNavConfigComponent } from './sidenav-config/sidenav-config.component';
import { SideNavComponent } from './sidenav/sidenav.component';
import { TranslationComponent } from './translation/translation.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    NotificationComponent,
    PageTitleComponent,
    SideNavComponent,
    SideNavConfigComponent,
    TranslationComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    NotificationComponent,
    PageTitleComponent,
    TranslationComponent,
    FooterComponent,
    CopyrightBottomSheetComponent
  ],
  imports: [
    TranslateModule,
    AppRoutingModule,
    SharedModule,
    PublicModule,
    CdkTreeModule,
    MatToolbarModule,
    MatMenuModule,
    MatSelectModule,
    MatTreeModule,
    TranslateModule,
    AppRoutingModule,
    SharedModule,
    PublicModule,
    SidebarModule.forRoot(),
    AngularMaterialModule
  ],
  providers: [SidenavService, TranslationService],
  exports: []
})
export class MainModule { }
