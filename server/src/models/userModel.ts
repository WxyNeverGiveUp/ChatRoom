import { mysqlFactory } from './mysqlModel';

export const userTable = mysqlFactory<Table.user>({
    table: 'user'
})


export class UserModel {
    constructor() {}

    /**
     * 添加用户
     * @param username 用户名
     * @param password 密码
     * @param level 等级权限
     */
    async addUser(username: username, password: string, level: userLevel) {
        await userTable.insert({
            username,
            password,
            level
        })
    }

    /**
     * 查询用户
     * @param username 用户名
     * @return [Table.user||null] 用户信息或者是null
     */
    async getUserInfo(username: username): Promise<Table.user> {
        let userInfo = await userTable.get({username}, ['password','level'])
        if (userInfo.length === 0) {
            return null
        } else {
            return {
                username,
                password: userInfo[0].password,
                level: userInfo[0].level
            }
        }
    }

    /**
     * 修改用户等级
     * @param username 用户名
     * @param level 用户等级
     */
    async updateLevel(username: username, level: adminStatus) {
        let userInfo = await this.getUserInfo(username)
        if (userInfo) {
            await userTable.update({level}, {username})
            return true
        } else {
            return false
        }
    }

    // /**
    //  * 修改昵称
    //  * @param username 用户名
    //  * @param nickname 昵称
    //  * @returns [boolean] 是否修改成功
    //  */
    // async updateNickname(username: username, nickname: string) {
    //     let nameInfo = await userTable.get({nickname}, ['password']),
    //         userInfo = await this.getUserInfo(username)
        
    //     if ((nameInfo.length === 0) && userInfo) {
    //         await userTable.update({nickname}, {username})
    //         return true
    //     } else {
    //         return false
    //     }
    // }
}


export const userModel = new UserModel()