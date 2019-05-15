import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios' // 引用axios
import qs from 'qs' // 将json转换为数组
import VueSocketIO from 'vue-socket.io'
import vUploader from 'v-uploader';
import { store } from './store';
import 'font-awesome/css/font-awesome.min.css' // font-awesome 字体

Vue.config.productionTip = false
Vue.prototype.$axios = axios // 全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs // 全局注册，使用方法为:this.qs
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(new VueSocketIO({ // 使用socketIO
    connection: 'http://localhost:3000',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
}))

// v-uploader plugin global config
const uploaderConfig = {
    // file uploader service url
    uploadFileUrl: 'http://localhost:3000/index/upload',
    // file delete service url
    deleteFileUrl: 'http://localhost:3000/index/upload',
    // set the way to show upload message(upload fail message)
    showMessage: (vue, message) => {
        console.log('upload error======>', error)
    },
}

// install plugin with options
Vue.use(vUploader, uploaderConfig);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})