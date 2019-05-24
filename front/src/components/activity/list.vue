<template>
  <div>
    <el-table
    :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
    border
    style="width: 100%">
        <el-table-column
        type="index"
        label="序号"
        width="150">
        </el-table-column>
        <el-table-column
        prop="title"
        label="活动">
        </el-table-column>
        <el-table-column
        prop="hostUnit"
        label="承办社团">
        </el-table-column>
        <el-table-column
        prop="createTime"
        label="发布日期">
        </el-table-column>
        <el-table-column
        prop="joinerCounter"
        label="报名人数">
        </el-table-column>
        <el-table-column
        label="操作"
        width="600"
        >
            <template slot-scope="scope">
                <el-button type="warning" @click="broadcast(scope.row)" v-if='$store.state.user.level >= 1'>通知</el-button>
                <el-button @click="lookJoiners(scope.row)" v-if='$store.state.user.level >= 1'>查看报名名单</el-button>
                <el-button @click="join(scope.row)" type="success" v-if="scope.row.endTimestamp > new Date().getTime()">报名</el-button>
                <el-button type="success" disabled v-else>已结束</el-button>
                <el-button @click="getDetail(scope.row)" type="primary">查看详情</el-button>
                <el-button type="danger" @click="delActivity(scope.row.id)" v-if='$store.state.user.level >= 1'>删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog
    title="报名名单"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
        <ul>
            <li v-for="joiner in currentJoiners" :key="joiner">
                {{ joiner }}
            </li>
        </ul>
    </el-dialog>
    <el-pagination
        layout="prev, pager, next"
        @current-change="currentChange"
        :total="total">
    </el-pagination>
  </div>
</template>

<style lang="less" scoped>
    .el-pagination {
        margin-top: 20px; 
        text-align: center;
    }
    ul li {
        width: 50%;
        border-bottom: 1px solid #a19b9b;
        padding: 5px;
        font-size: 20px;
    }
</style>


<script>
    import { ajaxRequest } from '../../util/request.js'
    import { timeFormat } from '../../util/util'
    export default {
        data() {
            return {
                currentJoiners: [],
                dialogVisible: false,
                total: 0,
                pagesize:9, //每页的数据条数
                currentPage:1, //默认开始页面
                tableData: []
            }
        },
        methods: {
            broadcast(row) {
                this.$socket.emit('newBroadcast', {
                    activity: row.title,
                    content: ''
                })
            },
            lookJoiners(row) {
                this.dialogVisible = true
                this.currentJoiners = row.joiners
            },
            handleClose(done) {
                this.dialogVisible = false
            },
            currentChange(currentPage) {
                this.currentPage = currentPage
            },
            getDetail(row) {
                this.$router.push({
                    name:'activityDetail',
                    query:{
                        id: row.id,
                    }
                })
            },
            async join(row) {
                const result = await ajaxRequest.post('http://localhost:3000/activity/join', {
                    id: row.id, 
                    username: this.$store.state.user.name
                })                 
                this.$message({
                    message: '报名成功',
                    type: 'success'
                })
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].id === row.id) {
                        this.tableData[i].joinerCounter += 1
                    }
                }
            },
            async delActivity(id) {
                this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const result = await ajaxRequest.post('http://localhost:3000/activity/del', {id})                 
                    if (result.code !== 0) {
                        this.$message({
                            message: result.msg || '发生意外的错误！',
                            type: 'error'
                        })
                    } else {
                        this.tableData.splice(this.tableData.findIndex((i) => i.id === id),1)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    } 
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })         
                })
            },
            async getList() {
                const result = await ajaxRequest.get('http://localhost:3000/activity/getAll', {})                 
                console.log(result)
                if (result.code !== 0) {
                    this.$message({
                        message: result.msg || '发生意外的错误！',
                        type: 'error'
                    })
                } else {
                    for (const item of result.data.list) {
                        this.tableData.push({
                            id: item.id,
                            title: item.title,
                            createTime: timeFormat(item.createTime, false),
                            beginTime: timeFormat(item.beginTime, false),
                            endTime: timeFormat(item.endTime, false),
                            endTimestamp: item.endTime,
                            joiners: item.joiners,
                            joinerCounter: item.joiners.length,
                            hostUnit: item.hostUnit
                        })
                    }
                }        
            } 
        },
        async created() {
            await this.getList()
            this.total = this.tableData.length
        }
    }
</script>
