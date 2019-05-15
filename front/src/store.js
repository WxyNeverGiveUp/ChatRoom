import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: {
            isLogin: false,
            name: '',
            img: '',
            level: 0
        },
        sessions: [],
        // 当前群聊选中的会话
        currentSessionId: 0,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        LOGIN(state) {
            state.user.isLogin = true
        },
        LOGOUT(state) {
            state.user = {
                isLogin: false,
                name: '',
                img: '',
                level: 0
            }
            state.sessions = []
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
        // 收到消息
        NEW_MESSAGE(state, payload) {
            console.log(payload)
            let session = state.sessions.find(item => item.id === payload.message.roomId)
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
        ADD_SESSION(state, payload) {
            state.sessions.push(payload.session)
        }

    },
    getters: {
        // 过滤后群聊会话列表
        filterGroupSessions: state => {
            if (state.filterKey === '') {
                return state.sessions.filter(session => (session.members && session.members.length > 2) || (session.id === 0))
            } else {
                return state.sessions.filter(session => (session.members && session.members.length > 2) || (session.id === 0)).filter(session => session.members.map((i) => i.name).join('').includes(state.filterKey));
            }
        },
        // 过滤后私聊会话列表
        filterPrivateSessions: state => {
            if (state.filterKey === '') {
                return state.sessions.filter(session => (session.members && session.members.length <= 2) && (session.id !== 0))
            } else {
                return state.sessions.filter(session => (session.members && session.members.length <= 2) && (session.id !== 0)).filter(session => session.members.map((i) => i.name).join('').includes(state.filterKey));
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
        },
    }
})