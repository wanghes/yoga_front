<template>
    <div class="wrap">
        <div class="top_info">
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAdd">添加一个</el-button>
            </el-button-group>
        </div>
        <el-table :data="list">
            <el-table-column width="300" label="图片">
                <template slot-scope="scope">
                    <img style="max-width: 280px" :src="scope.row.pic" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="url" width="300" label="地址"></el-table-column>
            <el-table-column width="200" label="所属页面">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">首页焦点图</span>
                    <span v-if="scope.row.type == 2">线上视频主页焦点图</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editItem(scope.row)">编辑</el-button>
                    <el-popover
                        placement="top"
                        trigger="click"
                        :width="160">
                        <div style="margin-bottom: 10px;">
                            <span>你确定要删除吗？</span>
                        </div>
                        <div style="text-align: center; margin: 0">
                            <el-button type="primary" size="mini" @click="deleteItem(scope.row.id)">确定</el-button>
                        </div>
                        <template slot="reference">
                            <el-button size="mini" type="danger">删除</el-button>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="title" width="40%" :visible.sync="visible">
            <el-form :model="form" label-position="top">
                <el-form-item required label="图片">
                    <img v-if="form.pic" style="max-width:100%;" :src="form.pic" />
                    <div class="empty_pic" v-else>建议尺寸280×180，JPG、PNG、webp格式，图片小于5M。</div>
                    <el-upload
                        class="upload_box"
                        action="fakeaction"
                        :show-file-list="false"
                        :auto-upload="true"
                        :http-request="uploadSectionFile">
                        <el-button type="danger">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">建议尺寸280×180，JPG、PNG、webp格式，图片小于5M。</div>
                    </el-upload>
                </el-form-item>
                <el-form-item required label="链接地址">
                    <el-input v-model="form.url" placeholder="请输入链接地址" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item required label="选择所属页面">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveData">保 存 数 据</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    const api = require('@/api/focus');
    export default {
        data() {
            return {
                list: [],
                visible: false,
                title: "添加项目",
                types:[
                    {
                        name: "首页",
                        id: 1
                    },
                    {
                        name: "线上课程首页",
                        id: 2
                    }
                ],
                editId: "",
                editStatus: false,
                form: {
                    pic: "",
                    type:1,
                    url: ""
                }
            }
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            async fetchData() {
                let res = await api.list();
                this.list = res.data;
            },
            async query() {
                let res = await api.query({
                    id: this.editId
                });
                if (res.code == 200) {
                    this.form = res.data;
                }
            },
            async uploadSectionFile(param) {
                var fileObj = param.file;
                var form = new FormData();
                form.append("file", fileObj);
                let res = await api.uploadCover(form);
                this.form.pic = res.data.data.imagePath;
            },
            toAdd() {
                this.visible = true;
                this.editStatus = false;
            },
            async saveData() {
                const { pic, type, url} = this.form;
                if (!pic) {
                    this.$message.error("请上传图片")
                    return;
                }
                if (!url) {
                    this.$message.error("请填写链接地址")
                    return;
                }
                if (!type) {
                    this.$message.error("请上选择所属页面")
                    return;
                }
                let res = null;
                if (!this.editStatus) {
                    res = await api.add({
                        pic,
                        url,
                        type
                    });
                } else {
                    let id = this.editId;
                    res = await api.update({
                        id:id,
                        pic,
                        url,
                        type
                    });
                }
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    this.fetchData();   
                }
                this.form = {
                    pic: "",
                    type:1,
                    url: ""
                }
                this.visible = false;
            },
            editItem(row) {
                this.visible = true;
                this.editStatus = true;
                this.editId = row.id;
                this.query();
                
            },
            async deleteItem(id) {
                let res = await api.deleteItem({
                    id: id
                });
                if (res.code == 200) {
                    this.$message.success("操作成功");
                    this.fetchData();
                }
            }
        }
    };

</script>

<style scoped>
    

.empty_pic {
	color: #666;
	background: #ddd;
	width: 280px;
	height: 180px;
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
