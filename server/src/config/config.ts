function getConfig(): Config.Options {
    return {
        server: {
            "secret": '6a03578a1ad3984e918df7c920b6be5d',
            "ip": 'localhost',
            "port": 3000,
            "machine_id": 1,
            "env": "test",
            "log_path": 'D:/workspace/restaurant/server/dist/log',
            "mount": 'chatroom', //待修改
            "debug": SwitchValue.OFF
        },
        redis: {
            "host": "localhost",
            "port": 6379,
            "max": 10,
            "min": 1,
            "timeout": 30000,
            "log": SwitchValue.OFF,
            "expire": 86400,
            "turnOn": SwitchValue.ON,
            "password": ""
        },
        //mysql -h spider.formal.mm.db -Drestaurant_test -u root -ptimi@2016 -P25000
        mysql: {
            "host": "localhost",
            "port": 3306,
            "db": "db_chatroom",
            "user": "root",
            "password": "root",
            "max": 10,
            "min": 1,
            "timeout": 30000,
            "log": SwitchValue.ON
        }
    }
}

export const config = getConfig()