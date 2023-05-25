import * as express from 'express';
import { ErrorHandler } from '../../base/conf/error-handler';
import { RoleMenuMappingModel } from '../models/role-menu-mappings.model';


export class RoleMenuMappingController {

  constructor() { }

  findAll(req: express.Request, res: express.Response, next: express.NextFunction) {
    new RoleMenuMappingModel(req).findAll(null).then(result => {
      res.json(result);
    }).catch(err => {
      ErrorHandler.sendServerError(err, res, next);
    });
  }

  find(req: express.Request, res: express.Response, next: express.NextFunction) {
    let roleId = req.params.roleId;
    new RoleMenuMappingModel(req).findAllByConditions(null, { roleId }).then(result => {
      res.json(result);
    }).catch(err => {
      ErrorHandler.sendServerError(err, res, next);
    });
  }

  create(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = req.body;


    new RoleMenuMappingModel(req).create(item).then(result => {
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
    new RoleMenuMappingModel(req).update(id, item).then(result => {
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
    new RoleMenuMappingModel(req).delete(id).then(result => {
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
