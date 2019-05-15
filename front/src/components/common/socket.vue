<template>
  <div>
  </div>
</template>

<script>
	export default {
		sockets: {
			newInvite: function(res) {
                console.log('接到了新邀请', res)
                if (res.data.invite.to.includes(this.$store.state.user.name)) {
                    this.$notify({
                        title: '聊天邀请通知',
                        position: 'bottom-right',
                        message: `【${res.data.invite.from}】邀请你加入聊天【${res.data.roomName}】`
                    })
                    let session = {}
                    session.id = res.data.invite.roomId,
                    session.name = res.data.roomName,
                    session.hasNewMsg = false,
                    session.members = res.data.members
                    session.messages = []
                    this.$store.commit('ADD_SESSION', {
                        session
                    })
                    this.$socket.emit('join', {
                        roomId: res.data.invite.roomId,
                        user: this.$store.state.user.name
                    })
                }
			},
			otherLogin: function(res) {
                for (let i = 0; i < this.$store.state.sessions.length; i++) {
                        for (let j = 0; j < this.$store.state.sessions[i].members.length; j++) {
                            if (this.$store.state.sessions[i].members[j].name === res.username) {
                                this.$store.state.sessions[i].members[j].isOnline = true
                            }
                        }
                    }

                for (let i = 0; i < this.$store.state.sessions.length; i++) {
                    if (this.$store.state.sessions[i].id === 0) {
                        if (!this.$store.state.sessions[i].members.find(item => item.name === res.username)) {
                            this.$store.state.sessions[i].members.push({
                                name: res.username,
                                isOnline: res.isOnline,
                                img:  res.img
                            })
                        }
                        break
                    }
                }
                if (this.$store.state.user.isLogin) {
                    this.$notify({
                        title: '登录通知',
                        position: 'bottom-right',
                        message: `${res.username}登录了， 快去找他/她吧`
                    })
                }
			},
			otherLogout: function(res) {
                for (let i = 0; i < this.$store.state.sessions.length; i++) {
                    for (let j = 0; j < this.$store.state.sessions[i].members.length; j++) {
                        if (this.$store.state.sessions[i].members[j].name === res.username) {
                            this.$store.state.sessions[i].members[j].isOnline = false
                        }
                    }
                }
                if (this.$store.state.user.isLogin) {

                    this.$notify({
                        title: '下线通知',
                        position: 'bottom-right',                    
                        message: `${res.username}下线了哦！`
                    })
                }
            },
            readMsg: function(res) {
                if (this.$store.state.user.isLogin) {
                    this.$notify({
                        title: '阅读信息',
                        position: 'bottom-right',                    
                        message: `${JSON.stringify(res)} 已经阅读了哦`
				    })
                }
            },
            newMsg: function(res) {
                console.log(res)
                if (this.$store.state.user.isLogin && res.from !== this.$store.state.user.name) {
                    this.$notify({
                        title: '收到一条新消息',
                        position: 'bottom-right',                    
                        message: `【${res.from}】给您发送了一条消息`,
                        duration: 4000,
                        type: 'success'
                    })
                    for (let i = 0; i < this.$store.state.sessions.length; i++) {
                        if (this.$store.state.sessions[i].id === res.roomId) {
                            this.$store.state.sessions[i].hasNewMsg = true
                        }
                    }
                    this.$store.commit('NEW_MESSAGE', {
                        message: {
                            roomId: res.roomId,
                            content: res.content,
                            date: res.date,
                            id: res.id,
                            type: res.type,
                            self: false,
                            from: res.from
                        }
                    })
                }
            },
            otherLeave: function(res) {
                if (this.$store.state.user.isLogin && res.username !== this.$store.state.user.name) {
                   
                    for (let i = 0; i < this.$store.state.sessions.length; i++) {
                        if (this.$store.state.sessions[i].id === res.roomId) {
                            const index = this.$store.state.sessions[i].members.findIndex(item => item.name === res.name)
                            this.$store.state.sessions[i].members.splice(index, 1)
                        }
                    } 
                    this.$notify({
                        title: `离开群聊`,
                        position: 'bottom-right',                    
                        message: `【${res.username}】离开了群聊`,
                        duration: 0,
                        type: 'success'
                    })                     
                }
            },
            otherJoin: function(res) {
                for (let i = 0; i < this.$store.state.sessions.length; i++) {
                    for (let j = 0; j < this.$store.state.sessions[i].members.length; j++) {
                        if (this.$store.state.sessions[i].members[j].name === res.username) {
                            this.$store.state.sessions[i].members[j].isOnline = true
                        }
                    }
                }
                this.$notify({
                    title: `加入聊天室`,
                    position: 'bottom-right',                    
                    message: `【${res.username}】加入了聊天室`,
                    duration: 0,
                    type: 'success'
                }) 
            }
		}
	}
</script>
