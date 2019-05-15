<template>
<div class="text">
    <textarea placeholder="按 Ctrl + Enter / 点击按钮 发送" v-model="content" @keyup="onKeyup"></textarea>
    <el-button class="button" type="button" tyep="success" @click='sendMessage'>发送</el-button>
</div>
</template>

<script>
export default {
    data () {
        return {
            emoji: ['😊','😅','😲','😭','😂','😄','😩','😞','😵','😒','😍',   
            '😤', '😜','😝','😋','😘','😚','😷','😳','😃', '😆', '😁', '😢','😨', 
            '😠','😣', '😌', '😖','😔', '😰','😱','😪','😏','😓'
            ],
            content: ''
        }
    },
    sockets: {
       sendMsg: function(res) {
            console.log('sendMessage==>', res)
            if (this.$store.state.user.isLogin) {
                this.$notify({
                    title: '成功发送消息',
                    position: 'bottom-right',                    
                    message: `${content}`,
                    duration: 1000,
                    type: 'success'
                })
                this.$store.commit('SEND_MESSAGE', {
                    message: {
                        from:  res.data.from,
                        content: res.data.msg.content,
                        date: res.data.msg.date,
                        id: res.data.msg.id,
                        type: res.data.msg.type,
                        self: true
                    }
                })
                this.content = ''
            }
        } 
    },
    methods: {
        sendMessage () {
            if (!this.$store.getters.currentSession) {
                this.$message({
                    type: 'error',
                    message: '请先选择聊天列表'
                }) 
            } else {
                if (this.content.length > 0) {
                    this.$socket.emit('sendMsg', {
                        message: {
                            roomId: this.$store.state.currentSessionId, // 该消息是在哪个房间中
                            type: 1,
                            from: this.$store.state.user.name,
                            to: '*All',
                            content: this.content,
                        }
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '发送消息不可为空'
                    }) 
                }
            } 
        },
        onKeyup (e) {
            if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                this.sendMessage()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.text {
    height: 160px;
    border-top: solid 1px #ddd;
    textarea {
        padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
        font-family: "Micrsofot Yahei";
        resize: none;
    }
    .button {
        position: relative;
        top: -65px;
        right: -520px;
    }
}
</style>