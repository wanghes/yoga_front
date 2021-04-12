<template>
    <div class="wrap">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="团课项目" name="first"> 
                <tuanke></tuanke>
            </el-tab-pane>
            <!-- <el-tab-pane label="班课项目" name="second"> 
                <banke></banke>
            </el-tab-pane> -->
        </el-tabs>

    </div>
    
      
</template>
    
<script>
import tuanke from "./tuanke/index";
// import banke from "./banke/index";
export default {
    components: {
        tuanke,
      //  banke
    },
    data() {
        return {
            activeName: "first",
        }
    },
    mounted() {
        let name = this.$route.query.name;
        if (name == 'tuanke') {
            this.activeName = "first"
        } else if (name =='banke') {
            this.activeName = 'second';
        }
    },
    methods: {
    }
}
</script>

<style scoped>
    
</style>