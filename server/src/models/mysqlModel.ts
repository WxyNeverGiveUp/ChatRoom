/**
 * model总表示mysql操作
 * handler，表示综合操作，与业务逻辑耦合更重
 */

import { mysqlOp, MySqlData } from "../lib/mysql";
interface ModelNewParams {
    table: string,
    pkey?: string
}
export interface HashMap {
    [name: string]: any
}

export class MysqlModel<T> {
    public table: string = ''
    constructor(opts: ModelNewParams) {
        this.table = opts.table
    }
    /**
     * mysql操作查询条件/插入操作使用对象可能的数据结构
     * @template 单个插入，'hi'为字段,'lo'为值的情况
     *      {
     *          'hi':'lo'
     *      }
     * @template   批量插入/更新 
     * 注 数组中对象的key要相同
     *  [{"hi": 1}, {"hi": 2}]
     */
    async insert(data: T) {
        return mysqlOp.insert(this.table, data)
    }
    async get(wheres: HashMap = {}, fields: string[]): Promise<T[]> {
        return mysqlOp.get(this.table, wheres, fields)
    }
    async query(queryStr: string, params?: T) {
        return mysqlOp.exec_sql(queryStr, params)
    }
    async del(wheres: HashMap) {
        return mysqlOp.del(this.table, wheres)
    }
    /**
     * mysql操作查询条件/插入操作使用对象可能的数据结构
     * @template 单个插入，'hi'为字段,'lo'为值的情况
     *      {
     *          'hi':'lo'
     *      }
     * @template   批量插入/更新
     *  { 'hi':[1,2,3,4,5,6]}
     */
    async update(sets: HashMap, wheres: HashMap) {
        return mysqlOp.update(this.table, sets, wheres)
    }
}


export function mysqlFactory<T>(param: ModelNewParams) {
    return new MysqlModel<T>(param)
}

export function handlerData(datas: any[], pk: string) {
    let result: any = {}
    let property_names: string[] = []
    for (let i = 0; i < datas.length; ++i) {
        let tmp: MySqlData = {}
        if (datas[i] instanceof Array) {
            if (i === 0) {
                property_names = datas[i]
                continue
            }
            for (let k = 0; k < property_names.length; ++k) {
                if (pk === property_names[k]) {
                    result[datas[i][k]] = tmp
                }
                tmp[property_names[k]] = datas[i][k]
            }
        } else {
            for (let p in datas[i]) {
                if (pk === p) {
                    result[datas[i][p]] = datas[i]
                }
            }
        }
    }
    return result
}