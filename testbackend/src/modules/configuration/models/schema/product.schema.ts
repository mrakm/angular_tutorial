import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ timestamps: true, tableName: 'Product' }) // for adding createdAt and updatedAt Columns
export class Product extends Model<Product> {


  @Column description: string;

  @Column name: string;

  @Column price: string;

  @Column deletedAt: Date;

  @Column createdBy: string;

  @Column updatedBy: string;

}
