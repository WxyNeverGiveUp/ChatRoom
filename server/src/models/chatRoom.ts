import { roomName } from '../util/socket';
import { KeyValFactory, CacheKeyVal, CacheHash, HashFactory, CacheList, ListFactory } from './redisModel';
import { config } from '../config/config';
import { io } from '../app'

/**
 * 全部聊天室管理类
 */
export class RoomManager {
    private id: CacheKeyVal // 聊天室唯一ID
    private roomName: CacheHash<number> // 房间名字
    public rooms: Map<number, Room>
    public roomsIdMap: Map<string, number> // 房间名字对应的roomId
    constructor() {
        this.id = KeyValFactory({
            pre: config.server.mount, 
            key: cacheKey.k_roomId
        })
        this.roomName = HashFactory<number>({
            pre: config.server.mount,
            key: cacheKey.h_roomName_id
        })
        this.rooms = new Map()
        this.roomsIdMap = new Map()
    }

    /**
     * reload重启服务时 重载所有聊天室
     */
    async reload() {

    }

    /**
     * 获取房间名称
     * @param users 用户
     * @return [string] 房间吗
     */
    getRoomName(users: username[]) {
        return users.sort().join(',')
    }

    /**
     * 新建一个私聊房间
     * @param users 用户
     */
    async createRoom(users: username[]) {
        const id = await this.id.incrby(),
            name = this.getRoomName(users)
        console.log(`新建房间:${name},id:${id}`)
        await this.roomName.setField(name, id)
        const room = new Room(name, id)
        this.rooms.set(id, room)
        this.roomsIdMap.set(name, id)
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
     * 获取用房间id
     * @param users 用户
     */
    getRoomId(users: username[]) {
        const name = this.getRoomName(users)
        return this.roomsIdMap.get(name)
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
    private onlineList: Set<username>
    private members: Set<username>
    private messageList: CacheList<message>
    private messageCounter: CacheKeyVal // 聊天室消息缓存
    constructor(roomName: string, id: number) {
        this.roomName = roomName
        this.id = id
        this.onlineList = new Set()
        this.members = new Set()
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
     * 上线
     * @param user 用户名 
     */
    online(user: username) {
        this.onlineList.add(user)
        return
    }

    /**
     * 离线
     * @param user 用户名
     */
    offline(user: username) {
        this.onlineList.delete(user)
    }

    /**
     * 用户进入聊天室
     * @param username 用户名
     */
    join(user: username) {
        this.members.add(user)
        this.onlineList.add(user)
    }

    /**
     * 用户离开聊天室
     * @param username 用户名
     */
    leave(user: username) {
        this.members.delete(user)
        this.onlineList.delete(user)
    }

    /**
     * 获取当前在线人数
     */
    getOnlineCounter(): number {
        return this.onlineList.size
    }

    /**
     * 获取当前在线列表
     */
    getOnlineList(): string[] {
        return Array.from(this.onlineList)
    }

    /**
     * 获取该聊天室成员
     */
    getMemebers(): string[] {
        return Array.from(this.members)
    }

    /**
     * 获取当前聊天室名称
     */
    getName(): string {
        return this.roomName
    }

    /**
     * 获取当前聊天室Id
     */
    getId(): number {
        return this.id
    }

    /**
     * 获取房间名
     */
    getNameEvent() {
        return 'room' + this.getId()
    }

    /**
     * 缓存消息
     * @param msg 消息
     */
    async cacheMessage(msg: message) {
        await this.messageCounter.incrby()
        this.messageList.push(msg)
    }

    /**
     * 房间内发送消息
     * @param msg 消息
     */
    async sendMessage(msg: message) {
        io.to(this.getNameEvent()).emit(socketEvents.newMsg, msg)
    }
}