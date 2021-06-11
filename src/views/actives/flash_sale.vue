<template>
    <div class="wrap">
        <div class="top_info">
            <div class="left_search">
                <el-select :clearable="true" v-model="searchForm.status" placeholder="秒杀卡可售状态" @change="statusChange">
                    <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAdd">新建秒杀项</el-button>
            </el-button-group>
        </div>
         <el-table :data="list" :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
            <el-table-column label="秒杀图片" width="170">
                 <template slot-scope="scope">
                    <img width="150" :src="scope.row.cover">
                </template>
            </el-table-column>  
            <el-table-column prop="name" width="200" label="秒杀名称"></el-table-column>  
            <el-table-column prop="people" width="120" label="已秒杀的人数"></el-table-column>  
            <el-table-column prop="limit" width="180" label="总共限制秒杀的人数"></el-table-column>  
            <el-table-column width="150" label="旧价格(元)">
                <template slot-scope="scope">
                    <span>￥{{scope.row.old_price.toFixed(2)}}</span>
                </template>
            </el-table-column> 
            <el-table-column width="150" label="新价格(元)">
                <template slot-scope="scope">
                    <span>￥{{scope.row.now_price.toFixed(2)}}</span>
                </template>
            </el-table-column> 
            <el-table-column width="120" label="卡内余额">
                 <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">{{scope.row.times}}次</span>
                    <span v-else-if="scope.row.type == 6">{{scope.row.price}}元</span>
                    <span v-else-if="scope.row.type == 7">{{scope.row.hours}}小时</span>
                    <span v-else>{{scope.row.expire_date}}天</span>
                </template>
            </el-table-column>
            <el-table-column width="120" label="卡有效期(天)">
                <template slot-scope="scope">
                    <span v-if="scope.row.expire_date_on==1">{{scope.row.expire_date}}</span>
                    <span v-else>不限</span>
                </template>
            </el-table-column>  
           
            
            <el-table-column prop="over_time" width="180" label="秒杀截止日期"></el-table-column>  
            <el-table-column prop="status" fit label="秒杀可售状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" @change="changeSwitchStatus(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="editItem(scope.row.id)">编辑</el-button>
                    <el-popover
                        placement="top"
                        trigger="click"
                        :width="160">
                        <div style="margin-bottom: 10px;">
                            <span>你确定要删除该秒杀吗？</span>
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
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[15, 30, 50]"
                :page-size="pageSize"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
const api = require("@/api/flash_sale");
export default {
    data() {
        return {
            list:[],
            currentPage:1,
            pageSize:15,
            total: 0,
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
            searchForm: {
                status: ""
            }
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            let {
                status
            } = this.searchForm;

            let res = await api.list({
                pageSize: this.pageSize,
                page: this.currentPage,
                status
            });

            let {
                list, total
            } = res.data; 

            list.forEach(item => {
                item.status = item.status == 1 ? true : false;
            })

            this.list = list;
           
            this.total = total;
        },
        toAdd() {
            this.$router.push({
                path: "/actives/flash_sale/operate"
            })
        },
        editItem(id) {
            this.$router.push({
                path: "/actives/flash_sale/operate",
                query: {
                    id
                }
            })
        },
        async deleteItem(id) {
            let res = await api.deleteItem({
               id
            });
            if (res.code == 200) {
                this.$message.success(res.msg)
                this.fetchData();
            }
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage;
            this.fetchData();
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.fetchData();
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
            this.fetchData()
        },
    }
}
</script>

<style lang="scss" scoped>
.top_info{
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
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