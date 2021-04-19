<template>
    <div class="wrap" style="height: 600px;">
        <el-tabs v-model="activeName" tab-position="top" type="card" style="height: 100%" v-on:tab-click="handleClick">
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
                <el-radio-group class="group" v-model="course_type" @change="changeRadio">
                    <el-radio :label="1" border>无互动模式</el-radio>
                    <el-radio :label="2" border disabled>互动模式</el-radio>
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
                <el-radio-group class="group" v-model="course_type" @change="changeRadio">
                    <el-radio :label="3" border>无互动模式</el-radio>
                    <el-radio :label="4" border disabled>互动模式</el-radio>
                </el-radio-group>
                <div class="btn_wrap">
                    <el-button type="primary" @click="openCreateBox">创建课程</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="一步创建课程" :visible.sync="visible">
            <el-form :model="form">
                <el-form-item required label="课程名称" :label-width="formLabelWidth">
                    <el-input v-model="form.course_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item required label="收费类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.pay_type" @change="changePayType">
                        <el-radio :label="0" :disabled="pid!=0" border>免费</el-radio>
                        <el-radio :label="1" :disabled="pid!=0" border>付费</el-radio>
                        <el-radio :label="2" border>系列课</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="showMoney" required label="金额" :label-width="formLabelWidth">
                    <el-input v-model="form.pay_money"></el-input>
                </el-form-item>
                <el-form-item v-if="showXilie" required label="选择系列课" :label-width="formLabelWidth">
                    <el-select :disabled="pid != 0" v-model="form.pid" placeholder="请选择系列课">
                        <el-option
                            v-for="item in seriesCourses"
                            :key="item.id"
                            :label="item.course_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
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
    export default {
        name: "CourseAdd",
        data() {
            return {
                activeName: "2",
                visible: false,
                formLabelWidth: '120px',
                showMoney: false,
                pid: 0,
                showXilie: false,
                seriesCourses:[],
                course_type:'',
                form: {
                    course_name: "",
                    pay_type: "0",
                    pay_money: "",
                    pid: ""
                }
            }
        },
        mounted() {
            if (this.$route.query.pid) {
                this.pid = this.$route.query.pid;
                this.form.pid = parseInt(this.pid);
                this.form.pay_type = 2;
                this.getSeriesCourses();
                this.showXilie = true;
            }
        },
        methods:{
            async getSeriesCourses() {
                let res = await course.getSeriesCourses();
                this.seriesCourses = res.data;
            },
            openCreateBox() {
                if (!this.course_type) {
                    this.$message.error("请选择课程类型")
                    return;
                };
                this.visible = true;
            },
            async createCourse() {
                this.visible = false;
                let course_type = this.course_type;
                let {
                    pay_type,
                    course_name,
                    pay_money,
                    pid
                } = this.form;

                let config = {
                    course_type,
                    course_name,
                    pay_type: parseInt(pay_type),
                    pay_money,
                    pid
                }

                // 免费的
                if (pay_type == 0) {
                    config.pay_money = 0
                }

                if (this.pid) {
                    config.pid = this.pid;
                }
            
                let res = await course.add(config);
                let id = res.data.insertId;
                this.$alert('新建单课成功', {
                    confirmButtonText: '去优化',
                    callback: action => {
                       this.$store.dispatch('tagsView/delView', this.$route)
                       this.$router.push({
                           path: '/course/detail/' + id
                       });
                    }
                });
            },
            changeRadio(val) {
                this.course_type = val
            },
            handleClick() {
                this.course_type = "";
            },
            changePayType(val) {
                var val = parseInt(val)
                this.showMoney = false;
                this.showXilie = false;
                if (val == 1){
                    this.showMoney = true;
                } else if (val == 2) {
                    this.showXilie = true;
                    this.getSeriesCourses();
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
.money_box{
    width:300px;
    padding: 20px 0;
}
.money_box .inner_box{
     width:300px;
}
</style>
