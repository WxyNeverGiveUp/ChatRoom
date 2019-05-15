<template>
    <div class="list">
        <ul>
            <li v-for="item in $store.getters.filterGroupSessions" :class="{ active: item.id === $store.getters.currentId }" @click="selectSession(item.id)" :key="item.id">
                <i class="fa fa-users fa-2x avatar"></i>
                <div class="name">{{ item.name }}</div>
                <el-badge :is-dot="item.hasNewMsg"></el-badge>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
   methods: {
       selectSession(id) {
            this.$store.state.currentSessionId = id
            this.$socket.emit('readMsg', {
                roomId: id,
                name: this.$store.state.user.name
            })
            for (let i = 0; i < this.$store.state.sessions.length; i++) {
                if (this.$store.state.sessions[i].id === id) {
                    this.$store.state.sessions[i].hasNewMsg = false
                }
            }
       }
   },
   created() {
        this.$store.state.currentSessionId = 0
   }
}
</script>

<style scoped lang="less">
.list {
    height: 493px;
    overflow-y: auto;
    li {
        padding: 12px;
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
    .avatar, .name {
        vertical-align: middle;
    }
    .avatar {
        width: 30px;
        height: 30px;
        border-radius: 2px;
    }
    .name {
        display: inline-block;
        margin: 0 0 0 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 100px;
    }
}
</style>