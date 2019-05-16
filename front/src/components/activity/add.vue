<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author" required>
            <el-input v-model="ruleForm.author" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="举办社团" prop="hostUnit" required>
            <el-input v-model="ruleForm.hostUnit"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" prop="date">
            <el-col :span="11">
                <el-date-picker
                v-model="ruleForm.date"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="活动详情" prop="content">
            <Ueditor @EditorUpdate="contentUpdate"></Ueditor>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import Ueditor from './ue'
    import { ajaxRequest } from '../../util/request.js'
    export default {
        components: {
            Ueditor
        },
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                ruleForm: {
                    title: '',
                    date: [],
                    author: this.$store.state.user.name,
                    content: '',
                    hostUnit: ''
                },
                rules: {
                    title: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                    ],
                    hostUnit: [
                        { required: true, message: '请输入举办社团', trigger: 'blur' },
                    ],
                    content: [
                        { required: true, message: '请填写活动详情', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        if (this.ruleForm.date.length === 0) {
                            this.$message({
                                message: '请选择活动时间',
                                type: 'error'
                            })
                        } else {
                            const result = await ajaxRequest.post('http://localhost:3000/activity/add', {
                                title: this.ruleForm.title,
                                author: this.ruleForm.author,
                                beginTime: this.ruleForm.date[0].getTime(),
                                endTime: this.ruleForm.date[1].getTime(),
                                content: this.ruleForm.content,
                                hostUnit: this.ruleForm.hostUnit
                            })                 
                            if (result.code === 0) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success',
                                    onClose: () => {
                                        this.$router.push('/activity/list')
                                    }
                                })
                            } else {
                                this.$message({
                                    message: '添加失败',
                                    type: 'error'
                                })
                            }
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            contentUpdate(content) { // 子富文本编辑器修改
                this.ruleForm.content = content
            },
            updated () {
                console.log(this.ruleForm.date)
            }
        }
    }
</script>