import * as Koa from 'koa';
import * as socket from 'socket.io';
import { mysqlFactory } from '../models/mysqlModel';

const userTable = mysqlFactory<Table.user>({
    table: 'user'
})

/**
 * 注册一个账号
 */
export async function register(ctx: Koa.Context) {
    const req: routeParams.register.request = ctx.request.body
    let resData: routeParams.register.response = {
        code: AppCode.done,
        msg: AppMsg.registerSuccess,
        data: {
            isSuccess: true
        }
    }
    const user = await userTable.get({username: req.username}, ['username'])
    console.log(user)
    if (user.length === 0) {
        await userTable.insert({username: req.username, password: req.password})
    } else {
        resData.data.isSuccess = false
        resData.msg = AppMsg.userExist
    }
    ctx.body = resData
    return
}

/**
 * 登录
 */
export async function login(req:any, socket: socket.Server) {
    console.log(req)
    console.log(socket)
}