import { mysqlFactory } from './mysqlModel';

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
     */
    async add(title: string, content: string, author: string, beginTime: timestamp, endTime: timestamp) {
        await activityTable.insert({
            title,
            content,
            author,
            create_time: new Date(),
            begin_time: new Date(beginTime),
            end_time: new Date(endTime)
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
        
        return {
            id: result[0].id,
            title: result[0].title,
            content: result[0].content,
            author: result[0].author,
            createTime: result[0].create_time.getTime(),
            beginTime: result[0].begin_time.getTime(),
            endTime: result[0].end_time.getTime()
        }
    }

    /**
     * 查找活动所有
     */
    async getAll(): Promise<{id: number, title: string, createTime: timestamp, endTime: timestamp, beginTime: timestamp}[]> {
        const arr = await activityTable.get({}, ['id', 'title', 'create_time', 'end_time', 'begin_time'])
        let result: {id: number, title: string, createTime: timestamp, endTime: timestamp, beginTime: timestamp}[] = []
        for (const item of arr) {
            result.push({
                id: item.id,
                title: item.title,
                createTime: item.create_time.getTime(),
                beginTime: item.begin_time.getTime(),
                endTime: item.end_time.getTime()
            })
        }
        return result
    }
}


export const activityModel = new ActivityModel()