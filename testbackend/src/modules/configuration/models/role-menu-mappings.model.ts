import { BaseModel } from '../../base/models/base.model';
import { RoleMenuMappings } from './schema/role-menu-mappings.schema';
import * as _ from 'lodash';

export class RoleMenuMappingModel extends BaseModel {
    constructor(req) {
        super(req, RoleMenuMappings);
    }
}
