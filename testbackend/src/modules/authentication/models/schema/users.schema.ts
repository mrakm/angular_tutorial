import { BelongsTo, Column, HasMany, Model, Table } from "sequelize-typescript";

import { Roles } from "../../../configuration/models/schema/roles.schema";


@Table({ timestamps: true, tableName: "Users" }) // for adding createdAt and updatedAt Columns
export class Users extends Model<Users> {
  @Column userName: string;

  @Column password: string;

  @Column application: string;



  @Column roleId: string;

  @Column isSuperUser: boolean;

  @Column isActive: boolean;

  @Column deletedAt: Date;

  @Column createdBy: string;

  @Column updatedBy: string;

  @BelongsTo(() => Roles, { foreignKey: "roleId" })
  roles: Roles[];

 


}
