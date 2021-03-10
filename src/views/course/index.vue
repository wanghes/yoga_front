<template>
    <div class="hello">
        <el-button-group class="btn_wrap">
            <el-button type="primary" @click="toAddCourse">新建单课</el-button>
        </el-button-group>
        <el-table :data="tableData">
            <el-table-column prop="course_name" label="课程主题"></el-table-column>
            <el-table-column prop="course_style" label="课程类型"></el-table-column>
            <el-table-column prop="course_style" label="课程形式"></el-table-column>
            <el-table-column prop="code" label="字典代码"></el-table-column>
        </el-table>

         <div style="text-align: center; margin: 30px 0;">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 30, 40, 50]"
                :page-size="pageSize"
                :total="total">
            </el-pagination>
         </div>
    </div>
</template>

<script>
    const course = require('@/api/course');
    export default {
        name: "CourseIndex",
        data() {
            return {
                tableData: [],
                pageSize:5,
                currentPage:1,
                total: 0
            }
        },
        mounted() {
            this.fetData();
        },
        methods: {
            async fetData() {
                let result = await course.list({
                    page: this.currentPage,
                    pageSize: this.pageSize
                });
                let {list, total} = result.data;
                console.log(result);
                this.tableData = list;
                this.total = total;
            },
            handleSizeChange: function(val) {
                this.pageSize = val;
                this.fetData();
            },
            handleCurrentChange(currentPage){
                this.currentPage = currentPage;
                this.fetData();
            },
            toAddCourse() {
                this.$router.push({
                    path: "/course/add"
                })
            }
        }
    };

</script>

<style scoped>
    .btn_wrap{
        padding-bottom: 10px;
    }
</style>
