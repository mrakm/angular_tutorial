import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth-guard.service';
import { RedirectGuard } from './core/auth/redirect-guard.service';
import { LayoutComponent } from './main/layout/layout.component';
import { TermsOfUseComponent } from './public/terms-of-use/terms-of-use.component';
import { PageNotFoundComponent } from './shared/errors/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.module').then(m => m.AuthModule),
    canLoad: [RedirectGuard]
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'terms-of-use', component: TermsOfUseComponent },
  {
    path: 'a',
    component: LayoutComponent,
    children: [
   


      {
        path: 'd',
        loadChildren: () => import('./modules/configuration/configuration.module').then(m => m.ConfigurationModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
