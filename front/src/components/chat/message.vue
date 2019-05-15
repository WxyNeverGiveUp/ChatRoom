<template>
<div class="message">
    <ul v-if="$store.getters.currentSession">
        <li v-for="item in $store.getters.currentSession.messages" :key="item.id">
            <p class="time">
                <span>{{ item.date | time() }}</span>
            </p>
            <div class="main" :class="{ self: item.self }" id="main">
                <img class="avatar" width="30" height="30" :src="item.self ? $store.state.user.img : $store.getters.currentSession.members.find(i => i.name === item.from) ? $store.getters.currentSession.members.find(i => i.name === item.from).img : item.img" />
                <div class="name" v-if="$store.getters.currentSession.members.length > 1">{{ item.from }}</div>
                <div class="text">{{ item.content }}</div>
            </div>
        </li>
    </ul>
</div>
</template>

<script>
export default {
    filters: {
        // 将日期过滤为 hour:minutes
        time (date = new Date().getTime()) {
            if (typeof date === 'string' || typeof date === 'number') {
                date = new Date(date);
            }
            return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日${date.getHours()}:${date.getMinutes()}`
        }
    },
    computed: {
        message() {
            if (this.$store.getters.currentSession) {
                return this.$store.getters.currentSession.messages
            } else {
                return []
            }
        }
    },
    watch: {
        message: function() {
            this.$nextTick(() => {
                document.querySelector('.message').scrollTop = document.querySelector('.message').scrollHeight
            })
        }
    },
    created() {
        console.log('currentSession==>', this.$store.getters.currentSession)
    }   
}
</script>

<style lang="less" scoped>
.message {
    padding: 10px 15px;
    overflow-y: scroll;
    li {
        margin-bottom: 15px;
    }
    .time {
        margin: 7px 0;
        text-align: center;
        > span {
            display: inline-block;
            padding: 1px 18px;
            font-size: 12px;
            color: #fff;
            border-radius: 2px;
            background-color: #dcdcdc;
        }
    }
    .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
    }
    .name {
        font-size: 10px;
        margin-bottom: 2px; 
    }
    .text {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        max-width: ~'calc(100% - 80px)';
        min-height: 30px;
        line-height: 2.5;
        font-size: 12px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;
        &:before {
            content: " ";
            position: absolute;
            top: 9px;
            right: 100%;
            border: 6px solid transparent;
            border-right-color: #fafafa;
        }
    }
    .self {
        text-align: right;
        .avatar {
            float: right;
            margin: 0 0 0 10px;
        }
        .text {
            background-color: #b2e281;
            &:before {
                right: inherit;
                left: 100%;
                border-right-color: transparent;
                border-left-color: #b2e281;
            }
        }
    }
}
</style>