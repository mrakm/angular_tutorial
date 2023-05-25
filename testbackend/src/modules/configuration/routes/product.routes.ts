import { Router } from 'express';

import { ProductController } from '../controllers/product.controller';

export class ProductRoute {
  private router: Router;
  constructor(router: Router) {
    this.router = router;
    this.create();
  }

  public create() {
    const controller = new ProductController();
    this.router.route('/configurations/product/findAll').get(controller.findAll);

    this.router.route('/configurations/product/find/:id').get(controller.find);
    this.router.route('/configurations/product/create').post(controller.create);
    this.router.route('/configurations/product/update/:id').put(controller.update);
    this.router.route('/configurations/product/delete/:id').put(controller.delete);
  }
}
