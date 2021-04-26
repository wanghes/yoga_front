<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
            <el-form-item required label="团课项目名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="限制预约时间">
                <el-radio-group v-model="form.order_limit_status" @change="changeLimit">
                    <el-radio :label="1">限制预约时间</el-radio>
                    <el-radio :label="0">不限制预约时间</el-radio>
                </el-radio-group>
                <div v-show="showLimit" class="limit_box">
                    <h5 class="tit">预约时间:</h5>
                    <el-radio-group v-model="form.order_limit_type" size="mini" @change="changeLimitType">
                        <el-radio :label="1" border>方案一</el-radio>
                        <el-radio :label="2" border>方案二</el-radio>
                        <el-radio :label="3" border>方案三</el-radio>
                    </el-radio-group>
                    <div class="d_box" v-show="type1">
                        <div class="item">
                            <span>提前</span>
                            <el-input class="duan_input" v-model="limits.tian"></el-input>
                            <span>天</span>
                        </div>
                        <div class="item">
                            <span>从</span>
                            <el-input class="duan_input" v-model="limits.prev"></el-input>
                            <span>点到</span>
                            <el-input class="duan_input" v-model="limits.next"></el-input>
                            <span>点接受预约</span>
                        </div>
                    </div>
                    <div class="d_box" v-show="type2">
                        <div class="item">
                            <span>提前</span>
                            <el-input class="duan_input" v-model="limits.tian"></el-input>
                            <span>天</span>
                        </div>
                        <div class="item">
                            <span>从</span>
                            <el-input class="duan_input" v-model="limits.next"></el-input>
                            <span>点后接受预约</span>
                        </div>
                    </div>
                    <div class="d_box" v-show="type3">
                        <!-- <div class="item">
                            <span>提前</span>
                            <el-input class="duan_input" v-model="limits.tian"></el-input>
                            <span>天</span>
                        </div> -->
                        <div class="item">
                            <span>开课前</span>
                            <el-input class="duan_input" v-model="limits.prev"></el-input>
                            <span>小时接受预约</span>
                        </div>
                    </div>
                    <h5 class="tit">取消预约:</h5>
                    <div class="d_box">
                        <span>开课前</span>
                        <el-input class="duan_input" v-model="form.cancle_limit_hour"></el-input>
                        <span>个小时可取消</span>
                    </div>
                    <h5 class="tit">预约截止:</h5>
                    <div class="d_box">
                        <span>开课前</span>
                        <el-input class="duan_input" v-model="form.order_limit_hour"></el-input>
                        <span>个小时截止</span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item required label="是否支持体验课">
                <el-radio-group v-model="form.tiyan">
                    <el-radio :label="0">不支持</el-radio>
                    <el-radio :label="1">支持</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--  课程封面 -->
            <el-form-item required label="团课封面">
                <img v-if="form.cover" :src="form.cover" />
                <img v-else :src="cover" />
                <el-upload
                    class="upload_box"
                    action="fakeaction"
                    :show-file-list="false"
                    :auto-upload="true"
                    :http-request="uploadSectionFile">
                    <el-button type="danger">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">建议尺寸800*500px，JPG、PNG、webp格式，图片小于5M。</div>
                </el-upload>
            </el-form-item>
            <el-form-item required label="团课描述">
                <el-input v-model="form.des"></el-input>
            </el-form-item>
            <el-form-item required label="团课内容">
                <VueUeditorWrap class="UEditor" v-model="form.content" :config="ueConfig" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
const course = require('@/api/agreeCourse');
const cover = require('@/assets/cover.png');
import VueUeditorWrap from 'vue-ueditor-wrap';
import {UEDITOR_DOMAIN} from "@/config"

export default {
     components: {
        VueUeditorWrap
    },
    data() {
        return {
            cover: cover,
            showLimit: true,
            ueConfig: {
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 640,
                // 初始容器宽度
                initialFrameWidth: '100%',
                autoFloatEnabled: false,
                // 上传文件接口
                serverUrl: `${UEDITOR_DOMAIN}/upload/ue_upload`,
                // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项
                UEDITOR_HOME_URL: '/static/UEditor/'
            },
            form: {
                id:"",
                name: "",
                tiyan: 0,
                cover: "",
                des: "",
                content: '',
                order_limit_status: 1,
                order_limit_type: 1,
                cancle_limit_hour: "",
                order_limit_hour: ""
            },
            limits: {
                tian: "",
                prev: "",
                next: ""
            },
            type1: true,
            type2: false,
            type3: false
        }
    },
    mounted() {
        this.fetData();
    },
    methods: {
        async fetData() {
            const id = this.$route.params.id;
            let result = await course.query({
                id
            });
            console.log(result.data)
            this.form = result.data;
            this.setLimit(result.data.date_time_limit)
            this.changeLimitType(result.data.order_limit_type);
        },
        setLimit(limitStyle) {
            if (limitStyle) {
                limitStyle = limitStyle.split(':');
            }
            if (limitStyle.length == 3) {
                let tian = limitStyle[0];
                let prev = limitStyle[1];
                let next = limitStyle[2];
                this.limits = {tian,prev,next}
            } else if (limitStyle.length == 2) {
                let tian = limitStyle[0];
                let next = limitStyle[1];
                this.limits = {tian,prev:'',next}
            } else if (limitStyle.length == 1) {
                let prev = limitStyle[0];
                this.limits = {prev}
            }
        },
        async uploadSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            let res = await course.uploadTuankeCover(form);
            this.form.cover = res.data.data.imagePath;
        },
        changeLimit(value) {
            if (value == 1) {
                this.showLimit = true
            } else {
                this.showLimit = false
            }
        },
        changeLimitType(value) {
            this.type1 = false;
            this.type2 = false;
            this.type3 = false;
            if (value == 1) {
                this.type1 = true
            } else if (value == 2) {
                this.type2 = true
            } else if (value == 3) {
                this.type3 = true
            }
        },
        async saveData() {
            const id = this.$route.params.id;
            let {
                name,
                tiyan,
                cover,
                des,
                content,
                order_limit_status,
                order_limit_type,
                cancle_limit_hour,
                order_limit_hour
            } = this.form;
             let date_time_limit = "";

            if (!name) {
                this.$message.error("团课名字不能为空");
                return;
            } 
            if (order_limit_status == 1) {
                if (order_limit_type == 1) {
                    if (!this.limits.tian || !this.limits.prev || !this.limits.next) {
                        this.$message.error("限制预约时间必填");
                        return;
                    }
                    date_time_limit = [this.limits.tian, this.limits.prev, this.limits.next].join(":");
                } else if (order_limit_type == 2) {
                    if (!this.limits.tian || !this.limits.next) {
                        this.$message.error("限制预约时间必填");
                        return;
                    }
                    date_time_limit = [this.limits.tian, this.limits.next].join(":");
                } else if (order_limit_type == 3) {
                    if (!this.limits.next) {
                        this.$message.error("限制预约时间必填");
                        return;
                    }
                    date_time_limit = [this.limits.prev].join(":");
                }

                if (!cancle_limit_hour) {
                    this.$message.error("取消预约必填");
                    return
                }
                if (!order_limit_hour) {
                    this.$message.error("预约截止必填");
                    return;
                }

                if (order_limit_hour > this.limits.prev) {
                    this.$message.error("预约截止时间必须小于预约时间");
                    return
                }
            } 
            if (!cover) {
                this.$message.error("请上传课程封面");
            } else if (!des) {
                this.$message.error("请填写描述内容");
            } else if (!content) {
                this.$message.error("请填写课程内容");
            } else {
              
                let res = await course.update({
                    id,
                    name,
                    tiyan,
                    cover,
                    des,
                    content,
                    date_time_limit,
                    order_limit_status,
                    cancle_limit_hour,
                    order_limit_type,
                    order_limit_hour
                });

                if (res.code == 200) {
                    this.$store.dispatch('tagsView/delView', this.$route)
                    this.$router.replace({
                        path: "/offline/index",
                        query:{
                            name: "tuanke"
                        }
                    });
                    
                } else {
                    Message.error("数据更新失败");
                }
            }
        }
    }
}
</script>

<style scoped>
.UEditor{
    position: relative;
    z-index: 1;
}
.el-form-item--medium .el-form-item__content{
    line-height: 18px;
}
.limit_box{
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #efefef;
}
.d_box{
    margin-top: 15px;
    padding: 20px;
    background: #f2f2f2;
    border: 1px solid #efefef;
}
.d_box .item {
    margin-bottom: 15px;
}
.duan_input{
    display: inline-block;
    width: 80px;
    margin: 0 10px;
}
.tit{
    line-height: 1;
    font-size: 14px;
    font-weight: normal;
}
</style>