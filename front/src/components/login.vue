<template>
    <div>
        <el-form ref="loginForm" :model="loginForm" :rules="rules" label-width="80px" class="login-box">
            <h3 class="login-title">社团即时通讯平台</h3>
            <el-form-item label="账号" prop="username">
                <el-input type="text" placeholder="请输入账号" v-model="loginForm.username"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"/>
            </el-form-item>
            <el-form-item>
                <el-col :span="8">
                    <el-button type="primary" @click="onSubmit('loginForm')" width="100%">登录</el-button>
                </el-col>
                <el-col :span="8" :offset="4">
                    <el-button type="success" @click="toRegister()">注册账号</el-button>
                </el-col>
            </el-form-item>
        </el-form>

        <el-dialog
            title="温馨提示"
            :visible.sync="dialogVisible"
            width="30%"
        >
            <span>账号密码错误</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<style scoped>
    .login-box {
        border: 1px solid #DCDFE6;
        width: 350px;
        margin: 180px auto;
        padding: 35px 35px 15px 35px;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        box-shadow: 0 0 25px #909399;
        background-color: #fff;
    }

    .login-title {
        font-size: 24px;
        text-align: center;
        margin: 0 auto 40px auto;
        color: #303133;
    }
    
</style>

<script>
    import { ajaxRequest } from '../util/request.js'
    import { Message } from 'element-ui'
    export default {
        name: 'login',
        data() {
            return {
                loginForm: {
                    username: '',
                    pswd: '',
                },
                // 表单验证，需要在 el-form-item 元素中增加 prop 属性
                rules: {
                    username: [
                        {required: true, message: '账号不可为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不可为空', trigger: 'blur'}
                    ]
                },
                // 对话框显示和隐藏
                dialogVisible: false
            }
        },
        sockets: {
            login: function(res) {
                if (res.code !== 0) {
                    Message({
                        message: res.msg,
                        type: 'error'
                    })
                } else {
                    this.$message({
                        message: '登陆成功',
                        type: 'success',
                        duration: 500,
                        onClose: () => {
                            console.log('data==>', res)
                            this.$store.state.user.name = this.loginForm.username
                            this.$store.state.user.img = res.data.img
                            this.$store.state.user.level = res.data.level
                            this.$store.commit('LOGIN')
                            for (const room of res.data.rooms) {
                                const session = {}
                                session.id = room.roomId,
                                session.name = room.roomName,
                                session.hasNewMsg = room.HasNewMsg,
                                session.members = room.members
                                session.messages = []
                                for (const msg of room.msgs) {
                                    const img = session.members.find(member => member.name === msg.from) ? session.members.find(member => member.name === msg.from).img : 'http://localhost:3000/upload/logo.png'
                                    const message = {
                                        from: msg.from,
                                        img: img,
                                        id: msg.id,
                                        content: msg.content,
                                        date: msg.date || new Date().getTime(),
                                        type: msg.type,
                                        self: msg.from ===  this.$store.state.user.name
                                    }
                                    session.messages.push(message)
                                }
                                this.$store.commit('ADD_SESSION', {
                                    session
                                })
                            }
                            console.log(this.$store.state.sessions)
                            this.$router.push('/main')
                        }
                    })
                }
            }
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        await this.login()
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            async login() {
                this.$socket.emit('login', {
                    username: this.loginForm.username,
                    password: this.loginForm.password
                })
            },
            toRegister() {
                this.$router.push('/register')
            }
        },
        updated() {
        }
    }
</script>
