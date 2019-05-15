<template>
	<el-form>
		<el-form-item>
			<el-upload
			ref='upload'
			class="avatar-uploader"
			accept="image/png"
			action="https://jsonplaceholder.typicode.com/posts/"
			:limit='limitNum'
			:auto-upload="false"
			:show-file-list="false"
			:on-change="fileChange">
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</el-form-item>
		<el-form-item>
			<el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
		</el-form-item>
	</el-form>
</template>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>
	import axios from 'axios'
	export default {
		data() {
			return {
				imageUrl: '',
				limitNum: 1,
				formLabelWidth: '80px',
				form: {
					file: ''
				},
				fileList: []
			}
		},
		methods: {
			fileChange(file, fileList) {
				console.log('change')
				const isPNG = file.raw.type === 'image/png'
				const isLt2M = file.raw.size / 1024 / 1024 < 2

				if (!isPNG) {
					this.$message.error('上传头像图片只能是 PNG 格式!')
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!')
				}
				if (isPNG && isLt2M) {
					this.form.file = file.raw
					this.imageUrl = URL.createObjectURL(file.raw)
				}
				return isPNG && isLt2M				
			},
			uploadFile() {
				let formData = new FormData()
				formData.append('file', this.form.file)
				formData.append('name', this.$store.state.user.name || '11')
				axios.post('http://localhost:3000/index/upload', 
					formData,
					{ "Content-Type": "multipart/form-data" }
				)
				.then(res => {
					this.imageUrl = ''
					this.$store.state.user.img = res.data.data.img
					this.$message({
						message: '图片上传成功',
						type: 'success'
					})
					this.$refs.upload.clearFiles()
				})
				.catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>