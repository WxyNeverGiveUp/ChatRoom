import * as socket from 'socket.io'

/**
 * socket事件名
 */
export const enum socketEvents {
    login = 'login', // 登录
}

/**
 * 聊天室名称
 */
export const enum roomName {
    publicRoom = 'publicRoom', // 公共聊天室
}

/**
 * 封装socket发送请求的方法
 * @param socket 
 */
export async function socketSend<T>(socket: socket.Server, event: socketEvents, data: T) {
    socket.emit(event, data)
}