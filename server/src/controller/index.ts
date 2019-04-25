import * as Koa from 'koa';
import * as socket from 'socket.io';
import { socketSend, socketEvents } from '../util/socket';
import { userModel } from '../models/userModel';

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
export async function login(req: routeParams.login.request, socket: socket.Server) {
    const userInfo = await userModel.getUserInfo(req.username)
    let retdata: routeParams.login.response = {
        code: AppCode.done,
        data: null
    }
    if (!userInfo || userInfo.password !== req.password + '') {
        retdata.code = AppCode.loginError
    }
    await socketSend<routeParams.login.response>(socket, socketEvents.login, retdata)
    return
}