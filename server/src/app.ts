import * as Koa from 'koa'
import * as http from 'http'
import * as socket from 'socket.io'
import { config } from "./config/config"
import { makeRouter } from './util/route'
import { logger } from './lib/baseMid'
import { listenSocket } from './websocket/socket';
import { RoomManager } from './models/chatRoom';
const koaBody = require('koa-body');
const cors = require('koa2-cors');

export const app = new Koa()
const serverConfig = config.server

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback());
export const io = socket.listen(server)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(serverConfig.port)
server.on('listening', onListening)

/**
 * use baseMid 处理同中间件 专门用来处理某些信息
 */
app.use(logger)

/**
 * 跨域
 */
app.use(cors())

/**
 * 静态文件
 */
app.use(require('koa-static')(__dirname + '/public'))

/**
 * 接受文件
 */
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}))


/**
 * use router
 */
makeRouter(app)

/**
 * 监听socket事件
 */
listenSocket(io)

/**
 * 创造聊天室实例
 */
export const roomManager = new RoomManager()
export const publicRoom = roomManager.createPublicRoom()

/**
 * Event listener for HTTP server "listening" event.
 */
  
function onListening() {
    console.log('chatroom server running:', serverConfig.ip + ':' + serverConfig.port)
}
