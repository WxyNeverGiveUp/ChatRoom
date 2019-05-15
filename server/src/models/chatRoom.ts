import { roomName } from '../util/socket';
import { KeyValFactory, CacheKeyVal, CacheHash, HashFactory, CacheList, ListFactory, CacheSet, SetFactory } from './redisModel';
import { config } from '../config/config';
import { io } from '../app'
import { Chatter } from './chatter';

/**
 * 全部聊天室管理类
 */
export class RoomManager {
    private id: CacheKeyVal // 聊天室唯一ID
    private roomName: CacheHash<string> // 房间名字
    public rooms: Map<number, Room>
    // public privateRoomsIdMap: Map<string, number> // 私聊房间名字对应的roomId
    constructor() {
        this.id = KeyValFactory({
            pre: config.server.mount, 
            key: cacheKey.k_roomId
        })
        this.roomName = HashFactory<string>({
            pre: config.server.mount,
            key: cacheKey.h_id_roomName
        })
        this.rooms = new Map()
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
     * 新建一个房间
     * @param users 用户
     */
    async createRoom(users: username[]) {
        const id = await this.id.incrby(),
            name = this.getRoomName(users)
        console.log(`新建房间:${name}, id:${id}`)
        await this.roomName.setField(id + '', name)
        const room = new Room(name, id)
        this.rooms.set(id, room)
        return room
    }

    /**
     * 更新房间名称
     * @param roomId 房间的ID
     * @param newName 房间的名称
     */
    async updateRoomName(roomId: number, newName: string) {
        await this.roomName.setField(roomId + '', newName)
        const room = this.rooms.get(roomId)
        room.updateName(newName)
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
        return this.rooms.get(Number(roomId))
    }
}

/**
 * 单独一个聊天室
 */
class Room {
    private id: number // 唯一Id
    private roomName: string
    private onlineList: CacheSet<username>
    private members: CacheSet<username>
    private messageList: CacheList<message>
    private messageCounter: CacheKeyVal // 聊天室消息缓存
    constructor(roomName: string, id: number) {
        this.roomName = roomName
        this.id = id
        this.onlineList = SetFactory<username>({
            pre: config.server.mount, 
            key: cacheKey.s_roomId_onlineList + this.id
        })
        this.members = SetFactory<username>({
            pre: config.server.mount, 
            key: cacheKey.s_roomId_members + this.id
        })
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
    async online(user: username) {
        await this.onlineList.add(user)
        return
    }

    /**
     * 离线
     * @param user 用户名
     */
    async offline(user: username) {
        await this.onlineList.del([user])
        return
    }

    /**
     * 用户进入聊天室
     * @param username 用户名
     */
    async join(user: username) {
        await this.members.add(user)
        await this.onlineList.add(user)
    }

    /**
     * 用户离开聊天室
     * @param username 用户名
     */
    async leave(user: username) {
        await this.members.del([user])
        await this.onlineList.del([user])
    }

    /**
     * 获取当前在线人数
     */
    async getOnlineCounter(): Promise<number> {
        const online = await this.onlineList.getAll()
        return online.length
    }

    /**
     * 获取当前在线列表
     */
    async getOnlineList(): Promise<string[]> {
        const online = await this.onlineList.getAll()
        return online
    }

    /**
     * 获取该聊天室成员
     */
    async getMemebers(): Promise<string[]> {
        const members = await this.members.getAll()
        return members
    }

    /**
     * 获取当前聊天室名称
     */
    getName(): string {
        return this.roomName
    }

    /**
     * 更改聊天室名称
     * @param newName 房间的新名字
     */
    updateName(newName: string) {
        this.roomName = newName
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
     * 获取消息id
     */
    async getMsgId() {
        return await this.messageCounter.incrby()
    }

    /**
     * 缓存消息
     * @param msg 
     */
    async cacheMsg(msg: message) {
        this.messageList.push(msg)
    }

    /**
     * 房间内发送消息
     * @param msg 消息
     */
    async sendMessage(msg: message) {
        io.to(this.getNameEvent()).emit(socketEvents.newMsg, msg) // 向房间在线的人广播
        const members = await this.members.getAll()
        for (const member of members) {
            if (member !== msg.from) {
                await Chatter.addUnreadMsg(member, msg)
            } else {
                await Chatter.addMyMsgHistory(member, msg)
            }
        }
    }
}