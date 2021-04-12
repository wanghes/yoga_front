<template>
    <div class="wrap">
        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
            <el-tab-pane label="团课" name="first"> 
                <tuanke ref="tuanke"></tuanke>
            </el-tab-pane>
            <!-- <el-tab-pane label="班课" name="second" :lazy="true"> 
                <banke></banke>
            </el-tab-pane> -->
            <el-tab-pane label="私教" name="third"> 
                <sijiao ref="sijiao"></sijiao>
            </el-tab-pane>
            <el-tab-pane label="体验课" name="four"> 
                <tiyan ref="tiyan"></tiyan>
            </el-tab-pane>
        </el-tabs>
    </div>
      
</template>
    
<script>
import tuanke from "./desk/tuanke";
// import banke from "./desk/banke"
import sijiao from "./desk/sijiao"
import tiyan from "./desk/tiyan"
export default {
    components: {
        tuanke,
       // banke,
        sijiao,
        tiyan
    },

    data() {
        return {
            activeName: "first",
        }
    },
    mounted() {
        this.$refs.tuanke.getData();
    },
    methods: {
        handleClick(tab, action) {
            if (tab.paneName == "first") {
                this.$refs.tuanke.getData();
            } else if (tab.paneName == "third") {
                this.$refs.sijiao.getData();
            } else if (tab.paneName == "four") {
                this.$refs.tiyan.fetchData();
            }
        }
    }
}
</script>

<style scoped>
    
</style>