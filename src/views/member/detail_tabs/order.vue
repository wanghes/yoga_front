<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>共有 {{total}} 笔交易</span>
        </div>
        <el-table :data="list" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
            <el-table-column width="200" label="交易类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">发卡</span>
                    <span v-else>未知</span>
                </template>
            </el-table-column>  
            <el-table-column  width="200" label="交易日期">
                <template slot-scope="scope">
                    <span>{{scope.row.bill_date && scope.row.bill_date.slice(0 , 11)}}</span>
                </template>
            </el-table-column>  
            <el-table-column width="100" label="交易金额">
                 <template slot-scope="scope">
                    <span>{{scope.row.bill_amount && scope.row.bill_amount.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>
    </el-card>

</template>
<script>
const bill = require('@/api/bill');
export default {
    props:[
        'id'
    ],
    data() {
        return {
            list:[],
            total:0 
        }
    },
    methods: {
        async fetchData() {
            let res = await bill.list({
                member_id: this.id
            });
            if (res.code == 200) {
                this.list = res.data.list;
                this.total = res.data.total;
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>