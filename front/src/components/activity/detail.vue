<template>
	<div class="article">
		<h1 class="arti-title">{{ activity.title }}</h1>
		<p class="arti-metas">
			<span>作者：{{ activity.author }}</span>
			<span>发布时间：{{ activity.createTime }}</span>
			<span>活动时间：{{ activity.beginTime }} 至 {{ activity.endTime }} </span>
		</p>
		<div v-html="activity.content">
		</div>
	</div>
</template>

<script>
import { ajaxRequest } from '../../util/request.js'
import { timeFormat } from '../../util/util'
export default {
	data () {
		return {
			id: '',
            activity: {
			}
		}
	},
  	async created() {
		this.id = this.$route.query.id
		const result = await ajaxRequest.post('http://localhost:3000/activity/getDetail', {id: this.id})    
		if (result.code === 0) {
			this.activity = {
				title: result.data.activity.title,
				author: result.data.activity.author,
				createTime: timeFormat(result.data.activity.createTime, false),
				beginTime: timeFormat(result.data.activity.beginTime, false),
				endTime: timeFormat(result.data.activity.endTime, false),
				content: result.data.activity.content
			}
		}
		console.log(this.activity)             
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
	.article {
		font-size: 24px;
		h1.arti-title { 
			line-height:28px; 
			padding-bottom: 8px; 
			font-size:21px; 
			color:#0066cc; 
			font-weight: normal; 
			text-align:center;
		}
		.arti-metas {
			padding-bottom: 15px;
			text-align: center;
			span {
				margin: 0 5px;
				font-size: 13px;
				color: #787878;
				font-family: "Microsoft YaHei";
			}
		}

	}
</style>
