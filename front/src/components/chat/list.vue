<template>
    <div class="list">
        <ul>
            <li v-for="item in $store.getters.filterSessions" :class="{ active: item.id === $store.getters.currentId }" @click="selectSession(item.id)" :key="item.id">
                <img class="avatar"  width="30" height="30" :alt="item.members.length > 1 ? item.members[0].name : '群聊'" :src="item.members.length > 1 ? item.members[0].img : item.members[0].img">
                <p class="name">{{ item.members.map((i) => i.name).join(',') }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
   methods: {
       selectSession(id) {
           this.$store.state.currentSessionId = id
       }
   },
   created() {
       console.log('当前用户', this.$store.getters.filterSessions)
       console.log('当前用户', this.$store.getters.currentId)
   }
}
</script>

<style scoped lang="less">
.list {
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
    .avatar, .name {
        vertical-align: middle;
    }
    .avatar {
        border-radius: 2px;
    }
    .name {
        display: inline-block;
        margin: 0 0 0 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 120px;
    }
}
</style>