<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>卡可消费团课项目</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <el-table :data="list" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
            <el-table-column width="200" label="卡号">
                <span>{{card}}</span>
            </el-table-column>  
            <el-table-column prop="card_name" width="200" label="卡名称">
            </el-table-column>  
            <el-table-column prop="course_name"  width="fit" label="卡可消费团课项目">
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