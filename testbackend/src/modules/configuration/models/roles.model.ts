import { Promise } from 'bluebird';
import { ErrorHandler } from '../../base/conf/error-handler';
import { BaseModel } from '../../base/models/base.model';
import { RoleMenuMappingModel } from './role-menu-mappings.model';
import { Roles } from './schema/roles.schema';

export class RoleModel extends BaseModel {
    constructor(req) {
        super(req, Roles);
    }

    createRoleAndAssignMenu(item) {
        return super
            .findByCondition(null, { name: item.name })
            .then((result) => {
                if (result) {
                    return ErrorHandler.duplicateEntry;
                } else {
                    const role = { name: item.name, application: item.application };
                    const menus = item.menu;
                    return this.sequelizeModel.sequelize.transaction(t => {
                        return super.create(role, { transaction: t }).then(result => {
                            return Promise.each(menus || [], (menu: any) => {
                                const roleMenuMappingItem = { roleId: result.id, menuId: menu }
                                return new RoleMenuMappingModel(this.req).create(roleMenuMappingItem, { transaction: t })
                            });
                        })
                    })
                }
            });
    }

    updateRoleAndAssignMenu(id, item) {
        const role = { name: item.name, application: item.application };
        const menus = item.menu;
        return this.sequelizeModel.sequelize.transaction(t => {
            return super.update(id, role, { transaction: t }).then(result => {
                return new RoleMenuMappingModel(this.req).deleteAllByConditions({ roleId: id }, { transaction: t }).then(() => {
                    return Promise.each(menus || [], (menu: any) => {
                        const roleMenuMappingItem = { roleId: id, menuId: menu }
                        return new RoleMenuMappingModel(this.req).create(roleMenuMappingItem, { transaction: t })
                    });
                })
            })
        })
    }


}
