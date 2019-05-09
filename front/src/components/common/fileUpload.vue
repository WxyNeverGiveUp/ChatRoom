<template>
    <v-uploader @done="uploadDone" :before-upload='uploadBefore' button-text="选择文件后立即上传"></v-uploader>
</template>

<script>
export default {
    methods: {
        uploadDone(files){
            if(files && Array.isArray(files) && files.length){
                this.$message({
                    message: '上传头像成功',
                    type: 'success'
                })
            }
        },
        uploadBefore(id, name) {
            this.$message({
                message: '上传之前',
                type: 'success'
            })
            console.log(result)
        }
    }
}
</script>