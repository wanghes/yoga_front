<template>
    <el-card class="box-card">
        <el-tabs v-model="activeName" v-on:tab-click="handleClick">
            <el-tab-pane label="团课预约" name="tuanke"> 
                <h3 class="shuoming">
                    <span>预约总计 {{tuankeTotal}} 次</span>
                </h3>
                <el-table :data="tuankeList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column prop="book_card_no" width="150" label="卡号"></el-table-column>  
                    <el-table-column prop="name" width="120" label="用户"></el-table-column>  
                    <el-table-column prop="course_name" width="180" label="课程名字">
                    </el-table-column>  
                    <el-table-column  width="320" label="课程时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.start_date && scope.row.start_date.slice(0, 11)}} {{scope.row.start_time}}</span>
                            <span> ~ </span>
                            <span>{{scope.row.start_date && scope.row.start_date.slice(0, 11)}} {{scope.row.end_time}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column width="160" label="预约时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.book_time && scope.row.book_time.slice(0, 16)}}</span>     
                        </template>
                    </el-table-column> 
                    <el-table-column prop="course_name"  width="120" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.book_status == 1 && !scope.row.order_status">已预约</span>
                            <span v-else-if="scope.row.book_status == 2">预约取消</span>
                            <span v-else-if="scope.row.order_status == 2">订单已取消</span>
                            <span v-else-if="scope.row.order_status == 1">订单已消费</span>
                        </template>
                    </el-table-column>  
                    <el-table-column prop="remark" label="备注">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="私教课预约" name="sijiao">
                <h3 class="shuoming">
                    <span>预约总计 {{sijiaoTotal}} 次</span>
                </h3>
                <el-table :data="sijiaoList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column prop="book_card_no" width="150" label="卡号"></el-table-column>  
                    <el-table-column prop="name" width="120" label="用户">
                    </el-table-column>  
                    <el-table-column  width="180" label="课程名字">
                        <template slot-scope="scope">
                            <span>{{scope.row.teacher_name}} - 私教课</span>
                        </template>
                    </el-table-column> 
                    <el-table-column prop="course_name" width="320" label="课程时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.date && scope.row.date.slice(0, 11)}} {{scope.row.start_time}}</span>
                            <span> ~ </span>
                            <span>{{scope.row.date && scope.row.date.slice(0, 11)}} {{scope.row.end_time}}</span>
                        </template>
                    </el-table-column>  
                     
                    <el-table-column width="160" label="预约时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.book_time && scope.row.book_time.slice(0, 16)}}</span>     
                        </template>
                    </el-table-column> 
                    <el-table-column prop="course_name"  width="120" label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.book_status == 1 && !scope.row.order_status">已预约</span>
                            <span v-else-if="scope.row.book_status == 2">预约取消</span>
                            <span v-else-if="scope.row.order_status == 2">订单已取消</span>
                            <span v-else-if="scope.row.order_status == 1">订单已消费</span>
                        </template>
                    </el-table-column>  
                    <el-table-column prop="remark" fit label="备注">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>

</template>
<script>
const book = require('@/api/book');
export default {
    props: ['id'],
    data() {
        return {
            activeName:"tuanke",
            sijiaoList:[],
            sijiaoTotal: 0,
            tuankeList: [],
            tuankeTotal: [],
            book_course_type: 1
        }
    },
    methods: {
        async fetchBooks() {
            let res = await book.list({
                book_member_id: this.id,
                book_course_type: this.book_course_type
            });
          
            if (res.code == 200) {
                if (this.book_course_type == 2) {
                    this.sijiaoList = res.data.list;
                    this.sijiaoTotal = res.data.total;
                } else {
                    this.tuankeList = res.data.list;
                    this.tuankeTotal = res.data.total;
                }
            } else {
                console.log(res);
            }
        },
        handleClick(tab, event) {
            if (tab.name == 'tuanke') {
                this.book_course_type = 1
                this.fetchBooks();
            } else {
                this.book_course_type = 2
                this.fetchBooks();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.shuoming{
    font-size: 14px;
}
</style>