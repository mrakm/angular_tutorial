import { Router } from 'express';
import { MenusController } from '../controllers/menus.controller';

export class MenuRoute {
    private router: Router;
    constructor(router: Router) {
        this.router = router;
        this.create();
    }

    public create() {
        const controller = new MenusController();
        this.router.route('/configurations/menus/findAll').get(controller.findAll);
        this.router.route('/configurations/menus/find').get(controller.find);
        this.router.route('/configurations/menus/create').post(controller.create);
        this.router.route('/configurations/menus/update/:id').put(controller.update);
        this.router.route('/configurations/menus/delete/:id').put(controller.delete);
    }
}
