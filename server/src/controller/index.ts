import * as Koa from 'koa';
import { userModel } from '../models/userModel';
import { publicRoom, roomManager } from '../app';
import { chatterManager } from '../models/chatter';

/**
 * 注册一个账号
 * http请求
 */
export async function register(ctx: Koa.Context) {
    const req: routeParams.register.request = ctx.request.body
    let resData: routeParams.register.response = {
        code: AppCode.done,
        msg: AppMsg.registerSuccess,
        data: null
    }
    const user = userModel.getUserInfo(req.username)
    if (user) {
        await userModel.addUser(req.username, req.password, req.nickname, req.level)
    } else {
        resData.msg = AppMsg.userExist
        resData.code = AppCode.userExist
    }
    ctx.body = resData
    return
}

/**
 * 查看当前用户
 * http请求
 */
export async function getMembers(ctx: Koa.Context) {
    const req: routeParams.getMembers.request = ctx.query
    let retData: routeParams.getMembers.response = {
        code: AppCode.done,
        data: {
            members: [],
            onlineList: []
        }
    }
    const room = roomManager.getRoom(req.roomId)
    if (room) {
        retData.data.members = room.getMemebers()
        retData.data.onlineList = room.getOnlineList()
    } else {
        retData.msg = AppMsg.roomNotExist
        retData.code = AppCode.roomNotExist
    }
    ctx.body = retData
    return
}

/**
 * 登录
 * 建立websocket连接
 */
export async function login(req: routeParams.login.request) {
    const userInfo = await userModel.getUserInfo(req.username)
    let retdata: routeParams.login.response = {
        code: AppCode.done,
        data: {
            username: req.username,
            rooms: []
        }
    }
    if (!userInfo || userInfo.password !== req.password + '') {
        retdata.code = AppCode.loginError
    } else {
        console.log(`【${req.username}】登陆了`)
        // 创建一个聊天者实例
        const user = chatterManager.getChatter(req.username)
        await user.joinRoom(publicRoom.getId())

        // 默认加入公共聊天室
        const roomIds = await user.getRooms()
        if (roomIds.length > 0) {
            for (const roomId of roomIds) {
                const room = roomManager.getRoom(roomId)
                const msgs = await user.getUnreadMsg(roomId)
                if (room) {
                    retdata.data.rooms.push({
                        roomId: room.getId(),
                        members: room.getMemebers(),
                        msgs
                    })
                }
            }
        }
    }
    return retdata
}

