import * as express from 'express';
import { ErrorHandler } from '../../base/conf/error-handler';
import { UserModel } from '../models/users.model';
const bcrypt = require("bcrypt");

export class UsersController {

  constructor() { }

  findAll(req: express.Request, res: express.Response, next: express.NextFunction) {
    new UserModel(req).findAllByApplication().then(result => {
      res.json(result);
    }).catch(err => {
      ErrorHandler.sendServerError(err, res, next);
    });
  }
  
  getAll(req: express.Request, res: express.Response, next: express.NextFunction) {
    new UserModel(req).findAll(['id', 'userName']).then(result => {
      res.json(result);
    }).catch(err => {
      ErrorHandler.sendServerError(err, res, next);
    });
  }

  login(req: express.Request, res: express.Response, next: express.NextFunction) {

    new UserModel(req).login(req.body).then(result => {
      if (result && !result['error']) {
        res.json(result);
      } else {
        ErrorHandler.send(result, res, next);
      }
    }).catch(err => {
      ErrorHandler.sendServerError(err, res, next);
    });
  }

  find(req: express.Request, res: express.Response, next: express.NextFunction) {
    let id = req.params.id;
    new UserModel(req).find(id).then(result => {

      res.json(result);

    }).catch(err => {

      ErrorHandler.sendServerError(err, res, next);

    });
  }

  create(req: express.Request, res: express.Response, next: express.NextFunction) {
    let item = req.body;

    item.password = bcrypt.hashSync(item.password, 10)
    new UserModel(req).register(item).then(result => {
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
    item.password = bcrypt.hashSync(item.password, 10)

    new UserModel(req).update(id, item).then(result => {
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
    new UserModel(req).delete(id).then(result => {
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
