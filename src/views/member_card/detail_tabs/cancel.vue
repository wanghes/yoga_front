<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>累计取消{{total}}次</span>
        </div>
        <el-table :data="list" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
            <el-table-column width="150" label="卡号">
                <span>{{card}}</span>
            </el-table-column>  
            <el-table-column prop="course_name" width="200" label="课程项目">
                <template slot-scope="scope">
                    <span v-if="scope.row.order_course_type == 1">(团课) {{scope.row.course_name}}</span>
                    <span v-else>私教课</span>
                </template>
            </el-table-column>  
            <el-table-column prop="teacher_name" width="150" label="老师">
            </el-table-column> 
            <el-table-column prop="course_name" width="200" label="上课时间">
                <template slot-scope="scope">
                    <span>{{scope.row.start_date && scope.row.start_date.slice(0, 11)}} {{scope.row.start_time}}</span>
                </template>
            </el-table-column>  
            <el-table-column prop="order_remark" fit label="备注">
            </el-table-column>
        </el-table>
    </el-card>
</template>
<script>
const order = require('@/api/order');
export default {
    props:['card'],
    data() {
        return {
            list:[],
            total: 0
        }
    },
    methods: {
        async fetchData() {
            let res = await order.list({
                order_card_no: this.card,
                order_status: 2
            });
            if (res.code = 200) {
                this.list = res.data.list;
                this.total = res.data.total;
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>