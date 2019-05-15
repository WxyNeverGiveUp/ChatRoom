<template>
	<div class="hello">
		<h1>{{ msg }}</h1>
	</div>
</template>

<script>
export default {
	name: 'myMain',
	data () {
		return {
            msg: '欢迎来到社团即时通讯管理平台'
		}
	},
  	created() {
		
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
	.hello {
		font-size: 24px;
	}
</style>
