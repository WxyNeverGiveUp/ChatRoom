import { CacheHash, HashFactory, CacheSet, SetFactory } from './redisModel';
import { config } from '../config/config';
import { roomManager } from '../app';

class ChatterManager {
    public chatters: Map<username, Chatter> // 用户map
    public socketIdMap: Map<string, username> // socketId 对应的username
    constructor (){
        this.chatters = new Map()
    }

    /**
     * 创建一个在线聊天用户
     * @param username 用户名
     * @param socketId socketId
     */
    createChatter (username: username, socketId: string): Chatter {
        const chatter = this.chatters.get(username)
        if (!chatter) {
            const newChatter = new Chatter(username, socketId)
            this.chatters.set(username, newChatter)
            this.socketIdMap.set(socketId, username)
            return newChatter
        } else {
            return chatter
        }
    }

    /**
     * 获取用户
     * @param username 用户名
     */
    getChatter(username: username): Chatter {
        const chatter = this.chatters.get(username)
        return chatter
    }

    /**
     * 清除聊天者
     * @param socketId socket连接ID
     */
    delChatter (socketId: string) {
        const name = this.socketIdMap.get(socketId)
        if (name) {
            this.chatters.delete(name)
            this.socketIdMap.delete(socketId)
        }
    }
}

export const chatterManager = new ChatterManager()

export class Chatter {
    private socketId: string // 每个用户连接时的socketId 断开后销毁
    private username: username
    private roomMsg: CacheHash<message[]> // 缓存消息信息
    private roomSet: CacheSet<number> // 该用户曾加入过的聊天室
    constructor(username: username, socketId: string) {
        this.username = username
        this.socketId = socketId
        this.roomMsg = HashFactory<message[]>({
            pre: config.server.mount, 
            key: cacheKey.h_username_room_msg + this.username
        })
        this.roomSet = SetFactory<number>({
            pre: config.server.mount, 
            key: cacheKey.s_username_roomId + this.username
        })
    }

    /**
     * [静态方法] 
     * redis中添加一条未读消息
     * @param user 用户
     * @param message 消息
     */
    static async addUnreadMsg(user: username, message: message) {
        const roomMsg = HashFactory<message[]>({
            pre: config.server.mount, 
            key: cacheKey.h_username_room_msg + user
        })
        let msgList = await roomMsg.getField(message.roomId + '')
        if (!msgList) {
            await roomMsg.setField(message.roomId + '', [message])
        } else {
            msgList.push(message)
            await roomMsg.setField(message.roomId + '', msgList)
        }
    }

    /**
     * [静态方法]
     * redis中添加一条已读消息
     * @param user 用户
     * @param message 消息
     */
    static async delUnreadMsg(user: username, message: message) {
        const roomMsg = HashFactory<message[]>({
            pre: config.server.mount, 
            key: cacheKey.h_username_room_msg + user
        })
        let msgList = await roomMsg.getField(message.roomId + '')
        const msgIndex = msgList.indexOf(message)
        if (msgIndex >= 0) {
            const newMsgList = msgList.splice(msgIndex, 1)
            await roomMsg.setField(message.roomId + '', newMsgList)
        }
    }

    /**
     * 获取该用户的未读消息
     * @param roomId 房间号
     */
    async getUnreadMsg(roomId: number): Promise<message[]> {
        const msgList = await this.roomMsg.getField(roomId + '')
        return msgList
    }

    /**
     * 获取socketId
     */
    getSocketId() {
        return this.socketId
    }

    /**
     * 获取姓名
     */
    getName() {
        return this.username
    }

    /**
     * 阅读某条信息
     * @param roomId 聊天室ID
     * @param messageId 消息ID
     */
    async readMessage(roomId: number, messageId: number) {
        const msgList = await this.getUnreadMsg(roomId)
        const msg = msgList.find(item => item.roomId === roomId && item.id === messageId)
        if (msg) {
            await Chatter.delUnreadMsg(this.username, msg)
        }
    }

    /**
     * 发送消息
     * @param roomId 聊天室ID
     * @param messageId 消息ID
     */
    sendMessage(roomId: number, message: message) {
        let room = roomManager.getRoom(roomId)
        console.log(room)
        console.log(message)
    }

    /**
     * 获取未读信息
     * @param roomId 聊天室Id
     */
    getUnreadMessage(roomId: number) {
        console.log(roomId)
    }

    /**
     * 获取聊天室
     */
    async getRooms(): Promise<number[]> {
        return await this.roomSet.getAll()
    }

    /**
     * 加入聊天室
     */
    joinRoom(roomId: number) {
        const room = roomManager.getRoom(roomId)
        console.log(room)
    }

}