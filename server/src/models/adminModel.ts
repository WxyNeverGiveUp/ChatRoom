import { mysqlFactory } from './mysqlModel';

export const adminTable = mysqlFactory<Table.admin>({
    table: 'admin'
})


export class AdminModel {
    constructor() {}

    /**
     * 添加管理员
     * @param realname 姓名
     * @param academy 学院
     * @param club 社团
     * @param studynumber 学号 
     * @param position 职位
     * @param username 用户名
     */
    async add(realname: string, academy: string, club: string, studynumber: number, position: string, username: string) {
        await adminTable.insert({
            realname,
            academy,
            club,
            studynumber,
            position,
            username,
            is_pass: adminStatus.uncheck
        })
    }

    /**
     * 删除admin申请
     * @param username 用户名
     */
    async del(username: username){
        await adminTable.del({
            username,
        })
    }

    /**
     * 审核装填
     * @param username 用户username
     * @return [Table.activity || null] 用户信息或者是null
     */
    async check(username: username, status: adminStatus) {
        await adminTable.update({
            is_pass: status
        }, { username })
        return
    }

    /**
     * 查找所有用户
     */
    async getAll(): Promise<{realname: string, academy: string, club: string, studynumber: number, position: string, username: username, isPass: number}[]> {
        const arr = await adminTable.get({}, ['realname', 'academy', 'club', 'studynumber', 'position', 'username', 'is_pass'])
        let result: {realname: string, academy: string, club: string, studynumber: number, position: string, username: username, isPass: number}[] = []
        for (const item of arr) {
            result.push({
                realname: item.realname,
                academy: item.academy,
                club: item.club,
                studynumber: item.studynumber,
                position: item.position,
                username: item.username,
                isPass: item.is_pass
            })
        }
        return result
    }
}


export const adminModel = new AdminModel()