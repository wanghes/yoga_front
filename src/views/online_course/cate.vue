<template>
    <div class="hello">
        <div class="top_info">
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAddCate">新建分类</el-button>
            </el-button-group>
        </div>

        <el-table :data="cates">
            <el-table-column prop="name" width="150" label="课程分类"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click="fixCate(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="deleteCate(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

         <el-dialog title="创建分类" :visible.sync="visible">
            <el-form :model="form">
                <el-form-item required label="课程分类名字" :label-width="formLabelWidth">
                    <el-input v-model="form.cate_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="operateCate">完 成</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    const course = require('@/api/course');
    export default {
        name: "CourseIndex",
        inject:['reload'],   
        data() {
            return {
                formLabelWidth: '120px',
                cates: [],
                visible: false,
                form: {
                    id: '',
                    cate_name:''
                }
            }
        },
        mounted() {
            
            this.fetData();
        },
        methods: {
            async fetData() {
                let res = await course.getCates();
                this.cates = res.data;
            },
            toAddCate() {
                this.visible = true;
            },
            async fixCate(row) {
                this.visible = true;
                let res = await course.getCate({
                    id: row.id
                });
                let data = res.data;
            
                this.form = {
                    id: data.id,
                    cate_name: data.name
                }   
            },
            async operateCate() {
                let isEdit = false;

                if (!this.form.cate_name) {
                    this.$message.error("请填写分类名字");
                    return;
                }

                if (this.form.id) {
                    isEdit = true;
                }

                let res = null;
                if (isEdit) {
                    res = await course.renameCate({
                        id:this.form.id, 
                        name:this.form.cate_name
                    });
                } else {
                    res = await course.addCate({
                        name:this.form.cate_name
                    });
                }

                this.reload();

                this.visible = false;
                let id = res.data.insertId;
                if (id) {
                    this.$message.success("操作成功");
                }

            },
            async deleteCate(row) {
                let res = await course.deleteCate({
                    id: row.id,
                    name:this.form.cate_name
                });
                if (res) {
                    this.$message.success("操作成功");
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
        width: 120px;
    }
    .label{
        color:#666;
        font-weight: normal;
    }
    .top_info{
        display: flex;
        justify-content: space-between;
    }
    .course_name{
        color:#333;
    }
    .right_search{
        display: flex;
        align-items: center;
        position:relative;
        top: -10px;
    }
    .input_search {
        display: inline-block;
        width: 230px;
        margin-left:15px;
    
    }
    .el-dropdown-link{
        
        margin-right: 10px;
       
    }
</style>
