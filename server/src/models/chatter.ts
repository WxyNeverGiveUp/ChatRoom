import { CacheHash, HashFactory, CacheSet, SetFactory } from './redisModel';
import { config } from '../config/config';
import { roomManager } from '../app';
import * as fs from 'fs'
import * as path from 'path'

/**
 * 聚合管理所有聊天者的唯一实例
 */
class ChatterManager {
    public chatters: Map<username, Chatter> // 用户map
    public socketIdMap: Map<string, username> // socketId 对应的username
    constructor (){
        this.chatters = new Map()
        this.socketIdMap = new Map()
    }

    /**
     * 创建一个在线聊天用户
     * @param username 用户名
     * @param socketId socketId
     */
    createChatter (username: username, socketId: string): Chatter {
        const chatter = this.chatters.get(username)
        this.socketIdMap.set(socketId, username)
        if (!chatter) {
            const newChatter = new Chatter(username, socketId)
            this.chatters.set(username, newChatter)
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
        return this.chatters.get(username)
    }

    /**
     * 清除聊天者 释放内存
     * @param user username
     */
    delChatter (user: username) {
        const chatter = this.chatters.get(user)
        if (chatter) {
            const name = chatter.getName()
            this.chatters.delete(name)
            const socketId = chatter.getSocketId()
            this.socketIdMap.delete(socketId)
        }
    }

    /**
     * 聊天用户上线所有房间
     * @param user 用户名
     */
    async onlineRooms (user: username) {
        const chatter = this.chatters.get(user)
        const roomIds = await chatter.getRooms()
        for (const roomId of roomIds) {
            const room = roomManager.getRoom(roomId)
            if (room) {
                await room.online(user)
            }
        }
    }

    /**
     * 用户离开所有房间
     * @param user 用户名 
     */
    async outlineRooms (user: username) {
        const chatter = this.chatters.get(user)
        const roomIds = await chatter.getRooms()
        for (const roomId of roomIds) {
            const room = roomManager.getRoom(roomId)
            if (room) {
                await room.offline(user)
            }
        }
        const socketId = chatter.getSocketId()
        this.socketIdMap.delete(socketId)
    }

    /**
     * 通过socketId获取姓名
     * @param socketId socketId
     */
    socket2name (socketId: string) {
        return this.socketIdMap.get(socketId)
    }
}

export const chatterManager = new ChatterManager()

/**
 * 每一个聊天者实例
 */
export class Chatter {
    private socketId: string // 每个用户连接时的socketId 断开后销毁
    private username: username
    private roomMsg: CacheHash<message[]> // 缓存消息信息
    private history: CacheHash<message[]> // 缓存历是消息
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
        this.history = HashFactory<message[]>({
            pre: config.server.mount, 
            key: cacheKey.h_username_history_msg + username
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
        const history = HashFactory<message[]>({
            pre: config.server.mount, 
            key: cacheKey.h_username_history_msg + user
        })
        /**
         * 添加历史消息
         */
        let historyMsgList = await history.getField(message.roomId + '')
        if (!historyMsgList) {
            await history.setField(message.roomId + '', [message])
        } else {
            historyMsgList.push(message)
            await history.setField(message.roomId + '', historyMsgList)
        }

        /**
         * 添加当前未读消息
         */
        let msgList = await roomMsg.getField(message.roomId + '')
        if (!msgList) {
            await roomMsg.setField(message.roomId + '', [message])
        } else {
            msgList.push(message)
            await roomMsg.setField(message.roomId + '', msgList)
        }
    }

    /**
     * 添加自己的历时消息
     * @param user 用户
     * @param message 消息
     */
    static async addMyMsgHistory(user: username, message: message) {
        const history = HashFactory<message[]>({
            pre: config.server.mount, 
            key: cacheKey.h_username_history_msg + user
        })
        /**
         * 历史消息
         */
        let historyMsgList = await history.getField(message.roomId + '')
        if (!historyMsgList) {
            await history.setField(message.roomId + '', [message])
        } else {
            historyMsgList.push(message)
            await history.setField(message.roomId + '', historyMsgList)
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

    static async readAllMsgs(user: username, roomId: number) {
        const roomMsg = HashFactory<message[]>({
            pre: config.server.mount, 
            key: cacheKey.h_username_room_msg + user
        })
        await roomMsg.delField(roomId + '')
    }

    /**
     * 获取历史消息
     * @param roomId 房间
     */
    async getHistory(roomId: number) {
        return await this.history.getField(roomId + '')
    }

    /**
     * 获取该用户的未读消息
     * @param roomId 房间号
     */
    async getUnreadMsg(roomId: number): Promise<message[]> {
        const msgList = await this.roomMsg.getField(roomId + '')
        return msgList || []
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
     * 获取聊天室
     */
    async getRooms(): Promise<number[]> {
        return await this.roomSet.getAll()
    } 

    /**
     * 加入聊天室
     */
    async joinRoom(roomId: number) {
        const room = roomManager.getRoom(roomId)
        await room.join(this.username)
        await this.roomSet.add(roomId)
    }

    /**
     * 离开聊天室
     */
    async leaveRoom(roomId: number) {
        const room = roomManager.getRoom(roomId)
        await room.leave(this.username)
        await this.roomSet.del([roomId])
    }

    /**
     * 获取头像
     */
    getImg () {
        const url = path.join(__dirname, '../public/upload/')
        const filename = readDirSync(url)
        const isExists = filename.filter(i => i.includes(this.username))
        if (isExists.length > 0) {
            // 寻找最新的一张图片
            const prename = isExists.map(item => item.split('.png')[0])
            const times = prename.map(item => item.split('-')[1]).map(item => Number(item))
            const lastTime = times.sort((a, b) =>  b - a)[0]
            return `http://localhost:3000/upload/${this.username}-${lastTime}.png`
        } else {
            return 'http://localhost:3000/upload/logo.png'
        }
    }
}

function readDirSync(path: string){  
    let filenames: string[] = []
    let pa = fs.readdirSync(path);  
    pa.forEach(function(ele){  
        var info = fs.statSync(path+"/"+ele)      
        if(info.isDirectory()){  
            readDirSync(path+"/"+ele) 
        }else{  
            filenames.push(ele)
        }     
    })  
    return filenames
}