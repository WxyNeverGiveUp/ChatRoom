<template>
    <div>
        <el-table
            :data="tableData"
            style="width: 100%"
            :default-sort = "{prop: 'date', order: 'descending'}"
        >
            <el-table-column
            prop="date"
            label="日期"
            sortable
            width="180">
            </el-table-column>
            <el-table-column
            prop="company"
            label="公司"
            sortable>
            </el-table-column>
            <el-table-column
            prop="name"
            label="职位"
            :formatter="formatter">
            </el-table-column>
            <el-table-column
                prop="salary"
                label="薪资">
            </el-table-column>
            <el-table-column
                prop="city"
                label="城市">
            </el-table-column>
            <el-table-column
                prop="scale"
                label="规模">
            </el-table-column>
            <el-table-column
                prop="eduLevel"
                label="教育要求">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="openUrl(scope.row.url)">查看公司详情</el-button>
                    <el-button
                    size="mini"
                    type="primary"
                    @click="openUrl(scope.row.positionUrl)">查看岗位详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click='prePage()'>上一页</el-button>
            <el-button @click='nextPage()'>下一页</el-button>
        </div>
    </div>
</template>

<script>
  export default {
	name: 'jobs',
    data() {
        return {
            currentPage: 1,
            tableData: []
        }
    },
    methods: {
        formatter(row, column) {
            return row.name
        },
        openUrl(url) {
            window.open(url)
        },
        nextPage() {
            this.currentPage += 1
            this.getJobs(this.currentPage)
            console.log('当前页面数', this.currentPage)
        },
        prePage() {
            if (this.currentPage === 1) {
                alert('当前已经是第一页')
            } else {
                this.currentPage -= 1
                this.getJobs(this.currentPage)
            }
        },
        getJobs(page, size = 10) {
            this.$axios.get(`http://localhost:3000/index/lagou/jobs?pageNum=${page}&pageSize=${size}`).then((response) =>{          //这里使用了ES6的语法
                console.log(response)       //请求成功返回的数据
                this.tableData = []
                for (const job of response.data.data) {
                    this.tableData.push({
                        date: job.time,
                        company: job.company,
                        name: job.name,
                        salary: job.salary,
                        eduLevel: job.eduLevel,
                        city: job.city,
                        scale: job.scale,
                        url: job.url,
                        positionUrl: job.positionURL
                    })
                }
            }).catch((error) =>{
                console.log(error.response)
                console.log(error)       //请求失败返回的数据
            })
        }
    },
    created() {
		this.getJobs(this.currentPage)
	}
  }
</script>
