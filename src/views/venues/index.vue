<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1000px; padding:20px 0 0 20px">
            <el-form-item required label="场馆名称">
                <el-input placeholder="场馆名称" v-model="form.name"></el-input>
            </el-form-item>
            <!-- 场馆图片 -->
            <el-form-item required label="场馆主题图片">
                <img  class="cover" v-if="form.cover" :src="form.cover" />
                <div class="empty_pic" v-else>建议尺寸850×350，gif、jpg、jpeg、png格式，图片小于5M。</div>
                <el-upload
                    class="upload_box"
                    action="fakeaction"
                    :show-file-list="false"
                    :auto-upload="true"
                    :http-request="uploadSectionFile">
                    <el-button type="info">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">建议尺寸850×350，gif、jpg、jpeg、png格式，图片小于5M。</div>
                </el-upload>
            </el-form-item>
            <el-form-item required label="营业时间">
                <el-input placeholder="例如：周一至周日 09:30-18:30" v-model="form.time"></el-input>
            </el-form-item>
            <el-form-item required label="环境设施">
                <el-checkbox-group v-model="checkedEnvs" @change="handleEnvsChange">
                    <el-checkbox v-for="item in envs" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item required label="场馆地址">
                <el-input placeholder="场馆地址" v-model="form.adress"></el-input>
            </el-form-item>
            <el-form-item required label="交通说明">
                <el-input placeholder="例如：距离566公交站300米即到" v-model="form.traffic"></el-input>
            </el-form-item>
            
            <el-form-item class="UEditor" required label="描述内容">
                <VueUeditorWrap v-model="form.des" :config="ueConfig" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
const venues = require('@/api/venues');
import VueUeditorWrap from 'vue-ueditor-wrap';
import {UPLOADBASEURL, UEDITOR_DOMAIN} from "@/config";

export default {
    components: {
        VueUeditorWrap
    },
    data() {
        return {
            cover: "",
            checkedEnvs:[],
            envs: [
                {
                    id: 1,
                    name: "沙发座"
                },
                {
                    id: 2,
                    name: "免费WIFI"
                },
                {
                    id: 3,
                    name: "有停车场"
                },
                {
                    id: 4,
                    name: "储物柜"
                },
                {
                    id: 5,
                    name: "更衣室"
                },
                {
                    id: 6,
                    name: "淋浴房"
                }
            ],
            form: {
                name: "",
                env: "",
                des: "",
                time: "",
                cover: "",
                adress: "",
                traffic: ""
            },
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
            editStatus: false
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            let res = await venues.query();
            if (res.code == 200) {
                if (res.data) {
                    this.form = res.data;
                    this.editStatus = true
                    this.setCheckedEnvs(res.data.env)
                } else {
                    this.editStatus = false
                    this.$message.error("你还没有设置场馆的信息，恐怕用户不能找到您的位置，立即设置吧")
                }
            }
        },
        setCheckedEnvs(env) {
            if (!env) return;
            let envIds = env.split(',');
            var result = envIds.map(function(v) {
                return parseInt(v)
            });
            this.checkedEnvs = result;
        },
        async uploadSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            let res = await venues.uploadAloneCover(form);

            if (res.status == 200 && res.data.code != 200) {
                this.$message.error(res.data.msg)
                return;
            }

            this.form.cover = res.data.data.imagePath;
        },  
        async saveData() {
            let {
                name,
                env,
                time,
                cover,
                adress,
                traffic,
                des
            } = this.form;

            if (!name) {
                this.$message.error("请填写场馆名称")
                return;
            }
            if (!cover) {
                this.$message.error("请设置场馆主题图片")
                return;
            }
            if (!time) {
                this.$message.error("请填写营业时间")
                return;
            }
             if (!env) {
                this.$message.error("请选择环境设施")
                return;
            }
            if (!adress) {
                this.$message.error("请填写场馆地址")
                return;
            }
            if (!traffic) {
                this.$message.error("请填写场馆处交通说明");
                return;
            }

            let res = null;
            if (!this.editStatus) {
                res = await venues.add({
                    name,
                    des,
                    time,
                    cover,
                    adress,
                    traffic,
                    env
                });
            } else {
                res = await venues.update({
                    name,
                    des,
                    time,
                    cover,
                    adress,
                    traffic,
                    env
                });
            }
            
            if (res.code == 200) {
                this.editStatus = true;
                this.$message.success("数据保存成功");
            } else {
                this.$message.error("数据保存失败");
            }
        },
        handleEnvsChange(value) {
            let checkedCount = value.length;
            this.form.env = value.join(',')
        }
    }
}
</script>

<style scoped>
.empty_pic{
    color:#666;
    background: #ddd;
    width: 300px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    line-height: 24px;
    text-align: left;
    margin-bottom: 15px;
    font-size: 12px;
    padding: 30px;
    box-sizing: border-box;
}
.cover{
    margin-bottom: 15px;
    max-width: 600px;
}
 .UEditor{
    position: relative;
    z-index: 1;
}
</style>