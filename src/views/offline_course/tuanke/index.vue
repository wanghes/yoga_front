<template>
    <div class="com_wrap">
        <div class="top_info">
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAddCourse">新建团课</el-button>
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
                    placeholder="请填写课程名称"
                    clearable
                    @keyup.enter.native="nameChange"
                    @clear="nameChange"
                    v-model="searchName">
                    <i slot="suffix" @click="nameChange" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </div>

        <el-table :data="tableData" 
            v-loading = "isLoading"
            element-loading-background = "rgba(255, 255, 255, 0.8)"
            element-loading-text = "加载中，请稍后..."
            element-loading-spinner = "el-icon-loading"
            :header-cell-style="{'background-color': '#f9fbff', 'height': '80px','color': 'rgba(43,57,64,.85)','border-bottom': '1px #f0f0f0 solid', 'border-top': '1px #f0f0f0 solid'}">   
            <el-table-column label="课程名称" fit prop="name"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==1">正常</span>
                    <span v-else>禁用中</span>
                </template>
            </el-table-column>
            <el-table-column prop="update_time" width="240" label="更新时间"></el-table-column>
            <el-table-column label="操作" width="340" fixed="right">
                <template slot-scope="scope">
                    <el-link class="editbtn" type="success" @click="intoEdit(scope.row.id)">编辑</el-link>
                    <el-link type="success" v-if="scope.row.status==1" @click="toggleStatus(scope.row.id, false)">禁用</el-link>
                    <el-link type="success" v-else @click="toggleStatus(scope.row.id, true)">启用</el-link>
                </template>
            </el-table-column>
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
       
</template>
    
<script>
const course = require('@/api/agreeCourse');

export default {
    name: "tuanke",
    data() {
        return {
            activeName: "first",
            isLoading: true,
            status:[
                {
                    value: 1,
                    label: "启用"
                },
                {
                    value: 0,
                    label: "禁用"
                }
            ],
            tableData: [],
            searchName: "",
            pageSize:5,
            currentPage:1,
            total: 0,
            visible: false,
            status_selected: 1
        }
    },
    mounted() {
        this.fetchData()
   
    },
    methods: {
        async fetchData() {
            let res = await course.list({
                name: this.searchName,
                pageSize: this.pageSize,
                page: this.currentPage,
                status: this.status_selected
            });
            this.isLoading = false
            let {list, total} = res.data;
            this.tableData = list;
            this.total = total;
        },
        statusChange() {
            this.fetchData();
        },
        nameChange() {
            this.fetchData();
        },
        toAddCourse() {
            this.$router.push({
                path: "/offline/tuanke/add"
            })
        },
        intoEdit(id) {
            this.$router.push({
                path: "/offline/tuanke/edit/" + id
            })
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage;
            console.log(currentPage)
            this.fetchData();
        },
        async toggleStatus(id, status) {
            console.log(status)
            let res = await course.updateStatus({
                id,
                status
            });
            if (res.code == 200) {
                this.tableData.forEach(item=>{
                    if (item.id == id) {
                        item.status = status;
                    }
                });
            }
        }
    }
}
</script>

<style scoped>
    .btn_wrap{
        padding-bottom: 20px;
    }
    .label{
        color:#666;
        font-weight: normal;
    }
    .top_info{
        display: flex;
        justify-content: space-between;
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
</style>