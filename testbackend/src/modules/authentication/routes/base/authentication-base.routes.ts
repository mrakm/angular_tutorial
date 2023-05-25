import { Router } from 'express';
import { UserRoute } from '../users.routes';


export class AuthenticationBaseRoute {
    private router: Router;

    constructor(router: Router) {
        this.router = router;
        this.initAll();
    }

    public initAll() {
        new UserRoute(this.router);
    }
}
