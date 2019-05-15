import * as Koa from 'koa';
import { adminModel } from '../models/adminModel';

/**
 * 查看全部管理员
 * http请求
 */
export async function getAdmins(ctx: Koa.Context) {
    let resData: routeParams.getAdmins.response = {
        code: AppCode.done,
        data: {
            list: []
        }
    }

    let result = await adminModel.getAll()
    resData.data.list = result
    ctx.body = resData
    return
}

/**
 * 添加管理员
 * http请求
 */
export async function addAdmin(ctx: Koa.Context) {
    console.log('请求来了吗')
    const req: routeParams.addAdmin.request = ctx.request.body
    let resData: routeParams.addActivitiy.response = {
        code: AppCode.done,
        data: null
    }
    await adminModel.add(req.realname, req.academy, req.club, Number(req.studynumber), req.position, req.username)
    ctx.body = resData
    return
}

/**
 * 删除某个管理员
 * http请求
 */
export async function delAdmin(ctx: Koa.Context) {
    const req: routeParams.delActivitiy.request = ctx.request.body
    let resData: routeParams.delActivitiy.response = {
        code: AppCode.done,
        data: null
    }
    ctx.body = resData
    return resData
}
