import { BaseModel } from '../../base/models/base.model';
import { Product } from './schema/product.schema';



export class ProductModel extends BaseModel {
  constructor(req) {
    super(req, Product);
  }


}
