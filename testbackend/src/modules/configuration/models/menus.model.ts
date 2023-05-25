import { BaseModel } from '../../base/models/base.model';
import { Menus } from './schema/menus.schema';
import { RoleMenuMappings } from './schema/role-menu-mappings.schema';
import { Roles } from './schema/roles.schema';

export class MenuModel extends BaseModel {
    constructor(req) {
        super(req, Menus);
    }

    findMenu() {
        const includeObj = [
            {
                model: Menus, as: 'children', attributes: ['id', 'name', 'imgSrc', 'url', 'parentId', 'isConfiguration', 'menuNumber'], where: BaseModel.cb(), required: false,

                include: [{
                    model: Menus, as: 'children', attributes: ['id', 'name', 'imgSrc', 'url', 'parentId', 'isConfiguration', 'menuNumber'], where: BaseModel.cb(), required: false,
                }]
            },
        ];
        return super.findAll(['id', 'name', 'imgSrc', 'url', 'parentId', 'isConfiguration', 'menuNumber'], { parentId: null }, includeObj, [['menuNumber', 'ASC']]);
    }


    findMenuByRole(roleId) {
        const includeObj = [
            {
                model: Menus, as: 'children', attributes: ['id', 'name', 'imgSrc', 'url', 'parentId', 'isConfiguration', 'menuNumber'], where: BaseModel.cb(), required: false,
                include: [
                    {
                        model: Menus, as: 'children', attributes: ['id', 'name', 'imgSrc', 'url', 'parentId', 'isConfiguration', 'menuNumber'], where: BaseModel.cb(), required: false,
                    },
                    {
                        model: RoleMenuMappings, as: 'roleMenuMappings', where: BaseModel.cb({ roleId }), required: true
                    }
                ]
            },
            {
                model: RoleMenuMappings, as: 'roleMenuMappings', where: BaseModel.cb({ roleId }), required: true
            }
        ];
        return super.findAll(['id', 'name', 'imgSrc', 'url', 'parentId', 'isConfiguration', 'menuNumber'], { parentId: null }, includeObj, [['menuNumber', 'ASC']]);
    }


    findMenuByApplication(name) {
        const includeObj = [
            {
                model: Menus, as: 'children', attributes: ['id', 'name', 'imgSrc', 'url', 'parentId', 'isConfiguration', 'menuNumber'], where: BaseModel.cb(), required: false,
                include: [
                    {
                        model: Menus, as: 'children', attributes: ['id', 'name', 'imgSrc', 'url', 'parentId', 'isConfiguration', 'menuNumber'], where: BaseModel.cb(), required: false,
                        include: [
                            {
                                model: RoleMenuMappings, as: 'roleMenuMappings', where: BaseModel.cb(), required: true,
                                include: [
                                    {model: Roles, as: 'roles', where: BaseModel.cb({ name }), required: true,}
                                ]
                            }
                        ]
                    },
                    {
                        model: RoleMenuMappings, as: 'roleMenuMappings', where: BaseModel.cb(), required: true,
                        include: [
                            {model: Roles, as: 'roles', where: BaseModel.cb({ name }), required: true,}
                        ]
                    }
                ]
            },
            {
                model: RoleMenuMappings, as: 'roleMenuMappings', where: BaseModel.cb(), required: true,
                include: [
                    {model: Roles, as: 'roles', where: BaseModel.cb({ name }), required: true,}
                ]
            }
        ];
        return super.findAll(['id', 'name', 'imgSrc', 'url', 'parentId', 'isConfiguration', 'menuNumber'], { parentId: null }, includeObj, [['menuNumber', 'ASC']]);
    }
}
