<template>
    <div class="wrap">
        <div class="main_box">
            <el-row :gutter="15" class="search_box">
                <el-col :span="4">
                <el-select style="width:100%" v-model="form.pay_status" placeholder="支付状态" @change="payStatusChange" clearable>
                    <el-option
                        v-for="item in payStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select style="width:100%" v-model="form.status" placeholder="审核状态" @change="checkStatusChange" clearable>
                        <el-option
                            v-for="item in checkStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">    
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-input width="200" v-model="form.username" placeholder="填写姓名" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="form.phone" placeholder="填写手机" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-date-picker
                        style="width:100%"
                        v-model="form.apply_time"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="fetchData">查询</el-button>
                </el-col>
            </el-row>

            <el-table :data="tableData" :header-cell-style="{'background-color': '#f9fbff', 'height': '80px','color': 'rgba(43,57,64,.85)','border-bottom': '1px #f0f0f0 solid', 'border-top': '1px #f0f0f0 solid'}">
                <el-table-column prop="username" width="150" label="预约人">
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" width="130">
                </el-table-column>
                <el-table-column prop="course_name" label="课程名称" width="200">
                </el-table-column>
                <el-table-column prop="price" label="课时费"></el-table-column>
                <el-table-column prop="open" label="支付方式">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pay_type==1">付费</span>
                        <span v-else>免费</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" width="150">
                    <template slot-scope="scope">
                        <el-tag type="danger" effect="dark" v-if="scope.row.pay_status ==0">未支付</el-tag>
                        <el-tag type="success" effect="dark" v-else-if="scope.row.pay_status ==1">已支付</el-tag>
                        <el-tag type="info" effect="dark" v-else>已取消</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="预约时间" width="240"></el-table-column>
                <el-table-column label="审核状态" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status ==0">待审核</span>
                        <span v-else-if="scope.row.status ==1">已通过</span>
                        <span v-else>被驳回</span>
                    </template>
                </el-table-column>
                <el-table-column prop="apply_time" label="申请时间" width="240"></el-table-column>
                <el-table-column label="操作" fixed="right" width="100">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="checkAction(scope.row.id)">审核</el-button>
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

        <el-dialog title="审核体验课" width="30%" :visible.sync="visible">
            <el-radio-group v-model="radio">
                <el-radio :label="1">通过审核</el-radio>
                <el-radio :label="2">驳回</el-radio>
            </el-radio-group>
            <br/>
            <br/>
            <el-input v-if="radio==2"
                type="textarea"
                placeholder="请输驳回入内容"
                v-model="textarea"
                maxlength="100"
                show-word-limit
            ></el-input>
            <br/>
            <br/>
            <el-button type="primary" @click="okAction">确 定</el-button>
        </el-dialog>
    </div>
    
      
</template>

<script>
const tiyan = require('@/api/tiyan');
export default {
    data() {
        return {
            payStatus:[
                {
                    value: 0,
                    label: "未支付"
                },
                {
                    value: 1,
                    label: "已支付"
                },
                {
                    value: 2,
                    label: "已取消"
                }
            ],
            checkStatus:[
                {
                    value: 0,
                    label: "待审核"
                },
                {
                    value: 1,
                    label: "通过"
                },
                {
                    value: 2,
                    label: "驳回"
                }
            ],
            tableData: [],
            pageSize:10,
            currentPage:1,
            total: 0,
            visible: false,
            form: {
                pay_status: "",
                status: "",
                username: "",
                phone: "",
                apply_time: ""
            },
            checkId: "",
            radio: 1,
            textarea: ""
        }  
    },
    methods: {
        async fetchData() {
            let {
                pay_status,
                username,
                status,
                phone,
                apply_time
            } = this.form;

            let res = await tiyan.list({
                pageSize: this.pageSize,
                page: this.currentPage,
                pay_status,
                username,
                status,
                phone,
                apply_time
            });
            let {list,total} = res.data;
            this.tableData = list;
            this.total = total;
        },
        payStatusChange() {
            this.fetchData();
        },
        checkStatusChange() {
            this.fetchData();
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.fetchData();
        },
        checkAction(id) {
            this.checkId = id;
            this.visible = true;
        },
        async okAction() {
            let id = this.checkId;
            if (this.radio == 2 && !this.textarea) {
                this.$message.error('请填写驳回原因');
                return;
            } 
            let reason = this.radio == 2 ? this.textarea : "";

            let res = await tiyan.updateStatus({
                status: this.radio,
                id,
                reason
            });
            if (res.code == 200) {
                this.checkId = '';
                this.visible = false;
                this.fetchData();
            }
        }
    }
}
</script>

<style scoped>
.search_box{
    padding-bottom: 20px;
}
.el-date-editor.el-input{
    width: 180px;
}
</style>