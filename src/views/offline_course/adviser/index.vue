<template>
    <div class="com_wrap">
        <div class="top_info">
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAdd">添加会籍</el-button>
            </el-button-group>
            <div class="right_search">
                <label class="label">选择状态：</label>
                <el-select v-model="form.status" placeholder="请选择" @change="statusChange" clearable>
                    <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                    class="input_search"
                    placeholder="请填写会籍姓名"
                    clearable
                    @keyup.enter.native="nameChange"
                    @clear="nameChange"
                    v-model="form.name">
                    <i slot="suffix" @click="nameChange" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-input
                    class="input_search"
                    placeholder="请填写会籍电话"
                    clearable
                    @keyup.enter.native="phoneChange"
                    @clear="phoneChange"
                    v-model="form.phone">
                    <i slot="suffix" @click="phoneChange" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </div>

        <el-table :data="tableData" :header-cell-style="{'background-color': '#f9fbff', 'height': '80px','color': 'rgba(43,57,64,.85)','border-bottom': '1px #f0f0f0 solid', 'border-top': '1px #f0f0f0 solid'}">   
            <el-table-column prop="head" width="150" label="头像">
                <template slot-scope="scope">
                    <img class="head" v-if="!scope.row.head" :src="head" />
                    <img class="head" v-else :src="scope.row.head" />
                </template>
            </el-table-column>
            <el-table-column label="会籍姓名" fit prop="name"></el-table-column>
            <el-table-column label="电话" fit prop="phone"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" @change="changeSwitchStatus(scope.row)"></el-switch>  
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button class="editbtn" type="success" size="mini" @click="manage(scope.row.id)">管理</el-button>
                    <el-popover
                        placement="top"
                        trigger="click"
                        :width="200">
                        <div style="margin-bottom: 10px;">
                            <span>你确定要删除会籍吗？</span>
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
const api = require('@/api/adviser');
const head = require('@/assets/huiji.jpg');
export default {
    inject:['reload'], 
    data() {
        return {
            head,
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
            pageSize:10,
            currentPage:1,
            total: 0,
            form: {
                status: 1,
                name :"",
                phone: ""
            }
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            let res = await api.list({
                name: this.form.name.trim(),
                phone: this.form.phone,
                pageSize: this.pageSize,
                page: this.currentPage,
                status: this.form.status
            });
        
            let {list, total} = res.data;
            list.forEach(item => {
                item.status = item.status == 1 ? true : false;
            });

            this.tableData = list;
            this.total = total;
        },
        async changeSwitchStatus(row) {
            let res = await api.updateStatus({
                id: row.id,
                status: row.status ? 1 : 0
            });
            if (res.code) {
                this.$message.success("修改成功")
            }
        },
        statusChange() {
            this.fetchData();
        },
        nameChange() {
            this.fetchData();
        },
        phoneChange() {
            this.fetchData();
        },
        toAdd() {
            this.$router.push({
                path: "/offline/adviser/add"
            })
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage;
            this.fetData();
        },
        manage(id) {
            this.$router.push({
                path: "/offline/adviser/edit/" + id
            }) 
        },
        async deleteItem(id) {
            console.log(id)
            let res = await api.deleteItem({id});
            if (res.code == 200) {
                this.$message.success("删除成功");
                this.reload();
            } else {
                console.log(res);
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
        border: 1px solid #ccc;
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