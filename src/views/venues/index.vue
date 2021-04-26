<template>
    <div class="wrap">
        <el-row :gutter="15" class="search_box">
            <el-col :span="4">
                <el-input width="200" v-model="form.phone" placeholder="填写手机号" clearable></el-input>
            </el-col>
            <el-col :span="4">
                <el-input width="200" v-model="form.username" placeholder="填写姓名" clearable></el-input>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="fetchData">查询</el-button>
            </el-col>
        </el-row>
        <el-divider></el-divider>
    </div>
</template>

<script>
 const venues = require('@/api/venues');
export default {
    data() {
        return {
            form: {
                username: "",
                phone: ""
            }
        }
    }
}
</script>

<style scoped>

</style>