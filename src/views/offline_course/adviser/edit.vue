<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
            <!--  老师头像 -->
            <el-form-item label="会籍头像">
                <div class="head_wrap">
                    <div class="head">
                        <img v-if="form.head" :src="form.head" />
                        <img v-else :src="head" />
                    </div>
                    <el-upload
                        class="upload_box"
                        action="fakeaction"
                        :show-file-list="false"
                        :auto-upload="true"
                        :http-request="uploadSectionFile">
                        <el-button type="danger">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">建议尺寸200*200px，gif、jpg、jpeg、png格式，图片小于5M。</div>
                    </el-upload>
                </div>
            </el-form-item>
            <el-form-item required label="姓名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item required label="手机">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item required label="固定薪资">
                <el-input-number v-model="form.salary"></el-input-number>
            </el-form-item>
            <el-form-item required label="一句话描述">
                <el-input v-model="form.des"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
const api = require('@/api/adviser');
const head = require('@/assets/huiji.jpg');

export default {
    data() {
        return {
            head,
            form: {
                head: "",
                name: "",
                phone: "",
                des: "",
                salary: 0
            }
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const id = this.$route.params.id;
            const res = await api.query({id});
            this.form = res.data;
        },
        async uploadSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            let res = await api.uploadHead(form);
            this.form.head = res.data.data.imagePath;
        },
        async saveData() {
            const id = this.$route.params.id;
            let {
                head,
                name,
                phone,
                des,
                salary
            } = this.form;

            if (!name) {
                this.$message.error("会籍姓名不能为空");
            } else if (!phone) {
                this.$message.error("会籍手机号不能为空");
            } else {
                let res = await api.update({
                    id,
                    head,
                    name,
                    phone,  
                    des,
                    salary
                });

                if (res.code == 200) {
                    this.$store.dispatch('tagsView/delView', this.$route)
                    this.$router.replace({
                        path: "/offline/adviser"
                    }); 
                } else {
                    this.$message.error("数据保存失败");
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.UEditor{
    position: relative;
    z-index: 1;
}
.head_wrap{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .head{
        width: 200px;
        height: 200px;
        margin-bottom: 15px;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
</style>