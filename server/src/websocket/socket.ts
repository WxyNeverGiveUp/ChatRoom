import * as socket from 'socket.io'
import * as http from 'http'
import { login } from '../controller';

export function listenSocket(server: http.Server) {
    let io = socket.listen(server)

    /**
     * 连接后
     */
    io.on('connection', (socket: socket.Server) => {
        socket.on('login', async (req: any) => {
            console.log('有人登陆了哦')
            await login(req, socket)
        })
    })
}