
import { createPool, Pool } from "mysql"
import { config } from "../config/config"

export interface MySqlData {
    [name: string]: string | string[] | number | number[]
}

let mysql_config = config.mysql

let pool: Pool = createPool({
    host: mysql_config.host,
    port: mysql_config.port,
    user: mysql_config.user,
    password: mysql_config.password,
    database: mysql_config.db,
    queryFormat: function (query, values) {
        if (!values) return query
        return query.replace(/:(\w+)/g, function (txt: string, key: string) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key])
            }
            return txt
        }.bind(this))
    },
    charset: 'utf8mb4_unicode_ci',
    supportBigNumbers: true
})


interface QueryFunction<T> {
    (query: string, data: object): Promise<T>
}
interface MysqlWhereObject {
    [name: string]:any
}

interface PoolWrap<T> {
    (fn: Function): QueryFunction<T>
}

let pool_wrap: PoolWrap<any> = function (fn: Function): QueryFunction<any> {
    return function (...args: any[]) {
        return new Promise((resovle, reject) => {
            pool.getConnection(function (err, client) {
                if (err) {
                    reject(err)
                }
                else {
                    let start_time = new Date().getTime()
                    let [sql, params] = fn(...args)
                    if (params) {
                        sql = client.format(sql, params)
                    }
                    client.query(sql, null, function (err, data) {
                        let end_time = new Date().getTime()
                        console.info(`[COST]${end_time - start_time}ms  exec sql: ${sql}`)
                        client.release()
                        if (err) {
                            reject(err)
                        }
                        resovle(data)
                    })
                }
            })
        })
    }
}

function gen(wheres: MysqlWhereObject, split: string = ' , ', nowhere: boolean = false) {
    let wheres_key = Object.keys(wheres)
    let tails = '',
        tail_key = 'tail',
        where_txt: string
    if (wheres_key.length) {
        where_txt = wheres_key.map(k => {
            if (k === tail_key) {
                tails = ' ' + wheres[k]
                return '1=1';
            } else {
                if (typeof wheres[k] === 'string') {
                    if (/\s+/g.test(wheres[k])) {
                        return `${k} ${wheres[k]}`
                    } else {
                        return `${k} = :${k}`
                    }
                } else {
                    return `${k} = :${k}`
                }
            }
        }).join(split)
        where_txt += tails
        if (!nowhere) {
            where_txt = ' where ' + where_txt
        }
    } else {
        where_txt = ''
    }
    return where_txt
}
interface MySqlInsert {
    (table: string, data:any ): Promise<any>
}
interface MySqlGet {
    (table: string, wheres: MysqlWhereObject, fields: string[]): Promise<any>
}
interface MySqlUpdate {
    (table: string, sets: any, where: MysqlWhereObject): Promise<any>
}
interface MysqlDel {
    (table: string, wheres: MysqlWhereObject): Promise<any>
}
interface MysqlExec {
    (query_str: string, params?: MysqlWhereObject): Promise<any>
}

interface MysqlSqlFn {
    insert: MySqlInsert,
    get: MySqlGet,
    update: MySqlUpdate,
    exec_sql: MysqlExec,
    del: MysqlDel
}

export let mysqlOp: MysqlSqlFn = {

    insert: pool_wrap((table: string, obj: MySqlData) => {
        let keys = Object.keys(obj)
        let columns = keys.join(',')
        let val_name = keys.map(k => ':' + k).join(',')
        let sql = `insert into ${table} (${columns}) values(${val_name})`
        return [sql, obj]
    }),
    get: pool_wrap((table: string, wheres: MysqlWhereObject, fields: string[]) => {
        for(let i = 0;i<fields.length;++i){
            fields[i] = `${fields[i]}`
        }

        let where_txt = gen(wheres, ' AND ')
        let sql = `select ${fields.join(',')} from ${table}  ${where_txt}`
        return [sql, wheres]
    }),
    update: pool_wrap((table: string, set_value: MysqlWhereObject, wheres: MysqlWhereObject) => {
        let where_txt = gen(wheres, ' AND ')
        let set_txt = gen(set_value, ' , ', true)
        let sql = `update ${table} set ${set_txt} ${where_txt}`
        let params = Object.assign(set_value, wheres)
        return [sql, params]
    }),
    exec_sql: pool_wrap((sql: string, params?: MysqlWhereObject) => { return [sql, params] }),
    del: pool_wrap((table: string, wheres: MysqlWhereObject) => {
        let where_txt = gen(wheres)
        let sql = `DELETE FROM ${table} ${where_txt}`
        return [sql, wheres]
    })
}