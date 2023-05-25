import { Router } from 'express';
import { RoleMenuMappingController } from '../controllers/role-menu-mappings.controller';

export class RoleMenuMappingRoute {
    private router: Router;
    constructor(router: Router) {
        this.router = router;
        this.create();
    }

    public create() {
        const controller = new RoleMenuMappingController();
        this.router.route('/configurations/rolemenumappings/findAll').get(controller.findAll);
        this.router.route('/configurations/rolemenumappings/find/:roleId').get(controller.find);
        this.router.route('/configurations/rolemenumappings/create').post(controller.create);
        this.router.route('/configurations/rolemenumappings/update/:id').put(controller.update);
        this.router.route('/configurations/rolemenumappings/delete/:id').put(controller.delete);
    }
}
