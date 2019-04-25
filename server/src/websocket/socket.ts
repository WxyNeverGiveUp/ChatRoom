import * as socket from 'socket.io'
import { login } from '../controller';
import { server } from '../app';

export let io = socket.listen(server)

export function listenSocket() {
    io = socket.listen(server)
    /**
     * 连接后
     */
    io.on('connection', (socket: socket.Server) => {
        socket.on('login', async (req: routeParams.login.request) => {
            console.log('有人登陆了哦')
            await login(req, socket)
        })
    })
}