import * as Koa from 'koa';
import { userModel } from '../models/userModel';
import { publicRoom, roomManager } from '../app';
import { chatterManager } from '../models/chatter';
import * as fs from 'fs'
import * as path from 'path'

/**
 * 注册一个账号
 * http请求
 */
export async function register(ctx: Koa.Context) {
    const req: routeParams.register.request = ctx.request.body
    let resData: routeParams.register.response = {
        code: AppCode.done,
        msg: AppMsg.registerSuccess,
        data: null
    }
    const user = await userModel.getUserInfo(req.username)
    if (!user) {
        await userModel.addUser(req.username, req.password, req.nickname, req.level || userLevel.spuerAdmin)
    } else {
        resData.msg = AppMsg.userExist
        resData.code = AppCode.userExist
    }
    ctx.body = resData
    return
}

/**
 * 查看当前用户
 * http请求
 */
export async function getMembers(ctx: Koa.Context) {
    const req: routeParams.getMembers.request = ctx.query
    let retData: routeParams.getMembers.response = {
        code: AppCode.done,
        data: {
            members: [],
            onlineList: []
        }
    }
    const room = roomManager.getRoom(req.roomId)
    if (room) {
        retData.data.members = await room.getMemebers()
        retData.data.onlineList = await room.getOnlineList()
    } else {
        retData.msg = AppMsg.roomNotExist
        retData.code = AppCode.roomNotExist
    }
    ctx.body = retData
    return
}

export async function upload(ctx: Koa.Context) {
    const file = ctx.request.files.file
    const username = ctx.request.body.name,
        now = new Date().getTime()

    // 创建可读流
    const reader = fs.createReadStream(file.path)
    
    let filePath = path.join(__dirname, '../public/upload/') + `/${username}-${now}.png`

    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    // reader.pipe(upStream)

    const img = await new Promise( (resolve) => {
        let stream = reader.pipe(upStream);
        stream.on('finish', function () {
            resolve(`http://localhost:3000/upload/${username}-${now}.png`);
        })
    })
    return ctx.body = {
        code: AppCode.done,
        data: {
            img,
        }
    }
}

/**
 * 登录
 * 建立websocket连接
 */
export async function login(req: routeParams.login.request) {
    const userInfo = await userModel.getUserInfo(req.username)
    let retdata: routeParams.login.response = {
        code: AppCode.done,
        data: {
            username: req.username,
            img: chatterManager.getChatter(req.username).getImg(),
            level: 0,
            rooms: []
        }
    }
    if (!userInfo || userInfo.password !== req.password + '') {
        retdata.msg = AppMsg.loginError
        retdata.code = AppCode.loginError
    } else {
        console.log(`【${req.username}】登陆了`)
        // 创建一个聊天者实例
        const user = chatterManager.getChatter(req.username)
        await chatterManager.onlineRooms(req.username)
        await user.joinRoom(publicRoom.getId())

        // 默认加入公共聊天室
        const roomIds = await user.getRooms()
        if (roomIds.length > 0) {
            for (const roomId of roomIds) {
                const room = roomManager.getRoom(roomId)
                const msgs = await user.getUnreadMsg(roomId)
                if (room) {
                    let members = await room.getMemebers(),
                        onlineMembers = await room.getOnlineList()
                    let arr: {
                        name: username,
                        isOnline: boolean,
                        img: string
                    }[] = []
                    for (const member of members) {
                        if (chatterManager.getChatter(member)) {
                            arr.push({
                                name: member,
                                isOnline: onlineMembers.includes(member) ? true : false,
                                img: chatterManager.getChatter(member).getImg()
                            })
                        }
                    }
                    retdata.data.rooms.push({
                        roomId: room.getId(),
                        roomName: room.getName(),
                        hasNewMsg: msgs.length > 0,
                        members: arr,
                        msgs
                    })
                }
            }
        }
        retdata.data.level = userInfo.level
    }
    return retdata
}

