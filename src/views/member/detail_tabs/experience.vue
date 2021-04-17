<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>体验课记录</span>
        </div>

        <div class="main_box">
    
            <el-table :data="tableData" :header-cell-style="{'background-color': '#f9fbff', 'height': '80px'}">
                <el-table-column prop="username" width="150" label="预约人">
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" width="130">
                </el-table-column>
                <el-table-column prop="course_name" label="课程名称" width="200">
                </el-table-column>
                <el-table-column prop="price" label="课时费"></el-table-column>
                <el-table-column prop="open" label="支付方式">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pay_type==1">付费</span>
                        <span v-else>免费</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" width="150">
                    <template slot-scope="scope">
                        <el-tag type="danger" effect="dark" v-if="scope.row.pay_status ==0">未支付</el-tag>
                        <el-tag type="success" effect="dark" v-else-if="scope.row.pay_status ==1">已支付</el-tag>
                        <el-tag type="info" effect="dark" v-else>已取消</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="预约时间" width="240"></el-table-column>
                <el-table-column label="审核状态" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status ==0">待审核</span>
                        <span v-else-if="scope.row.status ==1">已通过</span>
                        <span v-else>被驳回</span>
                    </template>
                </el-table-column>
                <el-table-column prop="apply_time" label="申请时间" width="240"></el-table-column>
            </el-table>
            <div style="text-align: center; margin: 30px 0;">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="total">
                </el-pagination>
            </div>
        </div>
       
    </el-card>

</template>
<script>
const tiyan = require('@/api/tiyan');
export default {
    props:[
        'name'
    ],
    data() {
        return {
            tableData: [],
            pageSize:10,
            currentPage:1,
            total: 0,
        }
    },
    mounted() {
        // console.log(this.name)
    },
    methods: {
        async fetchData() {
            let res = await tiyan.list({
                pageSize: this.pageSize,
                page: this.currentPage,
                username: this.name
            });
            let {list,total} = res.data;
            this.tableData = list;
            this.total = total;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.fetchData();
        },
    }
}
</script>

<style lang="scss" scoped>

</style>