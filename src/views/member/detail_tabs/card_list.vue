<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>统计数据：会员卡总数 {{total}} 张</span>
        </div>
        <el-table :data="list" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
            <el-table-column prop="card_no" width="200" label="卡号">
            </el-table-column>  
            <el-table-column prop="card_name" width="200" label="会员卡名称">
            </el-table-column>  
            <el-table-column width="100" label="卡类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">次卡</span>
                    <span v-else-if="scope.row.type == 6">储值卡</span>
                    <span v-else-if="scope.row.type == 7">小时卡</span>
                    <span v-else-if="scope.row.type == 2">年卡</span>
                    <span v-else-if="scope.row.type == 3">季卡</span>
                    <span v-else-if="scope.row.type == 4">月卡</span>
                    <span v-else-if="scope.row.type == 5">周卡</span>
                </template>
            </el-table-column>
            <el-table-column width="150" label="剩余">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">{{scope.row.surplus}}次</span>
                    <span v-else-if="scope.row.type == 6">{{parseFloat(scope.row.surplus).toFixed(2)}}元</span>
                    <span v-else-if="scope.row.type == 7">{{scope.row.surplus}}小时</span>
                    <span v-else>请查看有效期</span>
                </template>
            </el-table-column>  
            <el-table-column  width="100" label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">未开卡</span>
                    <span v-else-if="scope.row.status == 1">正常</span>
                    <span v-else>已用完</span>
                </template>
            </el-table-column>   
            <el-table-column width="150" label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time.slice(0, 11)}}</span>
                </template>
            </el-table-column>   
            <el-table-column  width="300" label="有效期">
                <template slot-scope="scope">
                    <span v-if="scope.row.expire_date_on == 1">{{scope.row.open_start_time.slice(0, 11)}} 至 {{scope.row.open_end_time.slice(0, 11)}}</span>
                    <span v-else>不限</span>
                </template>
            </el-table-column>   
            <el-table-column width="100" label="默认会员卡">
                <template slot-scope="scope">
                    <el-switch :disabled="scope.row.status == 0" v-model="scope.row.defaultStatus" @change="toggleDefault(scope.row)"></el-switch>
                </template>
            </el-table-column>   
            <el-table-column  width="200" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-popover
                        placement="top"
                        trigger="click"
                        :width="160">
                        <div style="margin-bottom: 10px;">
                            <span>你确定要删除吗？删除会将所有与改卡有关的记录删除了。</span>
                        </div>
                        <div style="text-align: center; margin: 0">
                            <el-button type="primary" size="mini" @click="deleteItem(scope.row.id)">确定</el-button>
                        </div>
                        <template slot="reference">
                            <el-button type="danger" size="mini">删除</el-button>
                        </template>
                    </el-popover>    
                    
                </template>
            </el-table-column>   
        </el-table>
    </el-card>

</template>
<script>
const api = require('@/api/member_card');
const card = require('@/api/card');
export default {
    props:[
        'id'
    ],
    data() {
        return {
            list:[],
            card_type_id:"",
            total: 0
        }
    },
    methods: {
        async fetchData() {
            let res = await api.query({
                member_id: this.id
            });
            if (res.code == 200) {
                res.data.list.forEach(item => {
                    item.defaultStatus = item.default == 0 ? false : true;
                })
                this.list = res.data.list
                this.total = res.data.total;
            }
        },
        async toggleDefault(row) {
            let res = await api.setDefaultCard({
                id: row.id,
                default: row.default == 0 ? 1 : 0
            });
            if (res.code == 200) {
                this.fetchData();
                this.$message.success(res.msg)
            } else {
                this.$message.error(res.msg);
                console.log(res);
            }
            
        },
        async deleteItem(id) {
            let res = await api.deleteItem({
                id
            });
            if (res.code == 200) {
                this.fetchData();
                this.$message.success(res.msg)
            } else {
                this.$message.error(res.msg);
                console.log(res);
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>