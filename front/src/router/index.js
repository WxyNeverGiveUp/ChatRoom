import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import HelloWorld from '@/components/HelloWorld'
import register from '@/components/register'
import myMain from '@/components/main'
import groupChat from '@/components/chat/groupChat'
import privateChat from '@/components/chat/privateChat'
import add from '@/components/activity/add'
import list from '@/components/activity/list'
import detail from '@/components/activity/detail'
import adminList from '@/components/admin/list'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'login',
        component: login
    }, {
        path: '/Helloword',
        name: 'helloWord',
        component: HelloWorld
    }, {
        path: '/register',
        name: 'register',
        component: register
    }, {
        path: '/main',
        name: 'main',
        component: myMain
    }, {
        path: '/groupChat',
        name: 'groupChat',
        component: groupChat
    }, {
        path: '/privateChat',
        name: 'privateChat',
        component: privateChat
    }, {
        path: '/activity/list',
        name: 'activityList',
        component: list
    }, {
        path: '/activity/add',
        name: 'activityAdd',
        component: add
    }, {
        path: '/activity/detail',
        name: 'activityDetail',
        component: detail
    }, {
        path: '/admin/list',
        name: 'adminList',
        component: adminList
    }]
})