import * as Koa from 'koa'

export async function logger(ctx: Koa.Context, next: Function) {
    ctx.set('Access-Control-Allow-Origin', '*') // 允许跨域
    ctx.response.status = 200
    const start = new Date().getTime()
    if (!ctx.query.data) {
        ctx.query.data = {}
    } else {
        try {
            console.log(ctx.query.data)
            ctx.query.data = JSON.parse(ctx.query.data)
        } catch(e) {
            console.error('数据格式错误！')
            ctx.body = {
                code: AppCode.done
            }
        }
    }
    try {
        await next()
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: AppCode.error
        }
    }
    const ms = new Date().getTime() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
}
