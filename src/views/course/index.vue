<template>
    <div class="hello">
        <el-button-group class="btn_wrap">
            <el-button type="primary" @click="toAddCourse">新建单课</el-button>
        </el-button-group>
        <el-table :data="tableData" :header-cell-style="{'background-color': '#f9fbff', 'height': '80px','color': 'rgba(43,57,64,.85)','border-bottom': '1px #f0f0f0 solid', 'border-top': '1px #f0f0f0 solid'}">
            <el-table-column prop="course_cover" width="150" label="封面">
                <template slot-scope="scope">
                    <img class="cover" v-if="!scope.row.course_cover" :src="course_cover" />
                    <img class="cover" v-else :src="scope.row.course_cover" />
                </template>
            </el-table-column>
            <el-table-column prop="course_name" label="课程主题"></el-table-column>
            <el-table-column prop="course_style_all_name" label="课程形式"></el-table-column>
            <el-table-column label="课程状态">
                <template slot-scope="scope">
                    <el-tag type="danger" v-if="!scope.row.status">未上传</el-tag>
                    <el-tag type="info" v-if="scope.row.status==1">直播未开始</el-tag>
                    <el-tag type="success" v-if="scope.row.status==2">直播中</el-tag>
                    <el-tag type="warning" v-if="scope.row.status==3">直播结束</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="付费类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.pay_type==1">付费</span>
                    <span v-else>公开</span>
                </template>
            </el-table-column>
            <el-table-column prop="play_time" label="开播时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" style="margin-right: 10px;" plain @click="intoPlay(scope.row)">进入直播</el-button>
                    <el-link type="success" @click="intoEdit(scope.row)">编辑</el-link>
                </template>
            </el-table-column>
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
    const course_cover = require('@/assets/cover.png');
    export default {
        name: "CourseIndex",
        data() {
            return {
                tableData: [],
                pageSize:5,
                currentPage:1,
                total: 0,
                courseStyles: [],
                course_cover
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
                let styles = await course.getAllCourseStyle();
                let {list, total} = result.data;
                this.courseStyles = styles.data;
                this.setStyleCheck(list);
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
            },
            setStyleCheck(list) {
                let courseStyles = this.courseStyles;

                list.map((item) => {
                    courseStyles.forEach((it) => {
                        if (it.id == item.course_style) {
                            item.course_style_name = it.name
                        }
                        if (it.id == item.course_style_check) {
                            item.course_style_check_name = it.name
                        }
                    })
                    item.course_style_all_name=item.course_style_name+"/"+item.course_style_check_name;
                });
                
            },
            intoPlay(row) {
                let { course_id } = row;
                // console.log(row);
                this.$router.push({
                    path: '/course/detail/' + course_id
                })
            },
            intoEdit(row) {
                let { course_id } = row;
                // console.log(row);
                this.$router.push({
                    path: '/course/detail/' + course_id
                })
            },
        }
    };

</script>

<style scoped>
    .btn_wrap{
        padding-bottom: 20px;
    }
    .cover{
        width: 120px;
    }
    .first_left{

    }
</style>
