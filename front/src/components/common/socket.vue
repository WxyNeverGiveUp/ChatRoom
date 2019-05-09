<template>
  <div>
  </div>
</template>

<script>
	export default {
		sockets: {
			newInvite: function(res) {
				console.log('接到了新邀请')
			},
			otherLogin: function(res) {
                if (this.$store.state.user.isLogin) {
                    this.$notify({
                        title: '登录通知',
                        position: 'bottom-right',
                        message: `${res.username}登录了， 快去找他/她吧`
				    })
                }
			},
			otherLogout: function(res) {
                if (this.$store.state.user.isLogin) {
                    this.$notify({
                        title: '下线',
                        position: 'bottom-right',                    
                        message: `${res.username}下线了哦！`
				    })
                }
            },
            newMessage: function(res) {
                if (this.$store.state.user.isLogin) {
                    this.$notify({
                        title: '一条新消息',
                        position: 'bottom-right',                    
                        message: ``,
                        duration: 0,
                        type: 'success'
                    })
                }
            }
		}
	}
</script>
