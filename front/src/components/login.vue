<template>
    <div>
        这时登陆页面哦！！
    </div>
</template>

<script>
    import { ajaxRequest } from '../util/request.js'
    export default {
        name: 'login',
        data() {
            return {
                
            }
        },
        methods: {
            async getMemeber() {
                const result = await ajaxRequest.get('http://localhost:3000/index/getMembers', {roomId: 0})
                return result
            },
            hah() {
                console.log('13132131321')
            }
        },
        created() {
        },
        async mounted() {
            console.log(await this.getMemeber())
            this.hah()
        }
    }
</script>
