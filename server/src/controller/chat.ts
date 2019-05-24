import { roomManager } from '../app';
import { chatterManager } from '../models/chatter';
/**
 * 进入房间
 */
export async function join(req: routeParams.join.request) {
    let retData: routeParams.join.response = {
        code: AppCode.done,
        data: null
    }
    const room = roomManager.getRoom(Number(req.roomId)),
        chatter = chatterManager.getChatter(req.user)
    await chatter.joinRoom(room.getId())
    console.log(`【${req.user}】加入房间：【${req.roomId}】`)
    return retData
}

/**
 * 离开房间
 */
export async function leave(req: routeParams.leave.request){
    let retData: routeParams.leave.response = {
        code: AppCode.done,
        data: {
            roomId: req.roomId,
            username: req.user
        }
    }
    const room = roomManager.getRoom(Number(req.roomId)),
        chatter = chatterManager.getChatter(req.user)
    await chatter.leaveRoom(room.getId())
    console.log(`【${req.user}】离开房间：【${req.roomId}】`)
    return retData
}

/**
 * 发送消息
 */
export async function sendMsg(req: routeParams.sendMsg.request){
    let retData: routeParams.sendMsg.response = {
        code: AppCode.done,
        data: {
            msg: null
        }
    }
    const room = roomManager.getRoom(Number(req.message.roomId))
    const msg = req.message,
        msgId = await room.getMsgId()
        msg.id = msgId // 添加ID
        msg.date = new Date().getTime() // 添加时间戳
    await room.sendMessage(msg)
    retData.data.msg = msg
    console.log(`【${req.message.from}】发送消息：【${req.message.content}】`)
    return retData
}

/**
 * 退出登录
 */
export async function logout(req: routeParams.logout.request) {
    let retData: routeParams.logout.response = {
        code: AppCode.done,
        data: null
    }
    await chatterManager.delChatter(req.socketId)
    return retData
}

