import * as Koa from 'koa';
import { adminModel } from '../models/adminModel';

/**
 * 查看全部提交的管理员申请
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
    const req: routeParams.addAdmin.request = ctx.request.body
    let resData: routeParams.addActivitiy.response = {
        code: AppCode.done,
        data: null
    }
    const result = await adminModel.get(req.username)
    if (!result) {
        await adminModel.add(req.realname, req.academy, req.club, Number(req.studynumber), req.position, req.username)
    } else {
        if (result.isPass === adminStatus.uncheck) { // 已申请，待审核
            resData.code = AppCode.adminUncheck
            resData.msg = AppMsg.adminUncheck 
        } else { // 已申请，已经拒绝，重新申请
            await adminModel.update(req.realname, req.academy, req.club, Number(req.studynumber), req.position, req.username)
        }
    }
    ctx.body = resData
    return
}

/**
 * 查看单个申请的审核状态
 * http请求
 */
export async function getStatus(ctx: Koa.Context) {
    const req: routeParams.getAdminStatus.request = ctx.request.body
    let resData: routeParams.getAdminStatus.response = {
        code: AppCode.done,
        data: {
            status: adminStatus.unapply // 默认未申请
        }
    }
    const result = await adminModel.get(req.username)
    if (result) {
        resData.data.status = result.isPass
    }
    ctx.body = resData
    return
}
