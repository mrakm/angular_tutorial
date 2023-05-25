import { Sequelize, Table } from 'sequelize-typescript';

import { Users } from '../../authentication/models/schema/users.schema';
import { Product } from '../../configuration/models/schema/product.schema';

import { Menus } from '../../configuration/models/schema/menus.schema';
import { RoleMenuMappings } from '../../configuration/models/schema/role-menu-mappings.schema';
import { Roles } from '../../configuration/models/schema/roles.schema';

import { CONN_OPTIONS } from './connection-option';

export class Connection {
  sequelize: Sequelize;
  constructor() {}

  public async createConnection() {
    /** Instantiating Sequelize instance for creating connection */
    this.sequelize = new Sequelize(CONN_OPTIONS);

    this.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      });

    this.sequelize.addModels([
      Users,
      Menus,
      Roles,
      RoleMenuMappings,
      Product,
     
    ]);
    // await this.sequelize.sync()
    return this.sequelize;
  }
}
