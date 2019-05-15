<template>
    <el-form ref="registerForm" :model="registerForm" :rules="rules" label-width="80px" class="register-box">
        <h3 class="register-title">注册页面</h3>
        <el-form-item label="账号" prop="username">
            <el-input type="text" placeholder="请输入账号" v-model="registerForm.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
            <el-input type="password" placeholder="请输入密码" show-password v-model="registerForm.pswd"/>
        </el-form-item>
        <el-form-item label="重复密码" prop="checkPass">
            <el-input type="password" placeholder="请输入再次密码" show-password v-model="registerForm.pswd2"/>
        </el-form-item>
        <el-form-item>
            <el-col :span="8">
                <el-button type="success" @click='register()'>注册</el-button>
            </el-col>
            <el-col :span="8" :offset="6">
                <el-button type="primary" @click="toLogin()">已有账号</el-button>
             </el-col>
        </el-form-item>
    </el-form>
</template>

<style scoped>
    .register-box {
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

    .register-title {
        font-size: 24px;
        text-align: center;
        margin: 0 auto 40px auto;
        color: #303133;
    }
    
</style>

<script>
    import { ajaxRequest } from '../util/request.js'
    export default {
        name: 'register',
        data() {
            let validatePass = (rule, value, callback) => {
                if (this.registerForm.pswd === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.registerForm.pswd !== '') {
                        this.$refs.registerForm.validateField('checkPass')
                    }
                    callback()
                }
            }
            let validatePass2 = (rule, value, callback) => {
                if (this.registerForm.pswd2 === '') {
                    callback(new Error('请再次输入密码'))
                } else if (this.registerForm.pswd !== this.registerForm.pswd2) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                registerForm: {
                    username: '',
                    pswd: '',
                    pswd2: ''
                },
                rules: {
                    username: [
                        {required: true, message: '账号不可带标点符号或为空', trigger: 'blur', pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/},
                        {max: 12, message: '长度在 0 到 12 个字符', trigger: 'blur' }
                    ],
                    pass: [
                        {required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        {required: true, validator: validatePass2, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            toLogin() {
                this.$router.push('/')
            },
            async register() {
                this.$refs['registerForm'].validate(async (valid) => {
                    if (valid) {
                        const result = await ajaxRequest.post('http://localhost:3000/index/register', {
                            username: this.registerForm.username,
                            password: this.registerForm.pswd
                        })
                        if (result.code !== 0) {
                            this.$message({
                                message: result.msg,
                                type: 'error'
                            })
                        } else {
                           this.$message({
                                message: result.msg,
                                type: 'success',
                                duration: 2000,
                                onClose: () => {
                                    this.$router.push('/')
                                }
                            }) 
                        }
                    } else {
                        this.$message({
                            message: '验证失败',
                            type: 'error'
                        })
                        return false
                    }
                })
            }            
        },
    }
</script>
