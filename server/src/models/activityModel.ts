import { mysqlFactory } from './mysqlModel';
import { SetFactory } from './redisModel';
import { config } from '../config/config';

export const activityTable = mysqlFactory<Table.activity>({
    table: 'activity'
})


export class ActivityModel {
    constructor() {}

    /**
     * 添加活动
     * @param title 标题
     * @param content 内容
     * @param author 作者
     * @param beginTime 开始时间 
     * @param endTime 结束时间
     * @param hostUnit 举办单位
     */
    async add(title: string, content: string, author: string, beginTime: timestamp, endTime: timestamp, hostUnit: string) {
        await activityTable.insert({
            title,
            content,
            author,
            create_time: new Date(),
            begin_time: new Date(beginTime),
            end_time: new Date(endTime),
            host_unit: hostUnit
        })
    }

    /**
     * 删除活动资讯
     * @param id 活动id
     */
    async del(id: number){
        await activityTable.del({
            id,
        })
    }

    /**
     * 获取活动详情
     * @param id 活动id
     * @return [Table.activity || null] 用户信息或者是null
     */
    async getDetail(id: number) {
        const result = await activityTable.get({
            id
        }, ['id', 'title', 'content', 'author', 'create_time', 'end_time', 'begin_time'])
        const activity = SetFactory<username>({
            pre: config.server.mount, 
            key: cacheKey.s_activity_members_id + id
        })
        let joiners = await activity.getAll()
        return {
            id: result[0].id,
            title: result[0].title,
            content: result[0].content,
            author: result[0].author,
            createTime: result[0].create_time.getTime(),
            beginTime: result[0].begin_time.getTime(),
            endTime: result[0].end_time.getTime(),
            hostUnit: result[0].host_unit,
            joiners
        }
    }

    /**
     * 查找活动所有
     */
    async getAll(): Promise<{id: number, title: string, createTime: timestamp, endTime: timestamp, beginTime: timestamp, hostUnit: string, joiners: username[]}[]> {
        const arr = await activityTable.get({}, ['id', 'title', 'create_time', 'end_time', 'begin_time', 'host_unit'])
        let result: {id: number, title: string, createTime: timestamp, endTime: timestamp, beginTime: timestamp, hostUnit: string, joiners: username[]}[] = []
        for (const item of arr) {
            const activity = SetFactory<username>({
                pre: config.server.mount, 
                key: cacheKey.s_activity_members_id + item.id
            })
            let joiners = await activity.getAll()
            result.push({
                id: item.id,
                title: item.title,
                createTime: item.create_time.getTime(),
                beginTime: item.begin_time.getTime(),
                endTime: item.end_time.getTime(),
                hostUnit: item.host_unit,
                joiners
            })
        }
        return result
    }

    /**
     * 加入活动
     * @param id 活动id
     * @param username 加入活动人
     */
    async join(id: number, username: username) {
        const activity = SetFactory<username>({
            pre: config.server.mount, 
            key: cacheKey.s_activity_members_id + id
        })
        await activity.add(username)
    }

    /**
     * 查看活动人数
     * @param id 活动id
     */
    async getMembers(id: number) {
        const activity = SetFactory<username>({
            pre: config.server.mount, 
            key: cacheKey.s_activity_members_id + id
        })
        let result = await activity.getAll()
        return result
    }
}


export const activityModel = new ActivityModel()