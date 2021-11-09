<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
            <el-form-item required label="班课名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!--  老师头像 -->
            <el-form-item label="班课项目图片">
                <img v-if="form.cover" :src="form.cover" />
                <img v-else :src="cover" />
                <el-upload
                    class="upload_box"
                    action="fakeaction"
                    :show-file-list="false"
                    :auto-upload="true"
                    :http-request="uploadSectionFile">
                    <el-button type="danger">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">建议尺寸800*500px，gif、jpg、jpeg、png格式，图片小于5M。</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="是否支持在线购课">
                <el-radio-group v-model="form.if_online">
                    <el-radio :label="0">不支持</el-radio>
                    <el-radio :label="1">支持</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否支持在线购课">
                <el-table
                    border
                    size="small"
                    :data="prices"
                    style="width: 100%">
                    <el-table-column
                        prop="num"
                        label="课时数">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="店内价格（元）">
                    </el-table-column>
                    <el-table-column
                        prop="online_price"
                        label="在线售价（元）">
                    </el-table-column>
                    <el-table-column
                        width="180"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="editPrice(scope.row.id)">修改</el-button>
                            <el-button size="mini" @click="deletePrice(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button size="mini" @click="dialogVisible=true" type="info">添加价格</el-button>
            </el-form-item>
            <el-form-item required label="一句话描述">
                <el-input v-model="form.des"></el-input>
            </el-form-item>
            <el-form-item required label="详细介绍">
                <VueUeditorWrap class="UEditor" v-model="form.content" :config="ueConfig" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            </el-form-item>

        </el-form>


        <el-dialog title="添加已有单课" width="20%" :visible.sync="dialogVisible">
            <el-form :model="bundle" label-position="top">
                <input type="hidden" v-model="bundle.id" /> 
                <el-form-item  required label="课时数">
                    <el-input-number v-model="bundle.num" :min="1" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item required label="店内售价">
                    <el-input-number v-model="bundle.price" :min="1" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item required label="在线售价">
                    <el-input-number v-model="bundle.online_price" :min="1" controls-position="right"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddEditPrice">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const classCourse = require('@/api/classCourse');
const cover = require('@/assets/cover.png');
import VueUeditorWrap from 'vue-ueditor-wrap';
import {UEDITOR_DOMAIN} from "@/config";
import {getUUID} from "@/utils/index";

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
                if_online: 1,
                cover: "",
                des: "",
                content: ''
            },
            dialogVisible: false,
            bundle: {
                id: '',
                price: 1,
                online_price: 1,
                num: 1
            },
            prices: []
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
         async fetchData() {
            const id = this.$route.params.id;
            let result = await classCourse.query({
                id
            });

            this.form = result.data;
            
            let prices = await classCourse.queryPrice({
                class_id: this.form.id
            });
            this.prices = prices.data;
        },
       
        async uploadSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            let res = await classCourse.uploadBankeCover(form);
            this.form.cover = res.data.data.imagePath;
        },
        doAddEditPrice() {
            let hasId = false;
            let {
                price,
                online_price,
                num,
                id
            } = this.bundle;
            
            if (id) {
                hasId = true
            } else {
                id = getUUID();
            }

            

            if (!num) {
                this.$message.error("请填写课时数");
            } else if (!price) {
                this.$message.error("请填写店内售价");
            } else if (!online_price) {
                this.$message.error("请填写在线售价");
            } else {
                if (hasId) {
                    this.prices.forEach(item => {
                        if (item.id == id) {
                            item = this.bundle
                        }
                    })
                
                } else {
                    this.prices.push({
                        id,
                        price,
                        online_price,
                        num
                    });
                }
                
                this.bundle = {
                    id: '',
                    price: 1,
                    online_price: 1,
                    num: 1
                }
                this.dialogVisible = false
            }
        },
        async saveData() {
            const class_id = this.$route.params.id;
            
            let {
                cover,
                name,
                if_online,
                des,
                content
            } = this.form;

            let prices = this.prices;

            if (!class_id) {
                this.$message.error("class_id参数错误");
                return;
            }

            if (!name) {
                this.$message.error("班课名称不能为空");
            } else if (!cover) {
                this.$message.error("班课项目图片不能为空");
            } else if (!prices.length) {
                this.$message.error("请填写售价信息");
            } else {
                const config = {
                    id: class_id,
                    cover,
                    name,
                    if_online,
                    des,
                    content,
                    prices
                }
                
        
                let res = await classCourse.update(config);


                if (res.code == 200) {
                    this.$store.dispatch('tagsView/delView', this.$route)
                   
                    this.$router.replace({
                        path: "/offline/index",
                        query:{
                            name: "banke"
                        }
                    });
                    
                } else {
                    Message.error("数据保存失败");
                }
            }
        },
        editPrice(id) {
            this.prices.forEach((item, index) => {
                if (item.id == id) {
                    this.bundle = item;
                }
            })
            this.dialogVisible = true
        },
        deletePrice(id) {
            let idx = '';
            this.prices.forEach((item, index) => {
                if (item.id == id) {
                    idx = index
                }
            })
            this.prices.splice(idx, 1);
      
        }
    }
}
</script>

<style scoped>
.UEditor{
    position: relative;
    z-index: 1;
}
.el-dialog__footer{
    text-align: left !important;
}
</style>