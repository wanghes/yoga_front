<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>统计数据：会员卡总数 2 张</span>
        </div>
        <el-table :data="list" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
            <el-table-column width="200" label="卡号">
                <span>{{card}}</span>
            </el-table-column>  
            <el-table-column prop="card_name" width="200" label="会员卡名称">
            </el-table-column>  
            <el-table-column prop="course_name"  width="100" label="卡类型">
            </el-table-column>
            <el-table-column prop="course_name"  width="100" label="剩余">
            </el-table-column>  
            <el-table-column prop="course_name"  width="100" label="状态">
            </el-table-column>   
            <el-table-column prop="course_name"  width="100" label="创建时间">
            </el-table-column>   
            <el-table-column prop="course_name"  width="100" label="有效期">
            </el-table-column>   
            <el-table-column prop="course_name"  width="100" label="默认会员卡">
            </el-table-column>   
            <el-table-column  width="200" fixed="right" label="操作">
                <template>
                    <el-button type="danger" size="mini">删除</el-button>
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
        'card'
    ],
    data() {
        return {
            list:[],
            card_type_id:""
        }
    },
    methods: {
        async fetchData() {
            let res = await api.queryCard({
                card_no: this.card
            });
            if (res.code == 200) {
                
                this.card_type_id = res.data[0].card_type_id;
                console.log(this.card_type_id)
                this.fetchItems(this.card_type_id);
            }
        },
        async fetchItems(id) {
            let res = await card.list_by_card_id({
                card_id: id
            });
            if (res.code == 200) {
                this.list = res.data;
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>

</style>