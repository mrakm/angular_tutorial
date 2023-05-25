import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Roles } from './roles.schema';
import { Menus } from './menus.schema';

@Table({ timestamps: true, tableName: 'RoleMenuMappings' }) // for adding createdAt and updatedAt Columns

export class RoleMenuMappings extends Model<RoleMenuMappings> {

    @ForeignKey(() => Roles)
    @Column roleId: string;

    @ForeignKey(() => Menus)
    @Column menuId: string;

    @Column isActive: boolean;

    @Column deletedAt: Date;

    @Column createdBy: string;

    @Column updatedBy: string;

    @BelongsTo(() => Roles, { foreignKey: 'roleId' })
    roles: Roles[];

    @BelongsTo(() => Menus, { foreignKey: 'menuId' })
    menus: Menus[];
}
