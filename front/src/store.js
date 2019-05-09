import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: {
            isLogin: false,
            name: '',
            img: 'static/logo.png',
            level: 0
        },
        sessions: [],
        // 当前选中的会话
        currentSessionId: 0,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        login(state) {
            state.user.isLogin = true
        },
        logout(state) {
            state.user.isLogin = false
        },
        init_session(state, payload) {
            for (const session of payload.rooms) {
                state.sessions.push()
            }
        },
        // 发送消息
        SEND_MESSAGE(state, payload) {
            let session = state.sessions.find(item => item.id === state.currentSessionId)
            session.messages.push(payload.message)
        },
        // 选择会话
        SELECT_SESSION(state, payload) {
            state.currentSessionId = payload.id
        },
        // 搜索
        SET_FILTER_KEY(state, payload) {
            state.filterKey = payload.value
        },

    },
    getters: {
        // 过滤后的会话列表
        filterSessions: state => {
            if (state.filterKey === '') {
                return state.sessions
            } else {
                return state.sessions.filter(session => session.members.map((i) => i.name).join('').includes(state.filterKey));
            }
        },
        // 获取当前session
        currentSession: state => {
            const result = state.sessions.find(session => session.id == state.currentSessionId)
            return result
        },
        // 获取当前会话index
        currentId: state => {
            return state.currentSessionId
        }
    }
})

store.watch(
    (state) => state.sessions,
    (val) => {
        console.log('CHANGE: ', val)
        localStorage.setItem('vue-chat-session', JSON.stringify(val))
    }, {
        deep: true
    }
)