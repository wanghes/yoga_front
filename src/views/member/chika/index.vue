<template>
    <div class="wrap">
        <el-row :gutter="15" class="search_box">
            <el-col :span="4">
                <el-select style="width:100%" v-model="sform.excutor" placeholder="全部会籍" @change="excutorChange" clearable>
                    <el-option
                        v-for="item in advisers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-input width="200" v-model="sform.name" placeholder="填写姓名" clearable></el-input>
            </el-col>
            <el-col :span="4">
                <el-input v-model="sform.phone" placeholder="填写手机" clearable></el-input>
            </el-col>
            
            <el-col :span="2">
                <el-button type="primary" @click="fetchData">查询</el-button>
            </el-col>
        </el-row>
        <el-divider></el-divider>


        <el-table :data="list">
            <el-table-column prop="name" width="150" label="姓名"></el-table-column>
            <el-table-column prop="phone" width="150" label="电话"></el-table-column>
            <el-table-column prop="sex" width="150" label="性别">
                <template slot-scope="scope">
                    <span v-if="scope.row.sex == 1">男</span>
                    <span v-else>女</span>
                </template>
            </el-table-column>
            <el-table-column prop="adviser_name" width="150" label="会籍顾问"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editItem(scope.row)">查看会员信息</el-button>
                    <el-button type="success" size="mini" @click="addCard(scope.row.id)">办卡</el-button>
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
    const api = require('@/api/member');
    const adviser = require('@/api/adviser'); // 会籍顾问
 
    export default {
        data() {
            return {
                list: [],
                advisers:[],
                pageSize:10,
                currentPage:1,
                total: 0,
                sform: {
                    excutor: "",
                    name:'',
                    phone: ""
                }
            }
        },
        methods: {
            async fetchData() {
                let {
                    excutor,
                    phone,
                    name
                } = this.sform;
                let res = await api.list({
                    pageSize: this.pageSize,
                    page: this.currentPage,
                    excutor,
                    type:2,
                    phone,
                    name
                });
                let { list, total } = res.data;
                this.list = list;
                this.total = total;
                this.fetchAdvisers()
            },
            async fetchAdvisers() {
                let res = await adviser.allList();
                let list = res.data;
                this.advisers = list;
            },
            excutorChange() {
                this.currentPage = 1;
                this.fetchData();
            },
            sexChange() {
                this.currentPage = 1;
                this.fetchData();
            },
            typeChange() {
                this.currentPage = 1;
                this.fetchData();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.fetchData();
            },
            refreshData() {
                this.visible = false;
                this.currentPage = 1;
                this.fetchData();
            },
            async deleteItem(id) {
                let res = await api.deleteItem({
                    id: id
                });
                if (res.code == 200) {
                    this.$message.success("操作成功");
                    this.reload();
                }
            },
            editItem(row) {
                this.$router.push({
                    path: "/member/detail/" + row.id,
                    query:{
                        edit: true
                    }
                })
            },
            addCard(member_id) {
                this.$router.push({
                    path: "/membercard/add/" + member_id
                })
            }
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
    .el-dropdown-link{
        
        margin-right: 10px;
       
    }
</style>
