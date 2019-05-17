<template>
    <div>
        <QuitRoom v-if="this.$store.state.currentSessionId !== 0"></QuitRoom>
        <div class="title">当前群用户列表：</div>
        <div class="list">
            <ul v-if="$store.getters.currentSession">
                <li v-for="item in $store.getters.currentSession.members" :key="item.name">
                    <div class='name'>
                        <i class="fa fa-user" v-if="item.isOnline"></i>
                        <i class="fa fa-user-times" v-else></i>
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="op">
                        <i class="fa fa-comment" @click="createChat(item.name)" v-if='$store.state.user.name !== item.name'></i>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import QuitRoom from './quitRoom'
export default {
    data() {
        return {
        }
    },
    methods: {
        createChat(name) {
            this.$confirm(`【私聊】确定与【${name}】创建私聊?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(async () => {
                let hashChat = false
                for (const session of this.$store.state.sessions) {
                    const users = session.members.map(item => item.name)
                    if (users.includes(name) && users.includes(this.$store.state.user.name) && users.length == 2) {
                        hashChat = true
                    }
                }
                if (!hashChat) {
                    this.$socket.emit('createGroup', {
                        users: [name, this.$store.state.user.name],
                        from: this.$store.state.user.name,
                        to: [name]
                    })
                } else {
                    this.$message({
                        type: 'info',
                        message: '已经创建聊天，请在私聊列表查找'
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消创建【私聊】'
                })         
            })
        }
    },
    components: {
        QuitRoom
    }
}
</script>

<style scoped lang="less">
.op {
    float: right;
}
.title {
        text-align: center;
        font-size: 16px;
        margin: 15px 0 5px 0;
}
.list {
    widows: 300px;
    height: 600px;
    overflow-y: auto;
    li {
        padding: 12px 15px;
        border-bottom: 1px solid #292C33;
        cursor: pointer;
        transition: background-color .1s;
        &:hover {
            background-color: rgba(255, 255, 255, 0.03);
        }
        &.active {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
    .name {
        vertical-align: middle;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 120px;
    }
}
</style>