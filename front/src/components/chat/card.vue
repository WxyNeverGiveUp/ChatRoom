<template>
<div class="card">
    <header>
        <createGroup></createGroup>
        <img class="avatar" width="40" height="40" :alt="$store.state.user.name" :src="$store.state.user.img">
        <p class="name">{{ $store.state.user.name }}</p>
    </header>
    <footer>
        <input class="search" type="text" placeholder="查找用户..." @keyup="onKeyup" v-model='search'>
    </footer>
</div>
</template>

<script>
import CreateGroup from './createGroup'
export default {
    data() {
        return {
            search: ''
        }
    },
    methods: {
        onKeyup () {
            this.$store.state.filterKey = this.search
            this.$store.getters.filterSessions
        }
    },
    components: {
       CreateGroup 
    }
}
</script>

<style scoped lang="less">
.card {
    padding: 12px;
    border-bottom: solid 1px #24272C;
    footer {
        margin-top: 10px;
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
        font-size: 16px;
    }
    .search {
        padding: 0 10px;
        font-size: 12px;
        color: #fff;
        height: 30px;
        line-height: 30px;
        border: solid 1px #3a3a3a;
        border-radius: 4px;
        outline: none;
        background-color: #26292E;
    }
}
</style>