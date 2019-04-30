import * as socket from 'socket.io'

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
    await socket.emit(event, data)
}

/**
 * 指定客户端回包
 */
export async function socketPrivateSend<T>(socket: socket.Server, event: socketEvents, socketId: string, data: T) {
    await socket.to(socketId).emit(event, data)
}

export async function socketBroadcast<T>(socket: socket.Socket, event: socketEvents, data: T) {
    await socket.broadcast.emit(event, data)
}