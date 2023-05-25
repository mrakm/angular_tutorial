import * as express from 'express';
import { ErrorHandler } from '../../base/conf/error-handler';
import { MenuModel } from '../models/menus.model';


export class MenusController {

  constructor() { }

  findAll(req: express.Request, res: express.Response, next: express.NextFunction) {
    new MenuModel(req).findAll(null).then(result => {
      res.json(result);
    }).catch(err => {
      ErrorHandler.sendServerError(err, res, next);
    });
  }

  find(req: express.Request, res: express.Response, next: express.NextFunction) { 
    new MenuModel(req).findMenu().then(result => {
      res.json(result);
    }).catch(err => {
      ErrorHandler.sendServerError(err, res, next);
    });
  }

  create(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = req.body;


    new MenuModel(req).create(item).then(result => {
      if (result && !result['error']) {
        res.json(result);
      } else {
        ErrorHandler.send(result, res, next);
      }
    })
      .catch(_error => {
        ErrorHandler.sendServerError(_error, res, next);
      });
  }

  update(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    let item = req.body;
    new MenuModel(req).update(id, item).then(result => {
      if (result && !result['error']) {
        res.json(result);
      } else {
        ErrorHandler.send(result, res, next);
      }
    })
      .catch(_error => {
        ErrorHandler.sendServerError(_error, res, next);
      });
  }

  delete(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    new MenuModel(req).delete(id).then(result => {
      if (result && !result['error']) {
        res.json(result);
      } else {
        ErrorHandler.send(result, res, next);
      }
    })
      .catch(_error => {
        ErrorHandler.sendServerError(_error, res, next);
      });
  }

}
