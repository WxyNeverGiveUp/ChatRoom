import { CacheHash, HashFactory, CacheSet, SetFactory } from './redisModel';
import { config } from '../config/config';

export class ChatterManager {
    public chatters: Map<username, Chatter>
    constructor (){
    }

    /**
     * 获取用户
     * @param username 用户名
     */
    getChatter(username: username): Chatter {
        const chatter = this.chatters.get(username)
        if (!chatter) {
            const newChatter = new Chatter(username)
            this.chatters.set(username, newChatter)
            return newChatter
        } else {
            return chatter
        }
        
    }
}

class Chatter {
    private username: username
    private roomMsg: CacheHash<message> // 缓存消息信息
    private roomSet: CacheSet<number> // 该用户曾加入过的聊天室
    constructor(username: username) {
        this.username = username
        this.roomMsg = HashFactory<message>({
            pre: config.server.mount, 
            key: cacheKey.h_username_room_msg + this.username
        })
        this.roomSet = SetFactory<number>({
            pre: config.server.mount, 
            key: cacheKey.s_username_roomId + this.username
        })
    }

    /**
     * 阅读某条信息
     * @param roomId 聊天室ID
     * @param messageId 消息ID
     */
    readMessage(roomId: number, messageId: number) {
        
    }

    /**
     * 发送消息
     * @param roomId 聊天室ID
     * @param messageId 消息ID
     */
    sendMessage(roomId: number, message: message) {

    }

    /**
     * 获取未读信息
     * @param roomId 聊天室Id
     */
    getUnreadMessage(roomId: number) {

    }

    /**
     * 获取聊天室
     */
    async getRooms(): Promise<number[]> {
        return await this.roomSet.getAll()
    }
}