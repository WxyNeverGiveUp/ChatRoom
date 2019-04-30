import { login, join, leave, sendMsg } from '../controller/index';
import * as socket from 'socket.io'
import { roomManager, publicRoom } from '../app';
import { socketPrivateSend, socketBroadcast } from '../util/socket';

export function listenSocket(io: socket.Server) {
    /**
     * 连接后
     */
    io.on('connection', (socket: socket.Socket) => {
        /**
         * 用户登录
         */
        socket.on(socketEvents.login, async (req: routeParams.login.request) => {
            const retData = await login(req)
            await socketPrivateSend<routeParams.login.response>(io, socketEvents.login, socket.id, retData)
            if (retData.code === AppCode.done) { // 登录成功加入public聊天室
                publicRoom.join(req.username)
                socket.join(publicRoom.getNameEvent())
            }
        })
        /**
         * 用户加入聊天室
         */
        socket.on(socketEvents.join, async (req: routeParams.join.request) =>{
            const room = roomManager.getRoom(req.roomId)
            socket.join(room.getNameEvent())
            const retData = await join(req)
            await socketPrivateSend<routeParams.join.response>(io, socketEvents.join, req.username, retData)
        })

        /**
         * 用户离开聊天室
         */
        socket.on(socketEvents.leave, async (req: routeParams.join.request) =>{
            const room = roomManager.getRoom(req.roomId)
            socket.leave(room.getNameEvent())
            const retData = await leave(req)
            await socketPrivateSend<routeParams.leave.response>(io, socketEvents.leave, req.username, retData)
        })

        /**
         * 发送消息
         */
        socket.on(socketEvents.sendMsg, async (req: routeParams.sendMsg.request) => {
            /**
             * 说不是面向所有人则代表是明时私聊
             */
            if (req.message.to !== chatConst.messageToAll) {
                const users = [req.message.from, req.message.to]
                let roomId = roomManager.getRoomId(users)
                /**
                 * 如果没有私聊房间则先发出私聊请求
                 */
                if (!roomId) {
                    const newRoom = await roomManager.createRoom(users)
                    socket.join(newRoom.getNameEvent())
                    newRoom.join(req.message.from)
                    /**
                     * 发送邀请
                     */
                    await socketBroadcast<routeParams.newInvite.response>(socket, socketEvents.newInvite, {
                        code: AppCode.done,
                        data: {
                            invite: {
                                roomId: newRoom.getId(),
                                from: req.message.from,
                                to: req.message.to
                            }
                        }
                    })
                } else {
                    /**
                     * 有房间的话直接发送消息
                     */
                    const room = roomManager.getRoom(roomId)
                    await room.sendMessage(req.message)
                }
            }
            const retData = await sendMsg(req)
            await socketPrivateSend<routeParams.sendMsg.response>(io, socketEvents.sendMsg, req.message.from, retData)
        })

        /**
         * 接受邀请
         */
        socket.on(socketEvents.receiveInvite, async (req: routeParams.receiveInvite.request) => {
            const room = roomManager.getRoom(Number(req.roomId))
            socket.join(room.getNameEvent())
            room.join(req.user)
        })

        /**
         * 断线 事件监听
         */
        socket.on('disconnect', () =>{
            io.sockets.emit('leave', {})
            console.log(socket.id, '离开了')
        })
    })
}
