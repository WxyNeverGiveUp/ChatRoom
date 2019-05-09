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
        prop="createTime"
        label="创建时间">
        </el-table-column>
        <el-table-column
        prop="beginTime"
        label="开始时间">
        </el-table-column>
        <el-table-column
        prop="endTime"
        label="结束时间">
        </el-table-column>
        <el-table-column
        label="操作">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="success">查看详情</el-button>
                <el-button type="danger" @click="delActivity(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
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
</style>


<script>
    import { ajaxRequest } from '../../util/request.js'
    import { timeFormat } from '../../util/util'
    export default {
        data() {
            return {
                total: 0,
                pagesize:9, //每页的数据条数
                currentPage:1, //默认开始页面
                tableData: [
                ]
            }
        },
        methods: {
            currentChange(currentPage) {
                this.currentPage = currentPage
            },
            handleClick(row) {
                console.log(row)
            },
            async delActivity(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
                            endTime: timeFormat(item.endTime, false)
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
