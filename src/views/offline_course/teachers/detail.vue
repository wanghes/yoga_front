<template>
    <div class="wrap">
        <div class="top">
            <div class="top_left">
                <div class="head">
                    <img v-if="form.head" :src="form.head" alt="头像">
                    <img v-else :src="headDefault" alt="头像">
                </div>
                <div class="center">
                    <div class="item"><label>姓名：</label><span>{{form.name}}</span></div>
                    <div class="item"><label>昵称：</label><span>{{form.nickname}}</span></div>
                    <div class="item"><label>电话：</label><span>{{form.phone}}</span></div>
                </div>
                <div class="center_right">
                    <div class="item"><label>经验：</label><span>{{form.jingyan}}</span></div>
                    <div class="item"><label>入职时间：</label><span>{{form.join_date.slice(0, 10)}}</span></div>
                    <div class="item"><label>显示顺序：</label><span>{{form.order}}</span></div>
                </div>
            </div>
            <div class="btns">
                <el-button type="primary">编辑</el-button>
            </div>
        </div>
        <el-divider></el-divider>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="基本信息" name="first"> 
                <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
                    <el-form-item label="老师头像">
                        <img class="head_cover" v-if="form.head" :src="form.head" />
                        <img class="head_cover" v-else :src="headDefault" />
                        <el-upload
                            class="upload_box"
                            action="fakeaction"
                            :show-file-list="false"
                            :auto-upload="true"
                            :http-request="uploadSectionFile">
                            <el-button type="danger">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">建议尺寸100*100px，JPG、PNG、webp格式，图片小于5M。</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item required label="姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="form.nickname"></el-input>
                    </el-form-item>
                    <el-form-item required label="手机">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="入职时间">
                        <el-date-picker
                            v-model="form.join_date"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="生日">
                        <el-date-picker
                            v-model="form.birthday"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item  label="显示顺序">
                        <el-input-number v-model="form.order"></el-input-number>
                    </el-form-item>
                    <el-form-item label="是否支持私教">
                        <el-radio-group v-model="form.sijiao">
                            <el-radio :label="0">不支持</el-radio>
                            <el-radio :label="1">支持</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item required label="一句话描述">
                        <el-input v-model="form.des"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证照">
                        <img class="id_img" v-if="form.id_card" :src="form.id_card" />
                        <img class="id_img" v-else :src="idImg" />
                        <el-upload
                            class="upload_box"
                            action="action"
                            :show-file-list="false"
                            :auto-upload="true"
                            :http-request="uploadIdSectionFile">
                            <el-button type="danger">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">建议尺寸673*425，JPG、PNG图片小于5M。</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item required label="详细介绍">
                        <VueUeditorWrap class="UEditor" v-model="form.content" :config="ueConfig" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveData">保 存 数 据</el-button>
                        <el-button type="info" @click="cancelSubmit">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="评价" name="second"> 
              
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
const teacher = require('@/api/teacher');
const headCover = require('@/assets/head.png');
const idImg = require('@/assets/id.jpg');
import VueUeditorWrap from 'vue-ueditor-wrap';
import {UEDITOR_DOMAIN} from "@/utils/config"
import {dateFormat} from "@/utils/index";

export default {
     components: {
        VueUeditorWrap
    },
    data() {
        return {
            activeName: "first",
            headDefault: headCover,
            idImg: idImg,
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
                head: "",
                name: "",
                nickname: "",
                phone: "",
                jingyan: "",
                join_date: "",
                birthday: "",
                order: "",
                sijiao: 0,
                id_card: "",
                des: "",
                content: ''
            }
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const id = this.$route.params.id;
            const res = await teacher.query({id});
         
            this.form = res.data;
        },
        async uploadSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            let res = await teacher.uploadHead(form);
            this.form.head = res.data.data.imagePath;
        },
        async uploadIdSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("idcard", fileObj);
            let res = await teacher.uploadIdCard(form);
            this.form.id_card = res.data.data.imagePath;
        },
        cancelSubmit() {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.back(-1)
        },
        async saveData() {
            const id = this.$route.params.id;
            let {
                head,
                name,
                nickname,
                phone,
                jingyan,
                join_date,
                birthday,
                order,
                sijiao,
                id_card,
                des,
                content
            } = this.form;

            if (!name) {
                this.$message.error("老师姓名不能为空");
            } else if (!phone) {
                this.$message.error("老师手机号不能为空");
            } else if (order && order < 0) {
                this.$message.error("正确填写显示顺序");
            } else if (!des) {
                this.$message.error("请填写一句话描述");
            } else {
                if (join_date) {
                    join_date = dateFormat("YYYY-mm-dd HH:MM:SS",new Date(join_date));
                }
                if (birthday) {
                    birthday = dateFormat("YYYY-mm-dd HH:MM:SS",new Date(birthday));
                }
                
                let res = await teacher.update({
                    id,
                    head,
                    name,
                    nickname,
                    phone,
                    jingyan,
                    join_date,
                    birthday,
                    order,
                    sijiao,
                    id_card,
                    des,
                    content
                });

                if (res.code == 200) {
                    this.$store.dispatch('tagsView/delView', this.$route)
                    this.$router.replace({
                        path: "/offline/teacher"
                    });
                    
                } else {
                    Message.error("数据保存失败");
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
.top{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.top_left{
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.top_left .item{
    margin: 5px 0;
}
.top .head {
    width: 100px;
    height: 100px;
    margin-right: 20px;
}
.top .head  img {
    width:100%;
    height: 100%;
    border-radius: 50%;
}
.top .center {
    margin-right: 20px;
}
.top .center_right {
    margin-right: 20px;
}
.id_img{
    max-width: 673px;
    max-height: 425px;
}
.head_cover{
    max-width: 100px;
    max-height: 100px;
}
</style>