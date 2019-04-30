import * as Koa from 'koa';
import { userModel } from '../models/userModel';
import { publicRoom } from '../app';
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
 * 登录
 * 建立websocket连接
 */
export async function login(req: routeParams.login.request) {
    const userInfo = await userModel.getUserInfo(req.username)
    let retdata: routeParams.login.response = {
        code: AppCode.done,
        data: {
            username: req.username
        }
    }
    if (!userInfo || userInfo.password !== req.password + '') {
        retdata.code = AppCode.loginError
    } else {
        console.log(`【${req.username}】登陆了`)
        // 创建一个聊天者实例
        chatterManager.createChatter(req.username, req.socketId)
        // 默认加入公共聊天室
        publicRoom.sendMessage({
            id: 1,
            content: '公共聊天室消息',
            type: messageType.text,
            from: req.username,
            roomId: 0,
            to: chatConst.messageToAll
        })
    }
    return retdata
}

/**
 * 进入房间
 */
export async function join(req: routeParams.join.request) {
    let retData: routeParams.join.response = {
        code: AppCode.done,
        data: null
    }
    publicRoom.join(req.username)
    console.log(`【${req.username}】加入房间：【${req.roomId}】`)
    console.log(`当前房间用户有:${publicRoom.getMemebers().join(',')}`)
    return retData
}

/**
 * 离开房间
 */
export async function leave(req: routeParams.leave.request){
    let retData: routeParams.leave.response = {
        code: AppCode.done,
        data: null
    }
    publicRoom.leave(req.username)
    console.log(`【${req.username}】离开房间：【${req.roomId}】`)
    console.log(`当前房间用户有:${publicRoom.getMemebers().join(',')}`)
    return retData
}

/**
 * 发送消息
 */
export async function sendMsg(req: routeParams.sendMsg.request){
    let retData: routeParams.sendMsg.response = {
        code: AppCode.done,
        data: null
    }
    await publicRoom.sendMessage(req.message)
    console.log(`【${req.message.from}】发送消息：【${req.message.content}】`)
    console.log(`当前房间用户有:${publicRoom.getMemebers().join(',')}`)
    return retData
}

/**
 * 退出
 */
export async function logout(req: routeParams.logout.request) {
    let retData: routeParams.logout.response = {
        code: AppCode.done,
        data: null
    }
    await chatterManager.delChatter(req.socketId)
    return retData
}

