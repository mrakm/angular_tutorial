import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcrypt';

export class Helper {

    static SALTROUNDS = 10;
    /**
     * this function handle offset limit and sort.
     *
     * @static
     * @param {*} reqQuery
     * @returns
     * @memberof Helper
     */
    static reqQueryToSequelizeXtra(reqQuery) {

        let extra = {};

        if (reqQuery['offset']) {
            extra['offset'] = parseInt(reqQuery['offset']);
        }
        if (reqQuery['limit']) {
            extra['limit'] = parseInt(reqQuery['limit']);
        }
        if (reqQuery['sortAttribute']) {
            let sortAttribute = [];
            reqQuery['sortAttribute'].split('.').forEach(element => {
                sortAttribute.push(element.includes('->') ? element.replace('->', '.') : element)
            });
            extra['order'] = [[...sortAttribute, reqQuery['sortDirection']]];
        }

        return extra;
    }

    /**
     * This function handle AND, OR, ON and Not-On Conditions 
     *
     * @static
     * @param {*} reqQuery
     * @returns
     * @memberof Helper
     */
    static reqQueryToSequelizeConditions(reqQuery) {

        let condition: any = {
            [Sequelize.Op.and]: [...this.handleAdvanceSearch(reqQuery)],
        }

        //  if (reqQuery['conditionOnInclude']) {
        //     Helper.handleCondition(condition, reqQuery);
        // }

        // if (reqQuery['conditionOnInclude']) {
        //     Helper.handleCondition(condition, reqQuery);
        // }

        // if (reqQuery['conditionOn']) {
        //     Helper.handleCondition(condition, reqQuery);
        // }

        // if (reqQuery['conditionOnJSON']) {
        //     Helper.handleCondition(condition, reqQuery);
        // }

        // if (reqQuery['notConditionOn']) {
        //     Helper.handleCondition(condition, reqQuery);
        // }

        // if (reqQuery['lessThanConditionOn']) {
        //     Helper.handleCondition(condition, reqQuery);
        // }

        // if (reqQuery['betweenConditionOn']) {
        //     Helper.handleCondition(condition, reqQuery);
        // }

        return condition;

    }

    /**
     * Advance search Handle multiple keyword of search in AND Condition with OR Conditions on Columns
     *
     * @static
     * @param {*} reqQuery
     * @returns
     * @memberof Helper
     */
    static handleAdvanceSearch(reqQuery) {

        let tempReturnArr = [];
        if (reqQuery['search']) {
            reqQuery['search'].split(',').forEach(element => {
                let searchInclude: any = []
                let searchInJSON: any = []
                if (reqQuery.searchOnInclude) {
                    searchInclude = this.handleIncludeSearch(element, reqQuery.searchOnInclude)
                }
                if (reqQuery.searchOnJSON) {
                    searchInJSON = this.handleJSONSearch(element, reqQuery.searchOnJSON)
                }
                tempReturnArr.push({
                    [Sequelize.Op.or]: [...this.handleSearch(reqQuery, element), ...searchInclude, ...searchInJSON]
                })
            });
        }
        return tempReturnArr;
    }

    /**
     * This Function will handle conditions of generic list query
     *
     * @static
     * @param {*} condition
     * @param {*} reqQuery
     * @memberof Helper
     */
    static handleCondition(condition, reqQuery) {
        if (reqQuery['conditionOn'] && reqQuery['conditionValue']) {
            Helper.handleSimpleConditions(reqQuery, condition);
        }

        if (reqQuery['conditionOnInclude'] && reqQuery['conditionOnIncludeValue']) {
            Helper.handleSimpleConditionOnInclude(reqQuery, condition);
        }

        if (reqQuery['notConditionOn'] && reqQuery['notConditionValue']) {
            Helper.handleNotConditions(reqQuery, condition);
        }

        if (reqQuery['lessThanConditionOn'] && reqQuery['lessThanValue']) {
            Helper.handleLessThanConditions(reqQuery, condition);
        }

        if (reqQuery['betweenConditionOn'] && reqQuery['betweenValue']) {
            Helper.handleBetweenConditions(reqQuery, condition);
        }

        if (reqQuery['conditionOnJSON'] && reqQuery['conditionOnJSONValue']) {
            Helper.handleJSONCondition(reqQuery, condition);
        }
    }

    private static handleBetweenConditions(reqQuery: any, condition: any) {
        const tempBetweenConditionOn = reqQuery['betweenConditionOn'].split(',');
        const tempBetweenValue = reqQuery['betweenValue'].split(',');
        for (let index = 0; index < tempBetweenConditionOn.length; index++) {
            condition[tempBetweenConditionOn[index]] = { [Sequelize.Op.between]: tempBetweenValue[index].split('&&') };
        }
    }

    private static handleLessThanConditions(reqQuery: any, condition: any) {
        const tempLessThanConditionOn = reqQuery['lessThanConditionOn'].split(',');
        const tempLessThanValueValue = reqQuery['lessThanValue'].split(',');
        for (let index = 0; index < tempLessThanConditionOn.length; index++) {
            condition[tempLessThanConditionOn[index]] = { [Sequelize.Op.lt]: tempLessThanValueValue[index] };
        }
    }

    private static handleSimpleConditions(reqQuery: any, condition: any) {
        const tempCondition = reqQuery['conditionOn'].split(',');
        const tempConditionValue = reqQuery['conditionValue'].split(',');
        for (let index = 0; index < tempCondition.length; index++) {
            condition[tempCondition[index]] = tempConditionValue[index];
        }
    }

    private static handleSimpleConditionOnInclude(reqQuery: any, condition: any) {
        const tempCondition = reqQuery['conditionOnInclude'].split(',');
        const tempConditionValue = reqQuery['conditionOnIncludeValue'].split(',');
        for (let index = 0; index < tempCondition.length; index++) {
            condition[`$${tempCondition[index]}$`] = tempConditionValue[index];
        }
    }

    private static handleNotConditions(reqQuery: any, condition: any) {
        const tempCondition = reqQuery['notConditionOn'].split(',');
        const tempConditionValue = reqQuery['notConditionValue'].split(',');
        for (let index = 0; index < tempCondition.length; index++) {
            condition[tempCondition[index]] = { [Sequelize.Op.ne]: tempConditionValue[index] };
        }
    }

    private static handleJSONCondition(reqQuery: any, condition: any) {
        const tempCondition = reqQuery['conditionOnJSON'].split(',');
        const tempConditionValue = reqQuery['conditionOnJSONValue'].split(',');
        for (let index = 0; index < tempCondition.length; index++) {
            condition[tempCondition[index]] = tempConditionValue[index];
        }
    }

    /**
     * This Function will handle Search on Parent Table of generic list query
     *
     * @static
     * @param {*} reqQuery
     * @returns Array of Search Condition
     * @memberof Helper
     */
    static handleSearch(reqQuery, value) {
        let search = '%' + (value ? value : '') + '%';
        let tempSearchOn = []
        if (reqQuery['searchOn']) {
            reqQuery['searchOn'].split(',').forEach(key => {
                let tempObj = {}
                tempObj[key] = { [Sequelize.Op.iLike]: search }
                tempSearchOn.push(tempObj)
            });
        }
        return tempSearchOn;
    }

    /**
     * This Function will handle Search on Nested Table of generic list query.
     *
     * @static
     * @param {*} reqQuery
     * @param {*} searchOnInclude
     * @returns Array of Search Condition
     * @memberof Helper
     */
    static handleIncludeSearch(value, searchOnInclude) {
        let search = '%' + (value ? value : '') + '%';
        let tempSearchOnInclude = []
        searchOnInclude.split(',').forEach(key => {
            let tempObj = {}
            if (!key.includes('->')) {
                tempObj[`$${key}$`] = { [Sequelize.Op.iLike]: search };
            } else {
                let key1 = key.split('->');
                tempObj[`$${key1[0]}$`] = {};
                tempObj[`$${key1[0]}$`][Sequelize.Op.contains] = {};
                let valueObj = {};
                valueObj[key1[1]] = { [Sequelize.Op.iLike]: search }
                tempObj[`$${key1[0]}$`][Sequelize.Op.contains] = [valueObj];
            }
            tempSearchOnInclude.push(tempObj)
        });
        return tempSearchOnInclude;
    }

    /**
     * 
     *
     * @static
     * @param {*} value
     * @param {*} handleJSONSearch
     * @returns
     * @memberof Helper
     */
    static handleJSONSearch(value, searchOnJSON) {
        let search = '%' + (value ? value : '') + '%';
        let tempSearchOnJSON = []
        searchOnJSON.split(',').forEach((key: any) => {
            let tempObj = {}
            if (key.includes('->')) {
                key = key.split('->');
                tempObj[key[0]] = {};
                this.createNestedObject(tempObj, key, { [Sequelize.Op.iLike]: search })

            } else {
                tempObj[key] = { [Sequelize.Op.contains]: [value] };
            }
            tempSearchOnJSON.push(tempObj)
        });
        return tempSearchOnJSON;
    }

    /**
     *
     *
     * @static
     * @param {*} obj
     * @param {*} keyPath
     * @param {*} value
     * @memberof Helper
     */
    static createNestedObject(obj, keyPath, value) {
        const lastKeyIndex = keyPath.length - 1;
        for (var i = 0; i < lastKeyIndex; ++i) {
            const key = keyPath[i];
            if (!(key in obj)) {
                obj[key] = {}
            }
            obj = obj[key];
        }
        obj[keyPath[lastKeyIndex]] = value;
    }

    // JSONB can be queried in three different ways.
    // Nested object
    // {        
    //     meta: {
    //       video: {
    //         url: {
    //           [Op.ne]: null
    //         }
    //       }
    //     }
    //   }
    // Nested key
    //   {
    //     "meta.audio.length": {
    //       [Op.gt]: 20
    //     }
    //   }
    // Containment
    //   {
    //     "meta": {
    //       [Op.contains]: {
    //         site: {
    //           url: 'http://google.com'
    //         }
    //       }
    //     }
    //   }


    /**
     * Encrypt str with bcrypt
     * @param str 
     */
    static encrypt(str) {
        return bcrypt.hash(str, this.SALTROUNDS);
    }

    static compare(str, hash) {
        return bcrypt.compare(str, hash);
    }

    /**
     * Verify password
     * @param password 
     * @param hashedPassword 
     */
    static verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }


    static getCurrentYearMonth(): string {
        return `${new Date().getFullYear().toString().slice(-2)}-${(new Date().getMonth() + 1).toString().length > 1 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)}`;
    }

    static toDateOnly(date): string {
        if (typeof date === 'string' && date.split('T').length === 1) {
            date = `${date}T00:00:00`;
        }
        date = new Date(date);
        const year = date.getFullYear();

        const month = date.getMonth() + 1;
        const monthStr = month > 9 ? month : `0${month}`;

        const dayOfMonth = date.getDate();
        const dayStr = dayOfMonth > 9 ? dayOfMonth : `0${dayOfMonth}`;

        return `${year}-${monthStr}-${dayStr}`;
    }

}