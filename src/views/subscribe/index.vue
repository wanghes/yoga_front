<template>
    <div class="wrap">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="团课" name="first"> 
                <tuanke></tuanke>
            </el-tab-pane>
            <el-tab-pane label="班课" name="second"> 
                <banke></banke>
            </el-tab-pane>
            <el-tab-pane label="私教" name="third"> 
                <sijiao></sijiao>
            </el-tab-pane>
            <el-tab-pane label="体验课" name="four"> 
                <tiyan></tiyan>
            </el-tab-pane>
        </el-tabs>
    </div>
      
</template>
    
<script>
import tuanke from "./desk/tuanke";
import banke from "./desk/banke"
import sijiao from "./desk/sijiao"
import tiyan from "./desk/tiyan"
export default {
    components: {
        tuanke,
        banke,
        sijiao,
        tiyan
    },

    data() {
        return {
            activeName: "first",
        }
    },
    mounted() {
        
    },
    methods: {
    }
}
</script>

<style scoped>
    
</style>