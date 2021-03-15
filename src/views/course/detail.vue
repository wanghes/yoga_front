<template>
    <div class="wrap">
        <el-tabs v-model="activeName">
            <el-tab-pane label="课程编辑" name="first"> 
                <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
                    <!--  课程主题 -->
                    <el-form-item required label="课程主题" :label-width="formLabelWidth">
                        <el-input v-model="form.course_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <!--  课程封面 -->
                    <el-form-item required label="课程封面" :label-width="formLabelWidth">
                        <img v-if="form.course_cover" :src="form.course_cover" />
                        <img v-else :src="course_cover" />
                        <el-upload
                            class="upload_box"
                            action="fakeaction"
                            :show-file-list="false"
                            :auto-upload="true"
                            :http-request="uploadSectionFile"
                            :on-success="handleUploadSuccess">
                            <el-button type="danger">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">建议尺寸800*500px，JPG、PNG、webp格式，图片小于5M。</div>
                        </el-upload>
                    </el-form-item>
                    <!--  课程形式 -->
                    <el-form-item required label="课程形式" :label-width="formLabelWidth">
                        <el-tag type="info">{{all_course_style}}</el-tag>
                    </el-form-item>
                    <!--  收费类型 -->
                    <el-form-item required label="收费类型" :label-width="formLabelWidth">
                        <el-radio-group v-model="form.pay_type">
                            <div v-if="form.pay_type == 0">
                                <el-radio :label="1" disabled>付费</el-radio>
                                <el-radio :label="0">免费</el-radio>
                            </div>
                            <div v-else>
                                <el-radio :label="1">付费</el-radio>
                                <el-radio :label="0" disabled>免费</el-radio>
                            </div>
                        </el-radio-group>
                    </el-form-item>
                    <!--  上传视频 :http-request="uploadVideoFile"-->
                    <el-form-item required label="上传视频" :label-width="formLabelWidth" class="video_wrap">
                        <el-upload
                            :action="videoUpApi"
                            name="video"
                            :auto-upload="true"
                            :headers="videoExtraData"
                            :on-progress="uploadVideoProcess"
                            :before-upload="beforeUploadVideo"
                            :show-file-list="false"
                            :file-list="videoList"
                            :on-success="handleVideoSuccess">
                            <el-button type="danger">点击上传视频</el-button>
                            <div slot="tip" class="el-upload__tip">最大单次可上传文件大小在3GB以内的视频文件，单日最高上传30GB媒体文件视频文件格式支持3gp、avi、 flv、 mp4、 mpg、asf、 wmv、 mkv、 mov、webm</div>
                            <el-progress 
                                v-if="videoFlag == true" 
                                type="line"
                                :stroke-width="12" 
                                :percentage="videoUploadPercent" 
                                style="margin-top:10px; width: 500px"></el-progress>
                        </el-upload>
                        <div class="show_video" v-if="form.course_video">
                            <div class="v_inner" @click="lookVideo">
                                <i class="el-icon-caret-right icon" />
                                <!-- <svg-icon class="icon" icon-class="video"></svg-icon> -->
                            </div>
                            <div class="s_right">
                                <span>{{videoName}}</span>
                                <el-link type="success">已完成</el-link>
                            </div>
                        </div>

                    </el-form-item>
                    <!--  主讲人 -->
                    <el-form-item required label="主讲人" :label-width="formLabelWidth">
                        <el-input v-model="form.course_leader" autocomplete="off"></el-input>
                    </el-form-item>
                    <!--  主讲人介绍 -->
                    <el-form-item required label="主讲人介绍" :label-width="formLabelWidth">
                        <el-input v-model="form.leader_intro" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item class="UEditor" required label="课程内容" :label-width="formLabelWidth">
                        <!-- <VueUeditorWrap v-model="form.course_content" :config="ueConfig" @before-init="addCustomUpload" /> -->
                        <VueUeditorWrap v-model="form.course_content" :config="ueConfig" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveData">保 存 数 据</el-button>
                    </el-form-item>

                </el-form>
                
            </el-tab-pane>
        </el-tabs>

         <el-dialog title="播放视频" :visible.sync="visible"  width="40%">
             <video :src='form.course_video' controls width='100%' height='100%' autoPlay data-setup='{}'>
                <source :src='form.course_video'>
            </video>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    const course = require('@/api/course');
    const course_cover = require('@/assets/cover.png');
    import VueUeditorWrap from 'vue-ueditor-wrap';
    import {BASEURL, UEDITOR_DOMAIN} from "@/utils/config"
    import {
        getToken
    } from '@/utils/auth'

    import {
        Message
    } from 'element-ui';
    export default {
        name: "CourseAloneDetail",
        components: {
            VueUeditorWrap
        },
        data() {
            return {
                activeName: 'first',
                formLabelWidth: "130",
                course_cover,
                imageUrl: "",
                courseStyles:[],
                all_course_style:"",
                videoUploadPercent: 0,
                videoList:[],
                videoFlag: false,
                videoUpApi: BASEURL+"/admin/course/upload_video",
                videoExtraData: {
                    Authorization: `bearer ${getToken()}`
                },
                videoName: "",
                visible: false,
                ueConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 640,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    autoFloatEnabled: false,
                    // 上传文件接口
                    serverUrl: `${UEDITOR_DOMAIN}/admin/upload/ue_upload`,
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项
                    UEDITOR_HOME_URL: '/static/UEditor/'
                },
                form: {
                    course_name: "",
                    course_leader: "",
                    leader_intro: "",
                    course_cover: '',
                    pay_type:"",
                    course_type:"",
                    course_style: "",
                    course_style_check:"",
                    course_video: "",
                    course_content: ""
                }
            }
        },
        mounted() {
            this.fetData();
        },
        methods: {
            async fetData() {
                const id = this.$route.params.id;
                let result = await course.get_course({
                    id
                });
                let styles = await course.getAllCourseStyle();
                let courseStyles = styles.data;
            
                this.form = result.data;
                if (this.form.course_video) {
                    let arr = this.form.course_video.split('/');
                    this.videoName= arr[arr.length- 1];
                }
                this.setStyleCheck(courseStyles);
            },
            async saveData() {
                const id = this.$route.params.id;
                const {
                    course_name,
                    course_leader,
                    leader_intro,
                    course_cover,
                    course_video,
                    course_content
                } = this.form;
                if (!course_name) {
                    Message.error("课程主题不能为空");
                } else if (!course_cover) {
                    Message.error("请上传课程封面");
                } else if (!course_video) {
                    Message.error("请上传课程视频");
                } else if (!course_leader) {
                    Message.error("请填写主讲人");
                } else if (!leader_intro) {
                    Message.error("请填写主讲人介绍");
                } else if (!course_content) {
                    Message.error("请填写课程内容");
                } else {
                   let res = await course.done({
                        id,
                        course_name,
                        course_leader,
                        leader_intro,
                        course_cover,
                        course_video,
                        course_content
                    });

                    if (res.code == 200) {
                        this.$router.replace({
                            path: "/course/index"
                        });
                    } else {
                        Message.error("数据保存失败");
                    }
                    
                }
            },
            setStyleCheck(courseStyles) {
                let course_style_name = '';
                let course_style_check_name = '';
           
                courseStyles.forEach((it) => {
                    if (it.id == this.form.course_style) {
                        course_style_name = it.name
                    }
                    if (it.id == this.form.course_style_check) {
                        course_style_check_name = it.name
                    }
                }); 
                this.all_course_style = course_style_name+"/"+course_style_check_name;
            },
            async uploadSectionFile(param) {
                var fileObj = param.file;
                // FormData 对象
                var form = new FormData();
                // 文件对象
                form.append("file", fileObj);
                let res = await course.uploadAloneCover(form)
                // console.log( res.data.imagePath);
                this.form.course_cover = res.data.imagePath;
            },
            handleUploadSuccess(res, file){
               //  this.form.course_cover = URL.createObjectURL(file.raw);
            },
            //上传前回调
            beforeUploadVideo(file) {
                var fileSize = file.size / 1024 / 1024 < 2048;
                if (['video/mp4', 'video/3gp', 'video/flv', 'video/avi', 'video/wmv', 'video/mpeg', 'video/rmvb', 'video/mov','video/asf','video/webm'].indexOf(file.type) == -1) {
                    Message.error("请上传正确的视频格式");
                    return false;
                }
                if (!fileSize) {
                    Message.error("视频大小不能超过2GB");
                    return false;
                }
                this.isShowUploadVideo = false;
            },
            // todo 自定义上传专用
            uploadVideoFile(param){
                var fileObj = param.file;
                // FormData 对象
                var form = new FormData();
                // 文件对象
                form.append("video", fileObj);
                course.uploadVideo(form)
            },
            // 视频上传的进度处理
            uploadVideoProcess(event, file, fileList){
                this.videoFlag = true;
                this.videoUploadPercent = file.percentage.toFixed(0) * 1;
            },
            // 视频上传成功的 结果地址赋值
            handleVideoSuccess(res, file){
                this.videoFlag = false;
                this.videoUploadPercent = 0;
                this.form.course_video = "";
                if (res.code == 200) {
                    this.form.course_video = res.data.videoPath;
                    if (this.form.course_video) {
                        let arr = this.form.course_video.split('/');
                        this.videoName= arr[arr.length- 1];
                    }
                } else {
                    Message.error('视频上传失败，请重新上传！');
                }
            },
            lookVideo() {
                this.visible = true;
            },
            // todo
            addCustomUpload() {
                window.UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
                window.UE.Editor.prototype.getActionUrl = function(action) {
                    if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
                        return `${UEDITOR_DOMAIN}/admin/upload/ue_upload`;
                    } else if (action == 'uploadvideo') {
                        return `${UEDITOR_DOMAIN}/admin/upload/ue_upload`;
                    } else {
                        return this._bkGetActionUrl.call(this, action);
                    }
                }
            }
        }
    };

</script>

<style scoped>
    .btn_wrap{
        padding-bottom: 20px;
    }
    .cover{
        width: 150px;
    }
    
    .show_video{
        margin-top: 10px;
        width:500px;
        height: 100px;
        background-color:rgba(1,175,113,.05);
        display: flex;
        align-content: flex-start;
        align-items: center;
    }
    .s_right{
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-left: 15px;
        align-items: flex-start;
    }
    .s_right span:first-child{
        padding-bottom: 10px;
    }
    .v_inner{
        width: 70px;
        height: 70px;
        display: flex;
        margin-left: 15px;
        justify-content: center;
        align-items: center;
        background: rgba(43,57,64,.85);
    }
    .show_video  .icon{
        font-size: 30px;
        color:#fff;
    }
    .UEditor{
        position: relative;
        z-index: 1;
    }
</style>
