<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
            <!--  老师头像 -->
            <el-form-item label="老师头像">
                <img class="avatar" v-if="form.avatar" :src="form.avatar" />
                <img class="avatar" v-else :src="cover" />
                <el-upload
                    class="upload_box"
                    action="fakeaction"
                    :show-file-list="false"
                    :auto-upload="true"
                    :http-request="uploadSectionFile">
                    <el-button type="danger">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">建议尺寸200*200px，JPG、PNG、webp格式，图片小于5M。</div>
                </el-upload>
            </el-form-item>
            <el-form-item required label="姓名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item required label="手机">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="form.nickname"></el-input>
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
            <el-form-item label="教学经验">
                <el-input v-model="form.jingyan"
                    type="textarea"
                    placeholder="填写教学经验" 
                    maxlength="255">
                </el-input>
            </el-form-item>
            <el-form-item label="一句话描述">
                <el-input v-model="form.des"
                    type="textarea"
                    placeholder="填写一句话描述" 
                    maxlength="100"></el-input>
            </el-form-item>
            <el-form-item label="身份证照">
                <img v-if="form.id_card" :src="form.id_card" />
                <div class="empty_pic" v-else>建议尺寸400×250，JPG、PNG、webp格式，图片小于5M。</div>
                <el-upload
                    class="upload_box"
                    action="action"
                    :show-file-list="false"
                    :auto-upload="true"
                    :http-request="uploadIdSectionFile">
                    <el-button type="danger">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">建议尺寸400×250，JPG、PNG图片小于5M。</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="详细介绍">
                <VueUeditorWrap class="UEditor" v-model="form.content" :config="ueConfig" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
const teacher = require('@/api/teacher');
const cover = require('@/assets/member_head.png');
import VueUeditorWrap from 'vue-ueditor-wrap';
import {UEDITOR_DOMAIN} from "@/config"
import {dateFormat} from "@/utils/index"

export default {
     components: {
        VueUeditorWrap
    },
    data() {
        return {
            cover: cover,
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
                avatar: "",
                name: "",
                nickname: "",
                phone: "",
                jingyan: "",
                join_date: "",
                birthday: "",
                order: 0,
                sijiao: 0,
                id_card: "",
                des: "",
                jinyan: "",
                content: ''
            }
        }
    },
    mounted() {

    },
    methods: {
        async uploadSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            let res = await teacher.uploadHead(form);
            this.form.avatar = res.data.data.imagePath;
        },
        async uploadIdSectionFile(param) {
            
            var fileObj = param.file;
            var form = new FormData();
            form.append("idcard", fileObj);
           
            let res = await teacher.uploadIdCard(form);
            this.form.id_card = res.data.data.imagePath;
        },
        async saveData() {
            let {
                avatar,
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
            } else {
                if (join_date) {
                    join_date = dateFormat("YYYY-mm-dd HH:MM:SS",new Date(join_date));
                }
                if (birthday) {
                    birthday = dateFormat("YYYY-mm-dd HH:MM:SS",new Date(birthday));
                }
                
                let res = await teacher.add({
                    avatar,
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
.avatar{
    height: 200px;
    width: 200px;
}
.empty_pic{
    color:#666;
    background: #ddd;
    width: 400px;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 24px;
    text-align: left;
    margin-bottom: 15px;
    font-size: 12px;
    padding: 30px;
    box-sizing: border-box;
}
</style>