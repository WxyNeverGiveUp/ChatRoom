<template>
	<div id="app">
		<Socket></Socket>
			<el-container height="100%" direction="vertical">
				<el-header v-show='$store.state.user.isLogin'>
					<vheader></vheader>
				</el-header>
				<el-container>
					<el-aside width="201px" v-show='$store.state.user.isLogin'>
						<vside></vside>
					</el-aside>
					<el-main :class="{ 'main-bg': $store.state.user.isLogin }">
						<router-view/>
					</el-main>
				</el-container>
			</el-container>
	</div>
</template>

<script>
	import vside from './components/common/aside.vue'
	import vheader from './components/common/header.vue'
	import Socket from './components/common/socket.vue'
	export default {
		name: 'App',
		components: {
			vside,
			vheader,
			Socket
		},
	}
</script>

<style lang="less">
	@import './assets/css/reset.css';
	body {
		height: 100%;
		.el-table th.gutter{
			display: table-cell!important;
		}
	}
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		height: 100%;
		width:100%;
		background: url('./assets/images/background.jpg') no-repeat;
		background-position: 100%, 100%;
		overflow: hidden;
		background-size:cover;
	}
	.el-header {
		background-color: #B3C0D1;
		color: #333;
		line-height: 60px;
	}
	.el-aside {
		background-color: #fff;
		color: #333;
		line-height: 200px;
	}
	.el-main {
		color: #333;
	}
	.main-bg {
		background-color: #dde0e2;
	}
</style>
