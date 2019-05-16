<template>
    <div style='text-align: center;margin-bottom: 10px;'>
        <el-button type="success" @click="dialogTableVisible = true">创建私聊/群聊</el-button>
        <el-dialog title="选择聊天用户" :visible.sync="dialogTableVisible">
            <template>
            <el-table
                ref="multipleTable"
                :data="this.$store.state.sessions.find(item => item.id === 0).members.filter(item => item.name !== this.$store.state.user.name)"
                tooltip-effect="dark"
                style="width: 80%"
                height="300"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="name"
                label="用户名">
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button @click="createGroup" type="success">创建</el-button>
            </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogTableVisible: false,
            multipleSelection: []
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        createGroup() {
            let users = this.multipleSelection.map(item => item.name)
            users.push(this.$store.state.user.name)
            if (users.length === 1) {
                this.$message({
                    type: 'error',
                    message: '请至少选择一名用户'
                })
                return
            }
            if (users.length === 2) {
                this.$confirm(`【私聊】确定与【${this.multipleSelection[0].name}】创建私聊?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(async () => {
                    this.$socket.emit('createGroup', {
                        users,
                        from: this.$store.state.user.name,
                        to: this.multipleSelection.map(item => item.name)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消创建【私聊】'
                    })         
                })
            } else {
                this.$confirm(`【群聊】确定创建【${users.join(',')}】群聊?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(async () => {
                    this.$socket.emit('createGroup', {
                        users,
                        from: this.$store.state.user.name,
                        to: this.multipleSelection.map(item => item.name)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消创建【群聊】'
                    })         
                })
            }
        }
    },
    sockets: {
        createGroup: function(res){
            if (res.code === 0) {
                this.$message({
                    type: 'success',
                    message: '创建成功'
                })
            }
            this.dialogTableVisible = false
            let session = {}
            session.id = res.data.roomId,
            session.name = res.data.roomName,
            session.hasNewMsg = false,
            session.members = res.data.members
            session.messages = []
            this.$store.commit('ADD_SESSION', {
                session
            })

            this.$socket.emit('sendInvite', {
                roomId: res.data.roomId,
                from: res.data.from,
                to: res.data.to
            })
        }
    }
}
</script>
