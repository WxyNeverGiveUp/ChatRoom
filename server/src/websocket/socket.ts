import { join, leave, sendMsg } from '../controller/chat';
import { login } from '../controller/index';
import * as socket from 'socket.io'
import { roomManager, publicRoom } from '../app';
import { socketPrivateSend, socketBroadcast } from '../util/socket';
import { chatterManager } from '../models/chatter';

export function listenSocket(io: socket.Server) {
    /**
     * 连接后
     */
    io.on('connection', (socket: socket.Socket) => {
        /**
         * 用户登录
         */
        socket.on(socketEvents.login, async (req: routeParams.login.request) => {
            chatterManager.createChatter(req.username, socket.id)
            const retData = await login(req)
            await socketPrivateSend<routeParams.login.response>(io, socketEvents.login, socket.id, retData)
            if (retData.code === AppCode.done) { 
                socket.join(publicRoom.getNameEvent())
            }
            socket.broadcast.to(publicRoom.getNameEvent()).emit(socketEvents.otherLogin, {
                username: req.username,
                isOnline: true,
                img: chatterManager.getChatter(req.username).getImg()
            }) // 向所有人发送登录的消息
        })

        /**
         * 用户加入聊天室
         */
        socket.on(socketEvents.join, async (req: routeParams.join.request) =>{
            const room = roomManager.getRoom(req.roomId)
            socket.join(room.getNameEvent())
            const retData = await join(req)
            await socketPrivateSend<routeParams.join.response>(io, socketEvents.join, req.user, retData)
        })

        /**
         * 用户离开聊天室
         */
        socket.on(socketEvents.leave, async (req: routeParams.leave.request) =>{
            const room = roomManager.getRoom(req.roomId)
            socket.leave(room.getNameEvent())
            const retData = await leave(req)
            await socketPrivateSend<routeParams.leave.response>(io, socketEvents.leave, req.user, retData)
            socket.broadcast.to(publicRoom.getNameEvent()).emit(socketEvents.otherLeave, {
                username: req.user
            }) // 向所有人发送登录的消息
        })

        /**
         * 发送消息
         */
        socket.on(socketEvents.sendMsg, async (req: routeParams.sendMsg.request) => {
            /**
             * to某个人 私聊
             */
            if (req.message.to !== chatConst.messageToAll) {
                const users = [req.message.from, req.message.to]
                let roomId = roomManager.getPrivateRoomId(users)
                /**
                 * 如果没有私聊房间则先发出私聊请求
                 */
                if (!roomId) {
                    const newRoom = await roomManager.createRoom(users),
                        fromUser = chatterManager.getChatter(req.message.from) 
                    socket.join(newRoom.getNameEvent())
                    fromUser.joinRoom(newRoom.getId())
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
                    const retData = await sendMsg(req)
                    await socketPrivateSend<routeParams.sendMsg.response>(io, socketEvents.sendMsg, req.message.from, retData)
                }
            } else {
                // to所有人 群聊
                // 直接向聊天室广播
                await sendMsg(req)
            }         
        })

        /**
         * 主动断线
         */
        socket.on(socketEvents.logout, async () => {
            const name = chatterManager.socket2name(socket.id)
            if (name) {
                socket.broadcast.to(publicRoom.getNameEvent()).emit(socketEvents.otherLogout, {
                    username: name,
                    isOnline: false,
                    img: chatterManager.getChatter(name).getImg()
                })
                await chatterManager.outlineRooms(name)
                await chatterManager.delChatter(name)
                console.log(`【${name}】下线了`)
            }
        })

        /**
         * 断线 事件监听
         */
        socket.on('disconnect', async () =>{
            const name = chatterManager.socket2name(socket.id)
            if (name) {
                socket.broadcast.to(publicRoom.getNameEvent()).emit(socketEvents.otherLogout, {
                    username: name,
                    isOnline: false,
                    img: chatterManager.getChatter(name).getImg()
                })
                await chatterManager.outlineRooms(name)
                await chatterManager.delChatter(name)
                console.log(`【${name}】下线了`)
            }
        })
    })
}
