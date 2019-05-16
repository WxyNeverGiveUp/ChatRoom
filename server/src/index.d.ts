/**
 * 全局声明文件
 */
declare const enum SwitchValue {
    OFF,
    ON
}

declare const enum Env {
    TEST = 'test',
    ONLINE = 'online',
    LOCAL = 'local'
}

declare namespace Config {
    /**
     * mysql配置项
     */
    type Mysql = {
        host: string,
        port: number,
        db: string,
        user: string,
        password: string,
        max: number,
        min: number,
        timeout: number,
        log: SwitchValue
    }
    
    /**
      * Redis配置项
      */
     type Redis = {
        host: string,
        port: number,
        max: number,
        min: number,
        timeout: number,
        log: SwitchValue,
        expire: number,
        turnOn: SwitchValue,
        password: string
    }

    /***
     * 服务配置项，包含主要环境变量
     */
    type Server = {
        ip: string,
        port: number,
        machine_id: number,
        debug: SwitchValue,
        log_path: string,
        env: string,
        secret: string,
        mount: string,
    }

    /**
     * 配置项
     */
    type Options = {
        server: Server,
        redis: Redis,
        mysql: Mysql
    }
}

declare namespace mysqlTable {
    type message = {
        name: string
    }
}

declare const enum AppCode {
    done = 0,
    error = 1, // 程序异常
    userExist = 1001, // 用户存在
    loginError = 1002, // 用户名不存在或密码错误
    roomNotExist = 1003, // 该房间不存在
    activityNotExist = 1004, // 该房间不存在
    adminNotExist = 1005, // 该管理员不存在
    adminUncheck = 1006, // 未审核
}

declare const enum AppMsg {
    userExist = '用户名已经存在，请更换用户名',
    loginError = '用户名不存在或密码错误',
    roomNotExist = '该房间不存在',
    registerSuccess = '注册成功',
    activityNotExist = '该活动不存在',
    adminNotExist = '该管理员不存在',
    adminUncheck = '管理员申请正在审核中，请勿重复申请'
}

interface baseResponse {
    code: AppCode,
    msg?: string
}

declare namespace routeParams {
    /**
     * 注册信息
     */
    namespace register {
        interface request {
            username: string,
            password: string,
            level: number
        }
        interface response extends baseResponse {
            data: null
        }
    }

    /**
     * 获取当前用户
     */
    namespace getMembers {
        interface request {
            roomId: number
        }
        interface response extends baseResponse {
            data: {
                members: username[],
                onlineList: username[]
            }
        }
    }

    /**
     * 登录
     */
    namespace login {
        interface request {
            username: username,
            password: string,
            socketId: string
        }
        interface response extends baseResponse {
            data: {
                username: username,
                level: number,
                img: string,
                rooms: {
                    roomId: number,
                    roomName: string,
                    hasNewMsg: boolean,
                    members: {
                        isOnline: boolean,
                        name: username,
                        img: string
                    }[],
                    msgs: message[]
                }[]
            }
        }
    }

    /**
     * 加入某个房间
     */
    namespace join {
        interface request {
            roomId: number,
            user: username
        }
        interface response extends baseResponse {
            data: null
        }
    }

    /**
     * 离开房间
     */
    namespace leave {
        type request = join.request
        interface response extends baseResponse {
            data: {
                username: username,
                roomId: number               
            }
        }
    }

    /**
     * 发送消息
     */
    namespace sendMsg {
        interface request {
            roomId: number,
            message: message
        }

        interface response extends baseResponse {
            data: {
                msg: message
            }
        } 
    }

    /**
     * 阅读信息
     */
    namespace readMsg {
        interface request {
            roomId: number,
            name: username
        }

        interface response extends baseResponse {
            data: null
        }
    }

    /**
     * 创建群组
     */
    namespace createGroup {
        interface request {
            from: username,
            to: username[],
            users: username[]
        }

        interface response extends baseResponse {
            data: {
                roomId: number,
                roomName: string,
                from: username,
                to: username[],
                members: {
                    name: username,
                    img: string,
                    isOnline: boolean
                }[]
            }
        } 
    }


    /**
     * 新消息
     */
    namespace newMsg {
        interface request {
            roomId: number,
            message: message
        }

        interface response extends baseResponse {
            data: null
        } 
    }

    /**
     * 发送群聊邀请
     */
    namespace sendInvite {
        type request = invite

        interface response extends baseResponse {
            data: {
                invite: invite
            }
        } 
    }

    /**
     * 新邀请
     */
    namespace newInvite {
        interface request {
        }

        interface response extends baseResponse {
            data: {
                invite: invite,
                roomName: string,
                members: {
                    name: username,
                    img: string,
                    isOnline: boolean
                }[]
            }
        } 
    }

    /**
     * 退出登录
     */
    namespace logout {
        interface request {
            socketId: string
        }

        interface response extends baseResponse {
            data: null
        }
    }

    /**
     * 获取活动咨询
     */
    namespace getActivities {
        interface request {}

        interface response extends baseResponse {
            data: {
                list: {
                    id: number, 
                    title: string,
                    createTime: timestamp, 
                    endTime: timestamp, 
                    beginTime: timestamp
                }[]
            }
        }
    }

    /**
     * 增添活动
     */
    namespace addActivitiy {
        interface request {
            title: string, // 文章标题
            content: string, // 文章内容
            author: string, // 作者
            beginTime: timestamp, // 开始时间
            endTime: timestamp, // 结束时间
            hostUnit: string, // 举办单位
            joiners: username[]
        }

        interface response extends baseResponse {
            data: null
        }
    }

    /**
     * 删除活动
     */
    namespace delActivitiy {
        interface request {
            id: number
        }

        interface response extends baseResponse {
            data: null
        }
    }

    /**
     * 获取详情
     */
    namespace getActivityDetail {
        interface request {
            id: number
        }

        interface response extends baseResponse {
            data: {
                activity: {
                    id: number,
                    title: string,
                    content: string,
                    author: string,
                    createTime: timestamp,
                    beginTime: timestamp,
                    endTime: timestamp
                }
            }
        }
    }

    /**
     * 获取活动报名情况
     */
    namespace getActivityMembers {
        interface request {
            id: number
        }

        interface response extends baseResponse {
            data: {
                list: username[]
            }
        }
    }

    /**
     * 加入活动
     */
    namespace joinActivity {
        interface request {
            id: number,
            username: username
        }

        interface response extends baseResponse {
            data: null
        }
    }

    /**
     * 获取所有管理员
     */
    namespace getAdmins {
        interface request {}
        interface response extends baseResponse {
            data: {
                list: {
                    realname: string, 
                    academy: string, 
                    club: string, 
                    studynumber: number, 
                    position: string, 
                    username: username, 
                    isPass: number
                }[]
            }
        }
    }

    /**
     * 添加管理员申请
     */
    namespace addAdmin {
        interface request {
            realname: string, 
            academy: string, 
            club: string, 
            studynumber: number, 
            position: string, 
            username: string
        }
        interface response extends baseResponse {
            data: {
            }
        }
    }

    /**
     * 删除管理员
     */
    namespace delAdmin {
        interface request {
            username: username
        }
        interface response extends baseResponse {
            data: {
            }
        }
    }

    /**
     * 审核管理员
     */
    namespace checkAdmin {
        interface request {
            username: username,
            isPass: boolean
        }
        interface response extends baseResponse {
            data: {
                username: username,
                isPass: boolean
            }
        }
    }

    /**
     * 获取管理员状态
     */
    namespace getAdminStatus {
        interface request {
            username: username
        }
        interface response extends baseResponse {
            data: {
                status: number
            }
        }
    }
}

declare namespace Table {
    interface user {
        id?: number, // 自动填充id
        username: string,
        password: string,
        level: number
    }
    interface activity {
        id?: number, // 自动填充id
        title: string, // 文章标题
        content: string, // 文章内容
        author: string, // 作者
        create_time: Date, // 发布时间
        begin_time: Date, // 开始时间
        end_time: Date, // 结束时间
        host_unit: string, // 举办单位
    }
    interface admin {
        id?: number, // admin自增
        realname: string, // 真实姓名
        academy: string, // 学院
        club: string, // 社团
        studynumber: number, // 学号
        position: string // 职位
        username: string, // 用户名
        is_pass: number // 审核状态
    }
}

declare type username = string

declare const enum chatConst {
    messageToAll = '*All',
}

declare const enum messageType {
    text = 1, // 纯文字 存储在redis中
    picture = 2, // 纯图片 存储在磁盘中
    textAndPicture = 3 // 混合 文字+图片，分开存储最后合并到一起
}

declare type timestamp = number

declare type message = {
    roomId?: number, // 该消息是在哪个房间中
    id?: number, // 消息id
    date: timestamp, // 时间戳
    type: messageType
    from: username,
    to: chatConst.messageToAll | username,
    content: string,
    url?: string[] // 聊天图片的url
}

/**
 * 群聊邀请
 */
declare type invite = {
    roomId: number,
    from: username,
    to: username[]
}

declare const enum userLevel {
    visitor = 0, // 普通社团成员
    admin = 1, // 社团管理员
    spuerAdmin = 2 // 超级管理员
}

declare const enum adminStatus {
    unapply = -1, // 未申请
    uncheck = 0, // 尚未审核
    fail = 1, // 审核不通过
    pass = 2, // 审核通过
}

/**
 * 缓存数据键名
 */
declare const enum cacheKey {
    k_roomId = 'k_roomId_', // 聊天室counter
    h_username_room_msg = 'h_username_room_msg_', // 用户消息
    h_username_history_msg = 'h_username_history_msg_', // 用户历是消息
    h_id_roomName = 'h_id_roomName_', // 聊天室名对应的id号
    s_username_roomId = 's_username_roomId_', // 用户曾加入过的聊天室
    s_roomId_onlineList = 's_roomId_onlineList_', // 某房间在线用户
    s_roomId_members = 's_roomId_memberst_', // 某房间全部用户
    k_room_messageCounter = 'k_room_messageCounter_', // 聊天室消息记录
    l_room_msg = 'l_room_msg_', // 聊天室消息队列
    s_activity_members_id = 's_activity_members_id_', // 活动报名
}

/**
 * websocket事件名
 */
declare const enum socketEvents {
    login = 'login', // 登录
    otherLogin = 'otherLogin', // 其他用户登录
    join = 'join', // 加入某房间
    leave = 'leave', // 离开某个房间
    otherLeave = 'otherLeave', // 其他用户离开
    logout = 'logout', // 主动断线
    otherLogout = 'otherLogout', // 离线
    sendMsg = 'sendMsg', // 发送消息的回包
    newMsg = 'newMsg', // 发现新消息的回包
    sendInvite = 'sendInvite', // 发送邀请
    newInvite = 'newInvite', // 发生新邀请事件
    sendNotice = 'sendNotice', // 发送一条新公告
    readMsg = 'readMsg', // 阅读一条信息
    createGroup = 'createGroup', // 创建群组
    otherJoin = 'otherJoin', // 加入
    adminCheck = 'adminCheck', // 管理员审核
    newCheck = 'newCheck', // 审核通知
}