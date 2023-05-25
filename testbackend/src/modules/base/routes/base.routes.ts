import { Router } from "express";
import { AuthenticationBaseRoute } from "../../authentication/routes/base/authentication-base.routes";

import { ConfigurationBaseRoute } from "../../configuration/routes/base/configutaions-base.routes";
import { CustomerBaseRoute } from "../../customer/routes/base/customer-base.routes";


export class BaseRoute {
    router: Router;

    constructor(router: Router) {
        this.router = router;
        this.initAll();
    }

    public initAll() {
        new AuthenticationBaseRoute(this.router);
        new ConfigurationBaseRoute(this.router);
      
        new CustomerBaseRoute(this.router);
  
    }

}