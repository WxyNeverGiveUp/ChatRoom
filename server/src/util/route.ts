import * as path from 'path'
import * as Router from "koa-router";
import * as Koa from 'koa'
import { readdirSync } from 'fs';

/**
 * 请求的方式
 */
type MethodType = 'get' | 'post'

enum RequestMethod {
    get,
    post
}

const ROUTER_PATH = path.resolve(__dirname, '..', 'routes')
const compose = require('koa-compose')

export class Route{
    cmd: string
    method: RequestMethod
    handlers: string[]
    constructor(opts: {cmd: string, handler: any[], method?: MethodType}){
        this.cmd = opts.cmd
        this.handlers = opts.handler
        this.method = RequestMethod[opts.method]
    }
}

export function makeRouter(app: Koa) {
    /**
     * 总路由
     */
    const router = new Router()
    let files = readdirSync(ROUTER_PATH)
    for (let i = 0; i < files.length; ++i) {
        let routes: Route[] = require(path.resolve(ROUTER_PATH, files[i]))
        /**
         * 子路由path
         */
        let subPath = "/" + files[i].replace(/.js/, '/')
        /**
         * 子路由
         */
        let subRouter = new Router()

        for (let j = 0; j < routes.length; ++j) {
            let cmd_path = ''

            if (routes[j].cmd) {
                cmd_path += routes[j].cmd
            }
            if (routes[j].handlers.length < 2) {
                if (routes[j].method === RequestMethod.get) {
                    subRouter.get(cmd_path, routes[j].handlers[0])
                } else {
                    subRouter.post(cmd_path, routes[j].handlers[0])
                }
            } else {
                if (routes[j].method === RequestMethod.get) {
                    subRouter.get(cmd_path, compose(routes[j].handlers))
                    subRouter.post(cmd_path, compose(routes[j].handlers))
                } else {
                    subRouter.post(cmd_path, compose(routes[j].handlers))
                }
            }
            if (!cmd_path) {
                console.log(`[baseMid:] ready`)
            } else {
                console.log(`[route]: [${subPath + cmd_path}] ready`)
            }
        }
        router.use(subPath, subRouter.routes(), subRouter.allowedMethods())
        app.use(subRouter.routes()).use(subRouter.allowedMethods())
    }
    /**
     * 挂在所有中间件
     */
    return app
}