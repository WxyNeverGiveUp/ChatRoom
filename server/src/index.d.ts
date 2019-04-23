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
    error = 1 // 发生异常
}

declare const enum AppMsg {
    userExist = '用户名已经存在，请更换用户名',
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
            password: string
        }
        interface response extends baseResponse{
            data: {
                isSuccess: boolean
            }
        }
    }
}

declare namespace Table {
    interface user {
        uid?: number, // 自动填充uid
        username: string,
        password: string
    }
}