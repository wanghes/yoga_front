<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <el-table :data="tableData" border>
            <el-table-column prop="date" label="日期" width="140">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import flvjs from "flv.js";
    const img = require('@/assets/1000.jpg');
    const user = require('@/api/user');

    export default {
        name: "HelloWorld",
        data() {
            const item = {
                date: '2016-05-02',
                name: '王小虎_' + parseInt(Math.random()*10000),
                address: this.$route.meta.title
            };
            return {
                tableData: Array(20).fill(item)
            };
        },
        computed: {
            msg: function () {
                return "Welcome to Your Vue.js App" + this.$route.meta.title
            },
        },
        mounted() {
            user.getHello({
                name: "初拟"
            })
        },
    };

</script>

<style scoped>
    h1,
    h2 {
        font-weight: normal;
        margin: 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .hello {
        padding: 15px;
    }
</style>
