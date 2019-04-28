import { redisClient } from '../lib/redis';

class CacheBase {
    public pre: string
    public key: string
    public fullKey: string
    constructor(CacheParams: {pre: string, key: string}) {
        this.pre = CacheParams.pre
        this.key = CacheParams.key
        this.fullKey = this.pre + '_' + this.key
    }
    async delKey() {
        redisClient.del(this.fullKey)
    }
}

export class CacheKeyVal extends CacheBase {
    public pre: string
    public key: string
    public fullKey: string
    constructor(CacheParams: {pre: string, key: string}) {
        super(CacheParams)
        this.pre = CacheParams.pre
        this.key = CacheParams.key
        this.fullKey = CacheParams.pre + CacheParams.key
    }

    /**
     * 设置一个keyVal类型的键
     * @param value 键值
     * @param expire [可选] 存在秒数s
     * @returns boolean 表示是否设置成功 
     */
    async set(value: string, expire?: number): Promise<boolean> {
        let result = true
        if (expire) {
            await new Promise((resolve, reject) => {
                redisClient.setex(this.fullKey, expire, value, (e) => {
                    if (e) {
                        result = false
                        reject()
                    } else {
                        resolve()
                    }
                })
            })
        } else {
            await new Promise((resolve, reject) => {
                redisClient.set(this.fullKey, value, (e) => {
                    if (e) {
                        result = false
                        reject()
                    } else {
                        resolve()
                    }
                })
            })
        }
        return result
    }

    /**
     * 获取一个keyVal类型键值
     * @return string | null 该键存在则返回string否则返回null
     */
    async get(): Promise<null | string> {
        let result: string | null = null
        await new Promise((resolve, reject) => {
            redisClient.get(this.fullKey, (e, v) => {
                if (e) {
                    console.log(e)
                    reject()
                } else { 
                    result = v
                    resolve()
                }
            })
        })
        return result
    }

    /**
     * 自增
     * @param number 增加数
     * @return [number] 自增后的值
     */
    async incrby(number = 1): Promise<number> {
        let result = 0
        await new Promise((resolve, reject) => {
            redisClient.incrby(this.fullKey, number, (e, v) => {
                if (e) {
                    console.log(e)
                    reject()
                } else { 
                    result = v
                    resolve()
                }
            })
        })
        return result
    }
}

/**
 * hash类型
 */
export class CacheHash<T> extends CacheBase {
    public pre: string
    public key: string
    public fullKey: string
    constructor(CacheParams: {pre: string, key: string}) {
        super(CacheParams)
        this.pre = CacheParams.pre
        this.key = CacheParams.key
        this.fullKey = CacheParams.pre + '_' + CacheParams.key
    }

    /**
     * 获取一个hash类型的属性
     * @param field 属性名
     */
    async getField<T>(field: string): Promise<null | T> {
        let result: T | null = null
        await new Promise((resolve, reject) => {
            redisClient.hget(this.fullKey, field, (e, v) => {
                if (e) {
                    reject()
                } else { 
                    try {
                        result = JSON.parse(v)
                        resolve()
                    } catch (e) {
                        reject()
                    }
                }
            })
        })
        return result
    }

    /**
     * 设置一个hash类型的属性
     * @param field 属性名
     * @param value 属性值
     */
    async setField(field: string, value: T): Promise<boolean> {
        let result: boolean = true
        const str = JSON.stringify(value)
        await new Promise((resolve, reject) => {
            redisClient.hset(this.fullKey, field, str, (e) => {
                if (e) {
                    result = false
                    console.log(e)
                    reject()
                } else {
                    resolve()
                }
            })
        })
        return result
    }
}

/**
 * 数组类型
 * @param pre 前缀 
 * @param key 键名
 */
export class CacheList<T> extends CacheBase {
    public pre: string
    public key: string
    public fullKey: string
    constructor(CacheParams: {pre: string, key: string}) {
        super(CacheParams)
        this.pre = CacheParams.pre
        this.key = CacheParams.key
        this.fullKey = CacheParams.pre + '_' + CacheParams.key
    }

    /**
     * 插入一个值
     * @param value 要插入的值
     * @return [boolean] 是否插入成功
     */
    async push(value: T): Promise<boolean> {
        let result: boolean = true
        const str = JSON.stringify(value)
        await new Promise((resolve, reject) => {
            redisClient.rpush(this.fullKey, str, (e) => {
                if (e) {
                    result = false
                    console.log(e)
                    reject()
                } else {
                    resolve()
                }
            })
        })
        return result
    }

    /**
     * 删除一个值
     * @param value 要删除的值
     * @return [boolean] 是否删除成功
     */
    async del(value: T): Promise<boolean> {
        let result: boolean = true
        const str = JSON.stringify(value)
        await new Promise((resolve, reject) => {
            redisClient.lrem(this.fullKey, 0, str, (e) => {
                if (e) {
                    result = false
                    console.log(e)
                    reject()
                } else {
                    resolve()
                }
            })
        })
        return result
    }

    async getAll(): Promise<T[]> {
        let list: T[] = []
        await new Promise((resolve, reject) => {
            redisClient.lrange(this.fullKey, 0, -1, (e, v) => {
                if (e) {
                    console.log(e)
                    reject()
                } else {
                    for (const tmp of v) {
                        list.push(JSON.parse(tmp))
                    }
                    resolve()
                }
            })
        })
        return list
    }
}

/**
 * 集合类型
 * @param CacheParams 
 */
export class CacheSet<T> extends CacheBase {
    public pre: string
    public key: string
    public fullKey: string
    constructor(CacheParams: {pre: string, key: string}) {
        super(CacheParams)
        this.pre = CacheParams.pre
        this.key = CacheParams.key
        this.fullKey = CacheParams.pre + '_' + CacheParams.key
    }

    /**
     * 添加
     * @param value 集合的值
     */
    async add(value: T): Promise<boolean> {
        let result: boolean = true
        const str = JSON.stringify(value)
        await new Promise((resolve, reject) => {
            redisClient.sadd(this.fullKey, str, (e) => {
                if (e) {
                    result = false
                    console.log(e)
                    reject()
                } else {
                    resolve()
                }
            })
        })
        return result
    }

    /**
     * 返回全部成员
     */
    async getAll(): Promise<T[]> {
        let list: T[] = []
        await new Promise((resolve, reject) => {
            redisClient.smembers(this.fullKey, (e, v) => {
                if (e) {
                    console.log(e)
                    reject()
                } else {
                    for (const tmp of v) {
                        list.push(JSON.parse(tmp))
                    }
                    resolve()
                }
            })
        })
        return list
    }

    /**
     * 删除部分成员
     * @param values 部分成员 
     */
    async del(values: T[]) {
        let result: boolean = true
        const strs = values.map((item) => JSON.stringify(item))
        await new Promise((resolve, reject) => {
            redisClient.srem(this.fullKey, strs, (e) => {
                if (e) {
                    result = false
                    console.log(e)
                    reject()
                } else {
                    resolve()
                }
            })
        })
        return result
    }
}

/**
 * 集合模式hash
 * @param CacheParams
 */
export function SetFactory<T>(CacheParams: {pre: string, key: string}) {
    return new CacheSet<T>(CacheParams)
}

/**
 * 工厂模式hash
 * @param CacheParams
 */
export function HashFactory<T>(CacheParams: {pre: string, key: string}) {
    return new CacheHash<T>(CacheParams)
}

/**
 * 工厂模式keyVal
 * @param pre 前缀
 * @param key 键名
 */
export function KeyValFactory(CacheParams: {pre: string, key: string}) {
    return new CacheKeyVal(CacheParams)
}

export function ListFactory<T>(CacheParams: {pre: string, key: string}) {
    return new CacheList<T>(CacheParams)
}