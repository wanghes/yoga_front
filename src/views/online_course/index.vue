<template>
    <div class="wrap">
        <div class="top_info">
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAddCourse">新建单课</el-button>
            </el-button-group>
            <div class="right_search">
                <label class="label">选择课程状态：</label>
                <el-select v-model="status_selected" placeholder="请选择" @change="statusChange" clearable>
                    <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                    class="input_search"
                    placeholder="请填写课程主题名称"
                    clearable
                    @keyup.enter.native="nameChange"
                    @clear="nameChange"
                    v-model="searchName">
                    <i slot="suffix" @click="nameChange" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </div>
        <el-table :data="tableData" :header-cell-style="{'background-color': '#f9fbff', 'height': '80px','color': 'rgba(43,57,64,.85)','border-bottom': '1px #f0f0f0 solid', 'border-top': '1px #f0f0f0 solid'}">
            <el-table-column prop="course_cover" width="150" label="封面">
                <template slot-scope="scope">
                    <img class="cover" v-if="!scope.row.course_cover" :src="course_cover" />
                    <img class="cover" v-else :src="scope.row.course_cover" />
                </template>
            </el-table-column>
            <el-table-column prop="course_name" label="课程主题" width="300">
                <template slot-scope="scope">
                    <span class="course_name">{{scope.row.course_name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="course_style_all_name" width="200" label="课程形式"></el-table-column>
            <el-table-column label="课程状态"  width="150">
                <template slot-scope="scope">
                    <el-tag type="danger" effect="dark" v-if="!scope.row.status">{{scope.row.status_label}}</el-tag>
                    <el-tag type="warning" effect="dark" v-if="scope.row.status==1">{{scope.row.status_label}}</el-tag>
                    <el-tag type="success" effect="dark" v-if="scope.row.status==2">{{scope.row.status_label}}</el-tag>
                    <!-- 先隐藏直播结束状态 -->
                    <!-- <el-tag type="info" v-if="scope.row.status==3">{{scope.row.status_label}}</el-tag> -->
                </template>
            </el-table-column>
            <el-table-column label="付费类型"  fit>
                <template slot-scope="scope">
                    <span v-if="scope.row.pay_type==1">付费</span>
                    <span v-else>免费</span>
                </template>
            </el-table-column>
            <el-table-column prop="pay_money" width="100" label="价格">
                <template slot-scope="scope">
                    <strong class="price_td">￥{{scope.row.pay_money}}</strong>
                </template>
            </el-table-column>
            <el-table-column prop="play_time" label="开播时间" width="200"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
                <template slot-scope="scope">
                    
                    <el-link type="success" style="margin-right: 10px;" @click="intoEdit(scope.row)">编辑课程</el-link>
                    <el-button type="success" @click="intoPlay(scope.row)">进入直播</el-button>
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
                searchName: "",
                pageSize:5,
                currentPage:1,
                total: 0,
                courseStyles: [],
                course_cover,
                status_selected: 10,
                status: [
                    {
                        value: 10,
                        label: "全部"
                    },
                    {
                        value: 0,
                        label: "未上传音视频"
                    },
                    {
                        value: 1,
                        label: "直播即将开始"
                    },
                    {
                        value: 2,
                        label: "直播中"
                    },
                    /*
                    {
                        value: 3,
                        label: "直播结束"
                    }
                    */
                ]
            }
        },
        async mounted() {
            let styles = await course.getAllCourseStyle();
            this.courseStyles = styles.data;
            this.fetData();
        },
        methods: {
            async fetData() {
                let result = await course.list({
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    status: this.status_selected,
                    course_name: this.searchName
                });
                
                let {list, total} = result.data;
                this.setStyleCheck(list);
                this.tableData = list;
                this.total = total;
            },
            statusChange() {
                this.currentPage = 1;
                this.fetData();
            },
            nameChange() {
                this.fetData();
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
                    item.course_style_all_name=item.course_style_name+"-"+item.course_style_check_name;
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
    .label{
        color:#666;
        font-weight: normal;
    }
    .top_info{
        display: flex;
        justify-content: space-between;
    }
    .course_name{
        color:#333;
    }
    .right_search{
        display: flex;
        align-items: center;
        position:relative;
        top: -10px;
    }
    .input_search {
        display: inline-block;
        width: 230px;
        margin-left:15px;
    }
    .price_td{
        color: red;
    }
</style>
