<template>
    <el-card class="box-card">
        <el-tabs v-model="activeName" v-on:tab-click="handleClick">
            <el-tab-pane label="团课预约" name="tuanke"> 
                <div slot="header" class="clearfix">
                    <span>预约总计 {{tuankeTotal}} 次</span>
                </div>
                <el-table :data="tuankeList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column width="150" label="卡号">
                        <span>{{card}}</span>
                    </el-table-column>  
                    <el-table-column prop="course_name" width="200" label="预约的课程">
                    </el-table-column>  
                    <el-table-column prop="teacher_name" width="130" label="老师">
                    </el-table-column> 
                    <el-table-column prop="book_time" width="180" label="预约时间">
                    </el-table-column> 
                    <el-table-column width="180" label="上课时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.start_date && scope.row.start_date.slice(0, 11)}} {{scope.row.start_time}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column prop="course_name" width="fit" label="预约状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.book_status == 1">已预约</span>
                            <span v-else>已取消</span>
                        </template>
                    </el-table-column>  
                    <el-table-column width="fit" label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.book_status == 1 && !scope.row.order_status" size="mini" type="primary" @click="chexiao(scope.row)">取消预约</el-button>
                            <span v-if="scope.row.order_status == 2">已取消</span>
                            <span v-else-if="scope.row.order_status == 1">已消费</span>
                        </template>
                    </el-table-column>  
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="私教课预约" name="sijiao">
                <div slot="header" class="clearfix">
                    <span>预约总计 {{sijiaoTotal}} 次</span>
                </div>
                <el-table :data="sijiaoList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column width="150" label="卡号">
                        <span>{{card}}</span>
                    </el-table-column>  
                    <el-table-column width="200" label="预约的项目">
                        <span>私教课</span>
                    </el-table-column>  
                    <el-table-column prop="teacher_name" width="150" label="老师">
                    </el-table-column> 
                    <el-table-column   width="180" label="课程时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.date && scope.row.date.slice(0, 11)}} {{scope.row.start_time}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column prop="course_name" width="80" label="预约状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.book_status == 1">已预约</span>
                            <span v-else>已取消</span>
                        </template>
                    </el-table-column>  
                    <el-table-column width="fit" label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.book_status == 1 && !scope.row.order_status" size="mini" type="primary" @click="chexiao(scope.row)">撤销预约</el-button>
                            <span v-if="scope.row.order_status == 2">已取消</span>
                            <span v-else-if="scope.row.order_status == 1">已消费</span>
                        </template>
                    </el-table-column>  
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>

</template>
<script>
const book = require('@/api/book');
export default {
    props:[
        'card'
    ],
    data() {
        return {
            tuankeList: [],
            activeName: "tuanke",
            tuankeTotal: 0,
            sijiaoTotal: 0,
            sijiaoList:[],
            book_course_type: 1
        }
    },
    methods: {
        async fetchBooks() {
            let res = await book.list({
                book_card_no: this.card,
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
        async chexiao(row) {
            let res = await book.cancel({
                id: row.id,
            });
            if (res.code == 200) {
                this.$message.success(res.msg);
                this.fetchBooks();
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

</style>