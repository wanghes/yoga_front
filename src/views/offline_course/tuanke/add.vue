<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
            <el-form-item required label="团课项目名称">
                <el-input v-model="form.name"></el-input>
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
import {UEDITOR_DOMAIN} from "@/utils/config"
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
                name: "",
                tiyan: 0,
                cover: "",
                des: "",
                content: ''
            }
        }
    },
    mounted() {

    },
    methods: {
        add() {

        },
        async uploadSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            let res = await course.uploadTuankeCover(form);
            console.log(res)
            this.form.cover = res.data.data.imagePath;
        },
        async saveData() {
            let {
                name,
                tiyan,
                cover,
                des,
                content
            } = this.form;

            if (!name) {
                this.$message.error("团课名字不能为空");
            } else if (!cover) {
                this.$message.error("请上传课程封面");
            } else if (!des) {
                this.$message.error("请填写描述内容");
            } else if (!content) {
                this.$message.error("请填写课程内容");
            } else {
              
                let res = await course.add({
                    name,
                    tiyan,
                    cover,
                    des,
                    content
                });

                if (res.code == 200) {
                    this.$store.dispatch('tagsView/delView', this.$route)
                   
                    this.$router.replace({
                        path: "/offline/index"
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
</style>