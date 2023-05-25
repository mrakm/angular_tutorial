import { Router } from 'express';
import { RolesController } from '../controllers/roles.controller';

export class RoleRoute {
    private router: Router;
    constructor(router: Router) {
        this.router = router;
        this.create();
    }

    public create() {
        const controller = new RolesController();
        this.router.route('/configurations/roles/findAll').get(controller.findAll);
        this.router.route('/configurations/roles/find/:id').get(controller.find);
        this.router.route('/configurations/roles/create').post(controller.create);
        this.router.route('/configurations/roles/update/:id').put(controller.update);
        this.router.route('/configurations/roles/delete/:id').put(controller.delete);
    }
}
