export function socketListen(socket, events, cb) {
    socket.on(events, () => {
        cb && cb()
    })
}