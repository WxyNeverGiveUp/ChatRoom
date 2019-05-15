import * as Koa from 'koa';
import { activityModel } from '../models/activityModel';

/**
 * 查看所有活动
 * http请求
 */
export async function getActivities(ctx: Koa.Context) {
    let resData: routeParams.getActivities.response = {
        code: AppCode.done,
        data: {
            list: []
        }
    }

    const result = await activityModel.getAll()
    resData.data.list = result
    ctx.body = resData
    return
}

/**
 * 添加活动
 * http请求
 */
export async function addActivity(ctx: Koa.Context) {
    const req: routeParams.addActivitiy.request = ctx.request.body
    let resData: routeParams.addActivitiy.response = {
        code: AppCode.done,
        data: null
    }
    console.log(req)
    await activityModel.add(req.title, req.content, req.author, Number(req.beginTime), Number(req.endTime))
    ctx.body = resData
    return
}

/**
 * 删除某个活动资讯
 * http请求
 */
export async function delActivity(ctx: Koa.Context) {
    const req: routeParams.delActivitiy.request = ctx.request.body
    let resData: routeParams.delActivitiy.response = {
        code: AppCode.done,
        data: null
    }
    await activityModel.del(Number(req.id))
    ctx.body = resData
    return resData
}

/**
 * 获取某个活动详情
 * http请求
 */
export async function getActivityDetail(ctx: Koa.Context) {
    const req: routeParams.getActivityDetail.request = ctx.request.body
    let resData: routeParams.getActivityDetail.response
    const result = await activityModel.getDetail(Number(req.id))
    if (result) {
        resData = {
            code: AppCode.done,
            data: {
                activity: result
            }
        }
    } else {
        resData = {
            code: AppCode.activityNotExist,
            msg: AppMsg.activityNotExist,
            data: {
                activity: null
            }
        }
    }
    
    ctx.body = resData
    return resData
}
