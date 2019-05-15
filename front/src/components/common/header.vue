<template>
    <div>
        <div class='img-box clearfix'>
            <img class="avatar"  width="30" height="30" :alt="$store.state.user.name" :src="$store.state.user.img">
        </div>
        <el-button type="text" @click="dialogVisible = true">点击修改个人头像【{{ $store.state.user.name }}】</el-button>
        <el-dialog
        title="修改个人头像"
        :visible.sync="dialogVisible"
        width="30%"
        >
            <Upload></Upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-button @click="adminDialogVisible = true" type="primary" v-show="this.$store.state.user.level == 0">申请管理员</el-button>
        <el-dialog
        title="申请社团管理员"
        :visible.sync="adminDialogVisible"
        width="30%"
        >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="真实姓名" prop="realname">
                <el-input v-model="ruleForm.realname"></el-input>
            </el-form-item>
            <el-form-item label="所在学院" prop="academy">
                <el-input v-model="ruleForm.academy"></el-input>
            </el-form-item>
            <el-form-item label="学号" prop="studynumber">
                <el-input v-model.number="ruleForm.studynumber" type="studynumber"></el-input>
            </el-form-item>
            <el-form-item label="社团" prop="club">
                <el-input v-model="ruleForm.club"></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="position">
                <el-input v-model="ruleForm.position"></el-input>
            </el-form-item>
        
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即申请</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
            </el-form>
        </el-dialog>
        <el-button type="danger" round @click="logout">退出登录</el-button>
    </div>
</template>

<style lang="less" scoped>
    .img-box{
        :hover {
            cursor:pointer
        }
        .avatar {
                float: left;
                margin: 15px 10px 0 0;
                border-radius: 3px;
                border: 1px solid #fff;
            }
    }
</style>

<script>
import Upload from '../common/upload'
import { ajaxRequest } from '../../util/request.js'
export default {
    name: 'vheader',
    data() {
        return {
            dialogVisible: false,
            adminDialogVisible: false,
            ruleForm: {
                realname: '',
                academy: '',
                studynumber: '',
                club: '',
                position: ''
            },
            rules: {
                realname: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                academy: [
                    { required: true, message: '请输入学院名', trigger: 'blur' }
                ],
                studynumber: [
                    { required: true, message: '请输入学号', trigger: 'blur' },
                    { type: 'number', message: '学号必须为数字值'}
                ],
                club: [
                    { required: true, message: '请输入所在社团', trigger: 'blur' },
                ],
                position: [
                    { required: true, message: '请输入社团职位', trigger: 'blur' },
                ]   
            }
        }
    },
    methods: {
        logout() {
            this.$socket.emit('logout', {})
            this.$store.commit('LOGOUT')
            this.$router.push('/') // 回到起始页面
        },
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    const result = await ajaxRequest.post('http://localhost:3000/index/register', {
                        username: this.registerForm.username,
                        password: this.registerForm.pswd
                    })
                } else {
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    },
    components: {
        Upload
    }
}
</script>