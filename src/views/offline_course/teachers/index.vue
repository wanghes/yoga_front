<template>
    <div class="com_wrap">
        <div class="top_info">
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAdd">添加老师</el-button>
            </el-button-group>
            <div class="right_search">
                <label class="label">选择状态：</label>
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
                    placeholder="请填写老师 姓名/手机号"
                    clearable
                    @keyup.enter.native="nameChange"
                    @clear="nameChange"
                    v-model="searchName">
                    <i slot="suffix" @click="nameChange" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </div>

        <el-table :data="tableData" :header-cell-style="{'background-color': '#f9fbff', 'height': '80px','color': 'rgba(43,57,64,.85)','border-bottom': '1px #f0f0f0 solid', 'border-top': '1px #f0f0f0 solid'}">   
            <el-table-column prop="head" width="150" label="封面">
                <template slot-scope="scope">
                    <img class="head" v-if="!scope.row.head" :src="head" />
                    <img class="head" v-else :src="scope.row.head" />
                </template>
            </el-table-column>
            <el-table-column label="老师姓名" fit prop="name"></el-table-column>
            <el-table-column label="电话" fit prop="phone"></el-table-column>
            <el-table-column label="生日" width="130" prop="birthday">
                <template slot-scope="scope">
                    <span>{{scope.row.birthday.slice(0, 10)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="私教">
                <template slot-scope="scope">
                    <span v-if="scope.row.can_alone==1">支持</span>
                    <span v-else>不支持</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" @change="changeSwitchStatus(scope.row)"></el-switch>  
                </template>
            </el-table-column>
            <el-table-column prop="order" width="100" label="显示顺序"></el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button class="editbtn" type="success" size="mini" @click="manage(scope.row.id)">管理</el-button>
                    <el-popover
                        placement="top"
                        trigger="click"
                        :width="160">
                        <div style="margin-bottom: 10px;">
                            <span>你确定要删除老师吗？删除了就会彻底删除了。</span>
                        </div>
                        <div style="text-align: center; margin: 0">
                            <el-button type="primary" size="mini" @click="deleteItem(scope.row.id)">确定</el-button>
                        </div>
                        <template slot="reference">
                            <el-button size="mini" type="danger">删除</el-button>
                        </template>
                    </el-popover>    
                    
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
 const teacher = require('@/api/teacher');

export default {
    inject:['reload'], 
    data() {
        return {
            head: "",
            activeName: "first",
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
            status_selected: ""
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            let res = await teacher.list({
                name: this.searchName,
                pageSize: this.pageSize,
                page: this.currentPage,
                status: this.status_selected
            });
        
            let {list, total} = res.data;
            list.forEach(item => {
                item.status = item.status == 1 ? true : false;
            });

            this.tableData = list;
            this.total = total;
        },
        statusChange() {
            this.fetchData();
        },
        async changeSwitchStatus(row) {
            let res = await teacher.updateStatus({
                id: row.id,
                status: row.status ? 1 : 0
            });
            if (res.code) {
                this.$message.success("修改成功")
            }
        },
        nameChange() {
            this.fetchData();
        },
        toAdd() {
            this.$router.push({
                path: "/offline/teacher/add"
            })
        },
       
        handleCurrentChange(currentPage){
            this.currentPage = currentPage;
            this.fetData();
        },
        manage(id) {
            this.$router.push({
                path: "/offline/teacher/detail/" + id
            }) 
        },
        async deleteItem(id) {
            console.log(id)
            let res = await teacher.deleteTeacher({id});
            if (res.code == 200) {
                this.$message.success("删除成功");
                this.reload();
            } else {
                console.log(res);
            }    
        },
        async toggleStatus(id, status) {
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
    .head{
        width:50px;
        border-radius: 50%;
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