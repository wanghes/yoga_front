<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>共有 1条记录，累计消费 1.00次</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <el-table :data="list" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
            <el-table-column width="150" label="卡号">
                <span>{{card}}</span>
            </el-table-column>  
            <el-table-column prop="card_name" width="200" label="课程项目">
            </el-table-column>  
            <el-table-column prop="course_name"  width="fit" label="老师">
            </el-table-column> 
            <el-table-column prop="course_name"  width="fit" label="上课时间">
            </el-table-column>  
            <el-table-column prop="course_name"  width="fit" label="确认时间">
            </el-table-column>  
            <el-table-column prop="course_name"  width="fit" label="消费">
            </el-table-column>  
            <el-table-column prop="remark"  width="fit" label="备注">
            </el-table-column> 
            <el-table-column prop="remark"  width="fit" label="操作员">
            </el-table-column> 
            <el-table-column prop="remark"  width="fit" label="操作消费">
            </el-table-column>  
        </el-table>
    </el-card>

</template>
<script>
export default {
    props:['card'],
    data() {
        return {
            list:[]
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>

</style>