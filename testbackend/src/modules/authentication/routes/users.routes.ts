import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';

export class UserRoute {
    private router: Router;
    constructor(router: Router) {
        this.router = router;
        this.create();
    }

    public create() {
        const controller = new UsersController();
        this.router.route('/authenticaion/users/login').post(controller.login);
        this.router.route('/authenticaion/users/find/:id').get(controller.find);
        this.router.route('/authenticaion/users/findAll').get(controller.findAll);
        this.router.route('/authenticaion/users/getAll').get(controller.getAll);
        this.router.route('/authenticaion/users/create').post(controller.create);
        this.router.route('/authenticaion/users/update/:id').put(controller.update);
        this.router.route('/authenticaion/users/delete/:id').put(controller.delete);
    }
}
