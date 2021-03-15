<template>
    <div class="wrap" style="height: 600px;">
        <el-tabs v-model="activeName" tab-position="top" type="card" style="height: 100%"   @tab-click="handleClick">
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
                    <el-button type="primary" @click="openCreateBox">创建课程</el-button>
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
                    <el-button type="primary" @click="openCreateBox">创建课程</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="一步创建课程" :visible.sync="visible">
            <el-form :model="form">
                <el-form-item required label="课程主题" :label-width="formLabelWidth">
                    <el-input v-model="form.course_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item required label="收费类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.pay_type" @change="changePayType">
                        <el-radio label="0" border>免费</el-radio>
                        <el-radio label="1" border>付费</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="showMoney" required label="金额" :label-width="formLabelWidth">
                    <el-input v-model="form.pay_money" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="createCourse">完 成</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const course = require('@/api/course');
    import {
        Message
    } from 'element-ui';
    export default {
        name: "CourseAdd",
        data() {
            return {
                activeName: "2",
                main_course_styles: [],
                sub_course_styles: [],
                main_course_style: null,
                sub_course_style: null,
                main_course_style_id: "",
                sub_course_style_id: "",
                visible: false,
                formLabelWidth: '120px',
                showMoney: false,
                form: {
                    course_name: "",
                    pay_type: "0",
                    pay_money: ""
                }
            }
        },
        mounted() {
            this.getMCStyle();
        },
        methods:{
            async getMCStyle() {
                let res = await course.getMainCourseStyle();
                this.main_course_styles = res.data;
                this.main_course_style_id = this.activeName;
                this.getSCStyle();
            },
            async getSCStyle() {
                let res = await course.getSubCourseStyle({
                    id: this.activeName
                });
                
                this.sub_course_styles = res.data;
                this.sub_course_style = null;
            },
            handleClick(tab, event){
                this.main_course_style_id = this.activeName;
                this.getSCStyle();
            },
            openCreateBox() {
                if (!this.sub_course_style_id) {
                    Message.error("请选择课程模式");
                    return;
                }
                this.visible = true;
            },
            async createCourse() {
                this.visible = false;
                let {
                    pay_type,
                    course_name,
                    pay_money
                } = this.form;

                let config = {
                    course_name,
                    pay_type: parseInt(pay_type),
                    pay_money,
                    course_type: 1,
                    course_style: parseInt(this.main_course_style_id),
                    course_style_check: parseInt(this.sub_course_style_id)
                }

                if (pay_type == 0) {
                    config.pay_money = 0
                }

            
                let res = await course.add(config);
                let id = res.data.insertId;
                this.$alert('新建单课成功', {
                    confirmButtonText: '去优化',
                    callback: action => {
                       this.$router.push({
                           path: '/course/detail/' + id
                       })
                    }
                });

            },
            changeRadio(val) {
                let childId = null;
                this.sub_course_styles.forEach((item) => {
                    if (item.name == val) {
                        childId = item.id;
                    }
                });
                this.sub_course_style_id = childId;
            },
            changePayType(val) {
                var val = parseInt(val)
                if (val == 1){
                    this.showMoney = true;
                } else {
                    this.showMoney = false;
                }
              
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
