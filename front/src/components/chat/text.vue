<template>
<div class="text">
    <textarea placeholder="按 Ctrl + Enter / 点击按钮 发送" v-model="content" @keyup="onKeyup"></textarea>
    <el-button class="button" type="button" tyep="success" @click='sendMessage'>发送</el-button>
</div>
</template>

<script>
export default {
    data () {
        return {
            content: ''
        }
    },
    methods: {
        sendMessage () {
            if (this.content.length > 0) {
                this.$store.commit('SEND_MESSAGE', {
                    message: {
                        content: this.content,
                        date: new Date(),
                        self: true
                    }
                })
                this.content = ''
            }
        },
        onKeyup (e) {
            if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                this.sendMessage()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.text {
    height: 160px;
    border-top: solid 1px #ddd;
    textarea {
        padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
        font-family: "Micrsofot Yahei";
        resize: none;
    }
    .button {
        position: relative;
        top: -65px;
        right: -520px;
    }
}
</style>