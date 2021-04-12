<template>
    <div class="wrap">
        <h3>06月02日 10:45-11:15 肩颈理疗 王大海 人数限制：1-5人</h3>
        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
            <el-tab-pane label="预约" name="first"> 
                
            </el-tab-pane>
            <el-tab-pane label="已预约" name="second"> 
                
            </el-tab-pane>
            <el-tab-pane label="已消费" name="third"> 
                
            </el-tab-pane>
        </el-tabs>
    </div>
      
</template>
    
<script>
export default {
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
                
            } else if (tab.paneName == "second") {
                
            } else if (tab.paneName == "third") {
                
            }
        }
    }
}
</script>

<style scoped>
    
</style>