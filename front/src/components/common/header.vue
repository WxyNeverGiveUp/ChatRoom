<template>
    <div>
        【{{ $store.state.user.name }}】
        <el-button type="danger" round @click="logout">退出登录</el-button>
    </div>
</template>

<style>

</style>


<script>
export default {
    name: 'vheader',
    data() {
        return {}
    },
    methods: {
        logout() {
            this.$socket.emit('logout', {})
            this.$store.commit('logout')
            this.$router.push('/') // 回到起始页面
        }
    }
}
</script>