import { Promise } from 'bluebird';
import { Sequelize } from 'sequelize-typescript';
import { Connection } from '../conf/connection';
import { GLOBALS } from '../conf/globals';

export class BaseModel {
  public req;

  public sequelize = Sequelize;
  public sequelizeModel;
  protected connection;

  constructor(req, model) {
    this.req = req;

    this.sequelizeModel = model;
    this.openConnection();
  }

  protected openConnection() {
    if (!GLOBALS.connection) {
      return new Connection().createConnection().then((res) => {
        GLOBALS.connection = res;
      });
    } else {
      this.connection = GLOBALS.connection;
    }
  }

  protected closeConnection() {
    this.connection.close();
    GLOBALS.connection = null;
  }

  /**
   * Find single record by id
   * @param id
   */
  find(id, attributes?, include?, order?, xtra?) {
    return this.findByCondition(attributes, { id: id }, include, order, xtra);
  }

  findAndCountAll(attributes?, conditions?, include?, order?, options?, xtra?) {
    let args = BaseModel.qry2SequelizeOptions(options);

    return this.sequelizeModel.findAndCountAll(this.sequelizeQueryBuilder(attributes, conditions, include, order, args, xtra));
  }

  /**
   * Find single record by specified condition
   * @param attributes
   */
  findByCondition(attributes, conditions, include?, order?, xtra?) {
    return this.sequelizeModel.findOne(this.sequelizeQueryBuilder(attributes, conditions, include, order, null, xtra));
  }

  /**
   * Find all records with specified attributes
   * @param attributes
   */
  findAll(attributes?, conditions?, include?, order?, xtra?) {
    return this.findAllByConditions(attributes, conditions, include, order, xtra);
  }

  /**
   * Find all records with specified attributes and conditions
   * @param attributes
   */
  findAllByConditions(attributes, conditions, include?, order?, xtra?) {
    return this.sequelizeModel.findAll(this.sequelizeQueryBuilder(attributes, conditions, include, order, null, xtra));
  }

  /**
   * Update a record for given id
   * @param item
   * @param id
   */
  update(id, item, xtra?) {
    return this.updateByCondition(item, { id: id }, xtra);
  }

  /**
   * Update a record for given id
   * @param item
   * @param id
   */
  updateByCondition(item, conditions, xtra?) {
    item = BaseModel.extendItem(this.req, item, false);
    // return this.sequelizeModel.update(item, { where: conditions });

    return this.sequelizeModel.update(item, this.sequelizeQueryBuilder(null, conditions, null, null, null, xtra));
  }

  /**
   * Create a new record
   * @param item
   */
  create(item, xtra?) {
    item = BaseModel.extendItem(this.req, item, true);
    if (xtra) {
      return this.sequelizeModel.create(item, this.sequelizeQueryBuilder(null, null, null, null, null, xtra));
    } else {
      return this.sequelizeModel.create(item);
    }
  }

  /**
   * Count all records
   */
  // count() {
  //   return this.sequelizeModel.count();
  // }
  count(condition?, includes?) {
    return this.sequelizeModel.count(this.sequelizeQueryBuilder(null, condition, includes));
  }

  sum(column, condition?, includes?, xtra?) {
    return this.sequelizeModel.sum(column, this.sequelizeQueryBuilder(null, condition, includes, null, null, xtra));
  }

  /**
   * Delete a record against an id
   * @param id
   */
  delete(id, xtra?) {
    return this.deleteByConditions({ id: id }, xtra);
  }

  /**
   * Delete a record by conditions
   * @param conditions
   */
  deleteByConditions(conditions, xtra?) {
    return this.softDelete(conditions, xtra);
  }

  /**
   *
   *
    @param {} conditions
    @param {} [xtra]
   * @returns
   * @memberof BaseModel
   */
  deleteAllByConditions(conditions, xtra?) {
    return this.findAllByConditions(['id'], conditions, null, null, xtra).then((res) => {
      if (res && res.length) {
        return Promise.each(res, (el) => {
          return this.delete(el['id']);
        });
      }
    });
  }

  /**
   * Update delted flat to true by condition
   * @param condition
   */
  softDelete(condition, xtra?) {
    let item = { deletedAt: new Date() };
    item = BaseModel.extendItem(this.req, item, false);

    return this.sequelizeModel.update(item, this.sequelizeQueryBuilder(null, condition, null, null, null, xtra));
  }

  /**
   * To prepare the sequelize query.
   * attributes: ['a1', 'a2']
   * condition: {a: b, c: d}
   * includes : [{YOUR_INCLUDE}]
   * order: [['updatedAt', 'DESC']]
   *
   * @param attributes any
   * @param condition any
   */
  protected sequelizeQueryBuilder(attributes?, condition?, include?, order?, options?, xtra?) {
    let obj = {};

    if (attributes) {
      obj['attributes'] = attributes;
    }

    obj['where'] = this.conditionBuilder(condition);

    if (include) {
      obj['include'] = include;
    }

    if (order) {
      obj['order'] = order;
    } else {
      obj['order'] = [['updatedAt', 'DESC']];
    }

    if (options && options['offset']) {
      obj['offset'] = options['offset'];
    }

    if (options && options['limit']) {
      obj['limit'] = options['limit'];
    }

    if (xtra) {
      obj = this.manageXtraOptions(obj, xtra);
    }

    return obj;
  }

  private manageXtraOptions(obj, xtra) {
    Object.keys(xtra).forEach((key) => {
      obj[key] = xtra[key];
    });

    return obj;
  }

  /**
   * Build conditon object
   *
   * @param condition
   */
  public conditionBuilder(condition?) {
    return BaseModel.cb(condition);
  }

  /**
   * Build condition object. If condition is provided then append where clause 'deletedAT = new Date(0)' into conditon or
   * if conditon is not provided then create a conditon object with where clause 'deletedAT = new Date(0)'.
   *
   * @param condition
   */
  public static cb(condition?) {
    let updatedCondition = condition ? condition : {};
    // TODO:LOW find some other solution for default value
    updatedCondition['deletedAt'] = new Date(0);

    return updatedCondition;
  }

  /**
   * extend item with createdBy, updatedBy
   * 'both' parameter is being used to updated both keys created/updated by otherwise only updated by will udpated.
   * @param item object
   * @param both boolean
   */
  static extendItem(req, item, isCreate?) {
    if (req && req.session) {
      if (isCreate) {
        item['createdBy'] = req.session.identity?.userId;
      }
      item['updatedBy'] = req.session.identity?.userId;
    }

    return item;
  }

  /**
   * Convert query sting object to sequelize options object
   *
   */
  static qry2SequelizeOptions(query) {
    let options = {};
    if (query) {
      if (query['offset']) {
        options['offset'] = query['offset'];
      }

      if (query['limit']) {
        options['limit'] = query['limit'];
      }
    }
    return options;
  }
}
