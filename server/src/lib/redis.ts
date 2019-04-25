import * as redis from 'redis'
import { config } from '../config/config'

export const redisClient = redis.createClient({
    host: config.redis.host,
    port: config.redis.port
})
