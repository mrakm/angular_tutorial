import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { RoleMenuMappings } from './role-menu-mappings.schema';

@Table({ timestamps: true, tableName: 'Menus' }) // for adding createdAt and updatedAt Columns

export class Menus extends Model<Menus> {

    @Column name: string;

    @Column imgSrc: string;

    @Column url: string;

    @ForeignKey(() => Menus)
    @Column parentId: string;

    @Column menuNumber: number;

    @Column isActive: boolean;

    @Column deletedAt: Date;

    @Column createdBy: string;

    @Column updatedBy: string;

    @BelongsTo(() => Menus, { foreignKey: 'parentId' })
    childrens: Menus[];

    @HasMany(() => Menus, { foreignKey: 'parentId' })
    children: Menus[];

    @HasMany(() => RoleMenuMappings, { foreignKey: 'menuId' })
    roleMenuMappings: RoleMenuMappings[];

}
