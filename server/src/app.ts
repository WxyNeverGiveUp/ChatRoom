import * as Koa from 'koa'
import * as http from 'http'
import * as bodyparser from "koa-bodyparser"
import * as socket from 'socket.io'
import { config } from "./config/config"
import { makeRouter } from './util/route'
import { logger } from './lib/baseMid'
import { listenSocket } from './websocket/socket';
import { RoomManager } from './models/chatRoom';

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
app.use(bodyparser())

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
