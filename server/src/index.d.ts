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
}

declare const enum AppMsg {
    userExist = '用户名已经存在，请更换用户名',
    loginError = '用户名不存在或密码错误',
    registerSuccess = '注册成功'
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
            nickname: string,
            level: number
        }
        interface response extends baseResponse {
            data: null
        }
    }

    /**
     * 登录
     */
    namespace login {
        interface request {
            username: string,
            password: string
        }
        interface response extends baseResponse {
            data: null
        }
    }
}

declare namespace Table {
    interface user {
        uid?: number, // 自动填充uid
        username: string,
        password: string,
        nickname: string,
        level: number
    }
}

declare type username = string
declare type all = 'all'

declare const enum messageType {
    text = 1, // 纯文字 存储在redis中
    picture = 2, // 纯图片 存储在磁盘中
    textAndPicture = 3 // 混合 文字+图片，分开存储最后合并到一起
}

type message = {
    id: number,
    type: messageType
    from: username,
    to: username | all,
    content: string,
    url?: string[]
}

/**
 * 缓存数据键名
 */
declare const enum cacheKey {
    k_roomId = 'k_roomId_', // 聊天室counter
    h_username_room_msg = 'h_username_room_msg', // 用户消息
    h_roomName_id = 'h_roomName_id_', // 聊天室名对应的id号
    s_username_roomId = 's_username_roomId_', // 用户曾加入过的聊天室
    k_room_messageCounter = 'k_room_messageCounter_', // 聊天室消息记录
    l_room_msg = 'l_room_msg_', // 聊天室消息队列
}