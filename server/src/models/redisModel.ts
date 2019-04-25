import { redisClient } from '../lib/redis';

class CacheBase {
    public pre: string
    public key: string
    public fullKey: string
    constructor(pre: string, key: string) {
        this.pre = pre
        this.key = key
        this.fullKey = pre + '_' + key
    }
    async delKey() {
        redisClient.del(this.fullKey)
    }
}

class CacheKeyVal extends CacheBase {
    public pre: string
    public key: string
    public fullKey: string
    constructor(pre: string, key: string) {
        super(pre, key)
        this.pre = pre
        this.key = key
        this.fullKey = pre + key
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
}

/**
 * hash类型
 */
class CacheHash extends CacheBase {
    public pre: string
    public key: string
    public fullKey: string
    constructor(pre: string, key: string) {
        super(pre, key)
        this.pre = pre
        this.key = key
        this.fullKey = pre + '_' + key
    }

    /**
     * 获取一个hash类型的属性
     * @param field 属性名
     */
    async getField(field: string): Promise<null | string> {
        let result: string | null = null
        await new Promise((resolve, reject) => {
            redisClient.hget(this.fullKey, field, (e, v) => {
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
     * 设置一个hash类型的属性
     * @param field 属性名
     * @param value 属性值
     */
    async set(field: string, value: string): Promise<boolean> {
        let result: boolean = true
        await new Promise((resolve, reject) => {
            redisClient.hset(this.fullKey, field, value, (e) => {
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
 * 数组模式
 * @param pre 前缀 
 * @param key 键名
 */
class CacheList extends CacheBase {
    public pre: string
    public key: string
    public fullKey: string
    constructor(pre: string, key: string) {
        super(pre, key)
        this.pre = pre
        this.key = key
        this.fullKey = pre + '_' + key
    }
}

/**
 * 工厂模式hash
 * @param pre 前缀
 * @param key 键名
 */
export function HashFactory(pre: string, key: string) {
    return new CacheHash(pre, key)
}

/**
 * 工厂模式keyVal
 * @param pre 前缀
 * @param key 键名
 */
export function KeyValFactory(pre: string, key: string) {
    return new CacheKeyVal(pre, key)
}

export function ListFactory(pre: string, key: string) {
    return new CacheList(pre, key)
}