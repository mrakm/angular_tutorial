import { Router } from 'express';

import { ProductRoute } from '../product.routes';

import { MenuRoute } from '../menus.routes';

import { RoleMenuMappingRoute } from '../role-menu-mappings.routes';
import { RoleRoute } from '../roles.routes';

export class ConfigurationBaseRoute {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.initAll();
  }

  public initAll() {
    new MenuRoute(this.router);
    new RoleRoute(this.router);
    new RoleMenuMappingRoute(this.router);
    new ProductRoute(this.router);


  }
}
