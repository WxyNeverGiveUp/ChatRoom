import * as socket from 'socket.io';
import { io } from '../websocket/socket';
import { roomName } from '../util/socket';

/**
 * 管理聊天室的类
 */
class Room {
    private roomName: string
    private onlineCounter: number
    private onlineList: string[]
    private socket: socket.Server
    private messageList: message[] // 该房间的消息队列
    constructor(roomName: string, socket: socket.Server) {
        this.roomName = roomName
        this.onlineCounter = 0
        this.onlineList = []
        this.socket = socket
    }

    /**
     * 用户进入聊天室
     * @param username 用户名
     */
    enter(username: string): boolean {
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
    leave(username: string): boolean {
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

    cacheMessage() {

    }

    // io.sockets.emit('msg', msg)
}

export const publicRoom = new Room(roomName.publicRoom, io) // 公共聊天室,私密聊天室需要实例化