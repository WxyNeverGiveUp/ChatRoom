<template>
    <div class='quit'>
        <el-button type='danger' @click='quitRoom'>退出该群聊</el-button>
    </div>
</template>

<style lang="less" scoped>
    .quit {
        text-align: center;
        margin: 10px;
    }
</style>


<script>
export default {
    methods: {
        quitRoom() {
            if (this.$store.getters.currentSession) {
                this.$confirm(`离开房间【${this.$store.getters.currentSession.name}】`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(async () => {
                    this.$socket.emit('leave', {
                        user: this.$store.state.user.name,
                        roomId: this.$store.state.currentSessionId
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消【离开房间】'
                    })         
                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请选择离开的房间'
                })  
            }
        },
    },
    sockets: {
        leave: function(res){
            if (res.data.code === 0) {
                this.$message({
                    type: 'success',
                    message: '退出成功'
                })
            }
            const index = this.$store.state.sessions.findIndex(item => item.id === res.data.roomId)
            if (index > 0) {
                this.$store.state.sessions.splice(index, 1)
            }

            this.$store.state.currentSessionId = 0
        }
    }
}
</script>
