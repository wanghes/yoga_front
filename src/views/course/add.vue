<template>
    <div class="wrap" style="height: 600px;">
        <el-tabs v-model="activeName" tab-position="left" style="height: 100%"   @tab-click="handleClick">
            <!-- <el-tab-pane v-for="(item, i) in main_course_styles" :key="i" :label="item.name"></el-tab-pane> -->
            <el-tab-pane label="视频录播" name="2">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>适用特点</span>
                    </div>
                    <div class="text item">1、以录制为主的上课模式</div>
                    <div class="text item">2、适合专业性强内容</div>
                    <div class="text item">3、支持免费试听</div>
                    <div class="text item">4、课程重复利用率高</div>
                    <div class="text item">5、支持单课、系列课、打卡</div>
                </el-card>
                <el-radio-group class="group" v-model="sub_course_style" @change="changeRadio">
                    <el-radio v-for="(item, index) in sub_course_styles" :key="index" :label="item.name" border></el-radio>
                </el-radio-group>
                <div class="btn_wrap">
                    <el-button type="primary">创建课程</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="音频录播" name="3">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>适用特点</span>
                    </div>
                    <div class="text item">1、以录制为主的上课模式</div>
                    <div class="text item">2、配合语音多媒体教学</div>
                    <div class="text item">3、知识直达效率更高</div>
                    <div class="text item">4、支持单课、系列课、打卡课程</div>
                </el-card>
                <el-radio-group class="group" v-model="sub_course_style" @change="changeRadio">
                    <el-radio v-for="(item, index) in sub_course_styles" :key="index" :label="item.name" border></el-radio>
                </el-radio-group>
                <div class="btn_wrap">
                    <el-button type="primary">创建课程</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    const course = require('@/api/course');
    export default {
        name: "CourseAdd",
        data() {
            return {
                activeName: "2",
                main_course_styles: [],
                sub_course_styles: [],
                main_course_style: null,
                sub_course_style: null
            }
        },
        mounted() {
            this.getMCStyle();
        },
        methods:{
            async getMCStyle() {
                let res = await course.getMainCourseStyle();
                this.main_course_styles = res.data;
                this.getSCStyle();
            },
            async getSCStyle() {
                let res = await course.getSubCourseStyle({
                    id: this.activeName
                });
                this.sub_course_styles = res.data;
            },
            handleClick(tab, event){
                // console.log(tab, event);
                this.getSCStyle();
            },
            changeRadio(val) {
                console.log(val)
            }
        }
    };

</script>

<style scoped>
.wrap{
    height: 100%;
}
.group{
    margin: 50px auto 0;
    width: 100%;
    text-align: center;
}
.btn_wrap{
    padding-top: 120px;
    text-align: center;
}
</style>
