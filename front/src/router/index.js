import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import HelloWorld from '@/components/HelloWorld'
import register from '@/components/register'
import myMain from '@/components/main'
import chat from '@/components/chat/chatIndex'
import add from '@/components/activity/add'
import list from '@/components/activity/list'
import detail from '@/components/activity/detail'

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
        path: '/chat',
        name: 'chat',
        component: chat
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
    }]
})