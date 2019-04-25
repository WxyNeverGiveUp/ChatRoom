import { mysqlFactory } from './mysqlModel';

export const userTable = mysqlFactory<Table.user>({
    table: 'user'
})

const enum userLevel {
    visitor = 0, // 普通社团成员
    admin = 1, // 社团管理员
    spuerAdmin = 2 // 超级管理员
}

export class UserModel {
    constructor() {}

    /**
     * 添加用户
     * @param username 用户名
     * @param password 密码
     * @param nickname 昵称
     * @param level 等级权限
     */
    async addUser(username: username, password: string, nickname: string, level: userLevel.visitor) {
        await userTable.insert({
            username,
            password,
            nickname,
            level
        })
    }

    /**
     * 查询用户
     * @param username 用户名
     * @return [Table.user||null] 用户信息或者是null
     */
    async getUserInfo(username: username): Promise<Table.user> {
        let userInfo = await userTable.get({username}, ['password', 'nickname','level'])
        if (userInfo.length === 0) {
            return null
        } else {
            return {
                username,
                password: userInfo[0].password,
                nickname: userInfo[0].nickname,
                level: userInfo[0].level
            }
        }
    }

    /**
     * 修改昵称
     * @param username 用户名
     * @param nickname 昵称
     * @returns [boolean] 是否修改成功
     */
    async updateNickname(username: username, nickname: string) {
        let nameInfo = await userTable.get({nickname}, ['password']),
            userInfo = await this.getUserInfo(username)
        
        if ((nameInfo.length === 0) && userInfo) {
            await userTable.update({nickname}, {username})
            return true
        } else {
            return false
        }
    }
}


export const userModel = new UserModel()