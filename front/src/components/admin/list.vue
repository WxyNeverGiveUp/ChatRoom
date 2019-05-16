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
        prop="realname"
        label="真实姓名">
        </el-table-column>
        <el-table-column
        prop="academy"
        label="学院">
        </el-table-column>
        <el-table-column
        prop="studynumber"
        label="学号">
        </el-table-column>
        <el-table-column
        prop="club"
        label="所在社团">
        </el-table-column>
        <el-table-column
        prop="position"
        label="社团职位">
        </el-table-column>
        <el-table-column
        prop="isPass"
        label="审核状态">
        </el-table-column>
        <el-table-column
        label="操作"
        width="300">
            <template slot-scope="scope">
                <el-button type="success" @click="checkAdmin(scope.row, scope.row.username, true)">审核通过</el-button>
                <el-button type="danger" @click="checkAdmin(scope.row, scope.row.username, false)">审核不通过</el-button>
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
            async checkAdmin(row, username, isPass) {
                this.$confirm(`审批【${isPass ? '通过' : '不通过'}】, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.$socket.emit('adminCheck', {
                        username: username,
                        isPass
                    })
                    this.$message({
                        message: '审批完成',
                        type: 'success'
                    })
                    row.isPass = isPass ? '通过' : '不通过'
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消管理员审批'
                    })         
                })
            },
            async getList() {
                const result = await ajaxRequest.get('http://localhost:3000/admin/getAll', {})                 
                console.log(result)
                if (result.code !== 0) {
                    this.$message({
                        message: result.msg || '发生意外的错误！',
                        type: 'error'
                    })
                } else {
                    for (const item of result.data.list) {
                        this.tableData.push({
                            realname: item.realname,
                            academy: item.academy,
                            club: item.club,
                            studynumber: item.studynumber,
                            position: item.position,
                            username: item.username,
                            isPass: ['未审核', '不通过', '通过'][item.isPass]
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
