<template>
    <div class="wrap">
        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
            <el-tab-pane label="全部会员" name="first"> 
                <all ref="all"></all>
            </el-tab-pane>
            <el-tab-pane label="持卡会员" name="second"> 
                <chika ref="chika"></chika>
            </el-tab-pane>
            <el-tab-pane label="意向会员" name="third"> 
                <yixiang ref="yixiang"></yixiang>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import all from "./all";
    import chika from "./chika";
    import yixiang from "./yixiang";

    export default {
        name: "RoomIndex",
        inject:['reload'],   
        components: {
            chika,
            yixiang,
            all
        },
        data() {
            return {
                activeName: "first"
            }
        },
        mounted() {
            
        },
        methods: {
            handleClick(targetName, action) {
                if (targetName.paneName == "first") {
                    this.$refs.all.fetchData();
                } else if (targetName.paneName == "second") {
                    this.$refs.chika.fetchData();
                } else if (targetName.paneName == "third") {
                    this.$refs.yixiang.fetchData();
                }
            }
        }
    };

</script>

<style scoped>
   
</style>
