import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GLOBALS } from 'src/app/config/globals';


import { UserFormComponent } from './components/user-roles/form/user-form.component';
import { UserListComponent } from './components/user-roles/list/user-list.component';
import { ProductItemsListComponent } from './components/foodItems/list/product-items-list.component';

const routes: Routes = [

  {
    path: 'users',
    children: [
      { path: '', component: UserListComponent },
      { path: 'create', component: UserFormComponent, data: { act: GLOBALS.pageActions.create } },
      { path: 'update/:id', component: UserFormComponent, data: { act: GLOBALS.pageActions.update } }
    ]
  },

  {
    path: 'product',
    children: [
      { path: '', component: ProductItemsListComponent }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {}
