import * as socket from 'socket.io';
import { io } from '../websocket/socket';
import { roomName } from '../util/socket';
import { KeyValFactory, CacheKeyVal, CacheHash, HashFactory, CacheList, ListFactory } from './redisModel';
import { config } from '../config/config';

/**
 * 全部聊天室管理类
 */
class RoomManager {
    private id: CacheKeyVal // 聊天室唯一ID
    private roomName: CacheHash<number> // 房间名字
    public rooms: Map<number, Room>
    constructor() {
        this.id = KeyValFactory({
            pre: config.server.mount, 
            key: cacheKey.k_roomId
        })
        this.roomName = HashFactory<number>({
            pre: config.server.mount,
            key: cacheKey.h_roomName_id
        })

    }

    /**
     * reload重启服务时 重载所有聊天室
     */
    async reload() {

    }

    /**
     * 新建一个私聊房间
     * @param users 用户
     */
    async createRoom(users: username[]) {
        const id = await this.id.incrby(),
            name = users.join(',')
        console.log(`新建房间:${name},id:${id}`)
        await this.roomName.setField(name, id)
        const room = new Room(name, id)
        this.rooms.set(id, room)
        return room
    }

    /**
     * 建立一个默认大厅
     */
    createPublicRoom() {
        const publicId = 0
        const room = new Room(roomName.publicRoom, publicId)
        this.rooms.set(publicId, room)
        return room
    }

    /**
     * 获取指定聊天室
     * @param roomId 聊天室Id
     */
    getRoom(roomId: number) {
        return this.rooms.get(roomId)
    }
}


/**
 * 单独一个聊天室
 */
class Room {
    private id: number // 唯一Id
    private roomName: string
    private onlineCounter: number
    private onlineList: username[]
    private messageList: CacheList<message>
    private messageCounter: CacheKeyVal // 聊天室消息缓存
    constructor(roomName: string, id: number) {
        this.roomName = roomName
        this.id = id
        this.onlineCounter = 0
        this.onlineList = []
        this.messageCounter = KeyValFactory({
            pre: config.server.mount,
            key: cacheKey.k_room_messageCounter
        })
        this.messageList = ListFactory<message>({
            pre: config.server.mount,
            key: cacheKey.l_room_msg
        })
    }

    /**
     * 用户进入聊天室
     * @param username 用户名
     */
    enter(username: username): boolean {
        if (this.onlineList.includes(username)) {
            return false
        } else {
            this.onlineCounter++
            this.onlineList.push(username)
            return true
        }
    }

    /**
     * 用户离开聊天室
     * @param username 用户名
     */
    leave(username: username): boolean {
        let index = this.onlineList.indexOf(username)
        if (index > -1) {
            this.onlineList.splice(index, 1)
            this.onlineCounter--
            if (this.onlineCounter < 0) {
                this.onlineCounter = 0
            }
            return true
        } else {
            return false
        }
    }

    /**
     * 获取当前在线人数
     */
    getCounter(): number {
        return this.onlineCounter
    }

    /**
     * 获取当前在线列表
     */
    getList(): string[] {
        return this.onlineList
    }

    /**
     * 获取当前聊天室名称
     */
    getRoomName(): string {
        return this.roomName
    }

    /**
     * 获取当前聊天室Id
     */
    getRoomId(): number {
        return this.id
    }

    /**
     * 缓存消息
     * @param msg 消息
     */
    async cacheMessage(msg: message) {
        await this.messageCounter.incrby()
        this.messageList.push(msg)
    }
}

export const roomManager = new RoomManager()
export const publicRoom = roomManager.createPublicRoom()