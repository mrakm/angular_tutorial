import * as express from 'express';
import { ErrorHandler } from '../../base/conf/error-handler';
import { RoleModel } from '../models/roles.model';


export class RolesController {

  constructor() { }

  findAll(req: express.Request, res: express.Response, next: express.NextFunction) {
    new RoleModel(req).findAllByConditions(null, null).then(result => {
      res.json(result);
    }).catch(err => {
      ErrorHandler.sendServerError(err, res, next);
    });
  }

  find(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    new RoleModel(req).findByCondition(null, { id }).then(result => {
      res.json(result);
    }).catch(err => {
      ErrorHandler.sendServerError(err, res, next);
    });
  }

  create(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = req.body;

    new RoleModel(req).createRoleAndAssignMenu(item).then(result => {
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
    new RoleModel(req).updateRoleAndAssignMenu(id, item).then(result => {
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
    new RoleModel(req).delete(id).then(result => {
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
