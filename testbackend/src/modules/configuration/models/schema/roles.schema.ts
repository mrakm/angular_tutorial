import { Column, Model, Table } from 'sequelize-typescript';

@Table({ timestamps: true, tableName: 'Roles' }) // for adding createdAt and updatedAt Columns

export class Roles extends Model<Roles> {

    @Column name: string;

    @Column isActive: boolean;

    @Column deletedAt: Date;

    @Column createdBy: string;

    @Column updatedBy: string;

}
