import * as express from 'express';
import { ErrorHandler } from '../../base/conf/error-handler';

import { ProductModel } from '../models/product.model';

export class ProductController {
  constructor() {}

  create(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = req.body;

    new ProductModel(req)
      .create(item)
      .then((result) => {
        if (result && !result['error']) {
          res.json(result);
        } else {
          ErrorHandler.send(result, res, next);
        }
      })
      .catch((_error) => {
        ErrorHandler.sendServerError(_error, res, next);
      });
  }

  findAll(req: express.Request, res: express.Response, next: express.NextFunction) {
    new ProductModel(req)
      .findAll()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        ErrorHandler.sendServerError(err, res, next);
      });
  }



  find(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    new ProductModel(req)
      .find(id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        ErrorHandler.sendServerError(err, res, next);
      });
  }

  update(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    let item = req.body;
    new ProductModel(req)
      .update(id, item)
      .then((result) => {
        if (result && !result['error']) {
          res.json(result);
        } else {
          ErrorHandler.send(result, res, next);
        }
      })
      .catch((_error) => {
        ErrorHandler.sendServerError(_error, res, next);
      });
  }

  delete(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    new ProductModel(req)
      .delete(id)
      .then((result) => {
        if (result && !result['error']) {
          res.json(result);
        } else {
          ErrorHandler.send(result, res, next);
        }
      })
      .catch((_error) => {
        ErrorHandler.sendServerError(_error, res, next);
      });
  }
}
