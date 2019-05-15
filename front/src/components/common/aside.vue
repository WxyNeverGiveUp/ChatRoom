<template>
    <el-row class="tac">
    <el-col :span="12">
        <el-menu
        default-active="2"
        router
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose">
        <div v-for="(item, i) in filteredNavList" :key="i">
            <el-submenu :index="i + ''" v-if="item.subNav.length > 0">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{ item.navName }}</span>
                </template>
                <el-menu-item v-for="sub in item.subNav" :key="sub.subNavName" :index="sub.route">
                    <template slot="title">
                        <i :class="sub.icon"></i>
                        <span>{{ sub.subNavName }}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.route" v-else>
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{ item.navName }}</span>
                </template>
            </el-menu-item>
        </div>
        </el-menu>
    </el-col>
    </el-row>
</template>

<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
</style>


<script>
  export default {
    name: 'vside',
    data() {
        return {
            navList: [
                {navName:'管理员审核', route:'/admin/list', icon: 'el-icon-location', level: 2, subNav: []},
                {navName:'活动资讯', route:'/', icon: 'el-icon-location', level: 0, subNav: [
                    {subNavName: '活动列表', route: '/activity/list', icon: 'el-icon-location', level: 0},
                    {subNavName: '添加活动', route: '/activity/add', icon: 'el-icon-location', level: 1}
                ]},
                {navName:'聊天室', route:'/', icon: 'el-icon-location', level: 0, subNav: [
                    {subNavName:'群聊', route:'/groupChat', icon: 'el-icon-location', level: 0},
                    {subNavName:'私聊', route:'/privateChat', icon: 'el-icon-location', level: 0},
                    {subNavName:'所有人', route:'/', icon: 'el-icon-location', level: 0},
                ]}
            ],
            isCollapse: false
        }
    },
    computed: {
        filteredNavList: function () {
            let newList = []
            for (const nav of this.navList) {
                let item = {}
                if (this.$store.state.user.level >= nav.level) {
                        item.navName = nav.navName
                        item.route = nav.route
                        item.icon = nav.icon
                        item.subNav = []
                        /**
                         * 判断子路由
                         */
                        if (nav.subNav.length >= 0) {
                            for (const sub of nav.subNav) {
                                if (this.$store.state.user.level >= sub.level) {
                                    item.subNav.push({
                                        subNavName: sub.subNavName,
                                        route: sub.route,
                                        icon: sub.icon
                                    })
                                }
                            }
                        }
                        newList.push(item)
                }
            }
            return newList
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    },
    created() {
    }
  }
</script>