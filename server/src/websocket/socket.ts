import { join, leave, sendMsg } from '../controller/chat';
import { login } from '../controller/index';
import * as socket from 'socket.io'
import { roomManager, publicRoom } from '../app';
import { socketPrivateSend, socketBroadcast } from '../util/socket';
import { chatterManager, Chatter } from '../models/chatter';

export function listenSocket(io: socket.Server) {
    /**
     * 连接后
     */
    io.on('connection', (socket: socket.Socket) => {
        /**
         * 用户登录
         */
        socket.on(socketEvents.login, async (req: routeParams.login.request) => {
            const chatter = chatterManager.createChatter(req.username, socket.id)
            const retData = await login(req)
            await socketPrivateSend<routeParams.login.response>(io, socketEvents.login, socket.id, retData)
            if (retData.code === AppCode.done) { 
                socket.join(publicRoom.getNameEvent())
                // 重新登录后加入所有聊天室
                const roomIds = await chatter.getRooms()
                for (const id of roomIds) {
                    socket.join('room' + id) 
                }
                socket.broadcast.to(publicRoom.getNameEvent()).emit(socketEvents.otherLogin, {
                    username: req.username,
                    isOnline: true,
                    img: chatterManager.getChatter(req.username).getImg()
                }) // 向所有人发送登录的消息
            }
        })

        /**
         * 用户加入聊天室
         */
        socket.on(socketEvents.join, async (req: routeParams.join.request) =>{
            const room = roomManager.getRoom(req.roomId)
            socket.join(room.getNameEvent())
            const retData = await join(req)
            await socketPrivateSend<routeParams.join.response>(io, socketEvents.join, socket.id, retData)
            socket.broadcast.to(room.getNameEvent()).emit(socketEvents.otherJoin, {
                username: req.user,
                roomId: req.roomId
            })  // 向所有人发送加入的消息
        })

        /**
         * 用户离开聊天室
         */
        socket.on(socketEvents.leave, async (req: routeParams.leave.request) =>{
            const room = roomManager.getRoom(req.roomId)
            socket.leave(room.getNameEvent())
            const retData = await leave(req)
            await socketPrivateSend<routeParams.leave.response>(io, socketEvents.leave, socket.id, retData)
            socket.broadcast.to(room.getNameEvent()).emit(socketEvents.otherLeave, {
                username: req.user,
                roomId: req.roomId
            })  // 向所有人发送离开的消息
        })

        /**
         * 用户阅读某条信息
         */
        socket.on(socketEvents.readMsg, async (req: routeParams.readMsg.request) => {
            Chatter.readAllMsgs(req.name, req.roomId)
            await socketPrivateSend<routeParams.readMsg.response>(io, socketEvents.readMsg, socket.id, {
                code: AppCode.done,
                data: null
            })
        })

        /**
         * 创建群聊
         */
        socket.on(socketEvents.createGroup, async (req: routeParams.createGroup.request) => {
            // 创建房间后 每个人都会加入房间
            const room = await roomManager.createRoom(req.users),
                onlineMembers = await room.getOnlineList()
            socket.join(room.getNameEvent())
            
            let members = []

            for (const user of req.users) {
                const chatter = chatterManager.getChatter(user)
                await chatter.joinRoom(room.getId())
                if (user === req.from) {
                    members.push({
                        name: user,
                        isOnline: true,
                        img: chatterManager.getChatter(user).getImg()
                    })
                } else {
                    members.push({
                        name: user,
                        isOnline: onlineMembers.includes(user) ? true : false,
                        img: chatterManager.getChatter(user).getImg()
                    })
                }
                
            }
            await socketPrivateSend<routeParams.createGroup.response>(io, socketEvents.createGroup, socket.id, {
                code: AppCode.done,
                data: {
                    roomId: room.getId(),
                    roomName: room.getName(),
                    from: req.from,
                    to: req.to,
                    members,
                }
            })
        })

        /**
         * 创建房间后回发送邀请
         */
        socket.on(socketEvents.sendInvite, async (req: routeParams.sendInvite.request) => {
            let membersResult: {
                name: username,
                img: string,
                isOnline: boolean
            }[] = []
            const room = roomManager.getRoom(req.roomId)
            const members = await room.getMemebers(),
                onlineList = await room.getOnlineList()

            for (const name of members) {
                const chatter = chatterManager.getChatter(name)
                membersResult.push({
                    name: name,
                    img: chatter.getImg(),
                    isOnline: onlineList.includes(name)
                })
            } 
            await socketBroadcast<routeParams.newInvite.response>(socket, socketEvents.newInvite, {
                code: AppCode.done,
                data: {
                    invite: {
                        from: req.from,
                        roomId: req.roomId,
                        to: req.to
                    },
                    roomName: room.getName(),
                    members: membersResult
                }
            })
        })

        /**
         * 发送消息
         */
        socket.on(socketEvents.sendMsg, async (req: routeParams.sendMsg.request) => {
            console.log('接收到了消息！', req)
            /**
             * to某个人 私聊
             */
            // if (req.message.to !== chatConst.messageToAll) {
            //     const users = [req.message.from, req.message.to]
            //     let roomId = roomManager.getPrivateRoomId(users)
            //     /**
            //      * 如果没有私聊房间则先发出私聊请求
            //      */
            //     if (!roomId) {
            //         const newRoom = await roomManager.createRoom(users),
            //             fromUser = chatterManager.getChatter(req.message.from)
            //         socket.join(newRoom.getNameEvent())
            //         fromUser.joinRoom(newRoom.getId())

            //         /**
            //          * 发送邀请
            //          */
            //         await socketBroadcast<routeParams.newInvite.response>(socket, socketEvents.newInvite, {
            //             code: AppCode.done,
            //             data: {
            //                 invite: {
            //                     roomId: newRoom.getId(),
            //                     from: req.message.from,
            //                     to: req.message.to
            //                 }
            //             }
            //         })
            //     } 
            //     // else {
            //     //     /**
            //     //      * 有房间的话直接发送消息
            //     //      */
            //     //     const retData = await sendMsg(req)
            //     //     await socketPrivateSend<routeParams.sendMsg.response>(io, socketEvents.sendMsg, req.message.from, retData)
            //     // }
            // } 
            // else {
            //     // to所有人 群聊
            //     // 直接向聊天室广播
            //     const retData = await sendMsg(req)
            //     await socketPrivateSend<routeParams.sendMsg.response>(io, socketEvents.sendMsg, req.message.from, retData)
            // }  
            const retData = await sendMsg(req)
            await socketPrivateSend<routeParams.sendMsg.response>(io, socketEvents.sendMsg, socket.id, retData)       
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
                // await chatterManager.delChatter(name)
                console.log(`logou【${name}】下线了`)
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
                // await chatterManager.delChatter(name)
                console.log(`【${name}】下线了`)
            }
        })
    })
}
