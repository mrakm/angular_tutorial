import * as jwt from 'jsonwebtoken';
import { ErrorHandler } from '../../base/conf/error-handler';
import { GLOBALS } from '../../base/conf/globals';
import { Helper } from '../../base/helpers/helper';
import { BaseModel } from '../../base/models/base.model';
import { Users } from './schema/users.schema';
import { MenuModel } from '../../configuration/models/menus.model';
import * as _ from 'lodash';
import { Roles } from '../../configuration/models/schema/roles.schema';

export class UserModel extends BaseModel {
  constructor(req) {
    super(req, Users);
  }

  public register(item) {
    return super.findByCondition(null, { userName: item.userName }).then((result) => {
      if (result) {
        return ErrorHandler.duplicateEmail;
      } else {
        return super.create(item).then((response) => {
          let tokenObj = {
            id: response['id'],
            role: response.role,
            userName: response['userName'],
            iat: Math.floor(Date.now() / 25412) - 10,
          };
          let access_token = jwt.sign(tokenObj, GLOBALS.SECRET);

          return new MenuModel(this.req).findMenuByApplication(response.application).then((menu) => {
            return {
              id: response.id,
              userName: response.userName,
              isSuperUser: response.isSuperUser,
              application: response.application,
              access_token,
              menu,
            };
          });
        });
      }
    });
  }

  public login(item) {
    const includeObj = [];

    return super
      .findByCondition(['id', 'userName', 'roleId', 'password', 'isActive', 'isSuperUser', 'application'], { userName: item.email }, includeObj)
      .then((userRes) => {
        if (userRes) {
          if (!userRes.isActive) {
            return ErrorHandler.notActive;
          } else {
            return Helper.verifyPassword(item.password, userRes.password).then((match) => {
              if (match) {
                let tokenObj = {
                  id: userRes['id'],
                  role: userRes.role,
                  userName: userRes['userName'],
                  iat: Math.floor(Date.now() / 25412) - 10,
                };

                let access_token = jwt.sign(tokenObj, GLOBALS.SECRET);

                if (userRes.isSuperUser) {
                  return new MenuModel(this.req).findMenu().then((menu) => {
                    return {
                      id: userRes.id,
                      userName: userRes.userName,
                      isSuperUser: userRes.isSuperUser,
                      access_token,
                      menu,
                      application: userRes.application,
                    };
                  });
                } else if (userRes.application === 'Client') {
                  return new MenuModel(this.req).findMenuByApplication(userRes.application).then((menu) => {
                    return {
                      id: userRes.id,
                      userName: userRes.userName,
                      isSuperUser: userRes.isSuperUser,
                      access_token,
                      menu,
                    };
                  });
                } else if (userRes.application === 'Contractor') {
                  return new MenuModel(this.req).findMenuByApplication(userRes.application).then((menu) => {
                    return {
                      id: userRes.id,
                      userName: userRes.userName,
                      isSuperUser: userRes.isSuperUser,
                      access_token,
                      menu,
                    };
                  });
                } else {
                  return new MenuModel(this.req).findMenuByRole(userRes.roleId).then((menu) => {
                    return {
                      id: userRes.id,
                      userName: userRes.userName,
                      isSuperUser: userRes.isSuperUser,
                      access_token,
                      menu,
                    };
                  });
                }
              } else {
                return ErrorHandler.invalidPassword;
              }
            });
          }
        } else {
          return ErrorHandler.invalidEmail;
        }
      });
  }

  findAllByApplication() {
    const include = [
      {
        model: Roles,
        as: 'roles',
        where: BaseModel.cb(),
        required: true,
      },
    ];
    return super.findAllByConditions(null, { isSuperUser: false }, include);
  }
}
