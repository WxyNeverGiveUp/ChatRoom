<template>
    <div id="content">
        <div class="members">
            <Members></Members>
        </div>
        <div class="sidebar">
            <Card></Card>
            <List></List>
        </div>
        <div class="main">
            <Message></Message>
            <ChatText></ChatText>
        </div>
    </div>
</template>

<script>
import Card from './card'
import List from './groupList'
import ChatText from './text'
import Message from './message'
import Members from './groupMembers'
export default {
    name: 'groupChat',
    components: { Card, List, ChatText, Message, Members },
}
</script>

<style lang="less" scoped>
#content {
    margin: 20px auto;
    width: 1000px;
    height: 600px;
    overflow: hidden;
    border-radius: 3px;
    .sidebar, .main, .members {
        height: 100%;
    }
    .members {
        float: right;
        width: 200px;
        background-color: #2e3238;
        color: #fff;
    }
    .sidebar {
        float: left;
        width: 200px;
        color: #f4f4f4;
        background-color: #2e3238;
    }
    .main {
        position: relative;
        overflow: hidden;
        background-color: #eee;
    }
    .text {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }
    .message {
        height: ~'calc(100% - 160px)';
    }
}
</style>