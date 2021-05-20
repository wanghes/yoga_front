<template>
    <div class="tab_detail">
        <div class="detail_info">
            <div class="list">
                <div class="item">
                    <label class="label">姓名：</label>
                    <span class="item_box">{{detail.name}}</span>
                </div>
                <div class="item">
                    <label class="label">手机：</label>
                    <span class="item_box">{{detail.phone}}</span>
                </div>
                <div class="item">
                    <label class="label">是否持卡：</label>
                    <span class="item_box">{{detail.member_card_count > 0 ? "有卡": "无卡"}}</span>
                </div>
                <div class="item">
                    <label class="label">会籍顾问：</label>
                    <span class="item_box">{{detail.adviser_name}}</span>
                </div>
                <div class="item">
                    <label class="label">性别：</label>
                    <span class="item_box">{{detail.sex == 1 ? "男":"女"}}</span>
                </div>
                <div class="item">
                    <label class="label">微信号：</label>
                    <span class="item_box">{{detail.weixin}}</span>
                </div>
                <div class="item">
                    <label class="label">积分：</label>
                    <span class="item_box">{{detail.point}}</span>
                </div>
                <div class="item">
                    <label class="label">来源：</label>
                    <span class="item_box">{{detail.origin}}</span>
                </div>
            </div>
            <div class="list">
                <div class="item">
                    <label class="label">生日：</label>
                    <span class="item_box">{{detail.birthday}}</span>
                </div>
                <div class="item">
                    <label class="label">地址：</label>
                    <span class="item_box">{{detail.address}}</span>
                </div>
                <div class="item">
                    <label class="label">备注信息：</label>
                    <span class="item_box item_box_remark">{{detail.remark}}</span>
                </div>
            </div>
        </div>
        <el-button type="primary" @click="editInfo">编辑</el-button>
        <el-dialog title="会员编辑" width="30%" :visible.sync="visible">
            <el-form :model="form" label-position="top">
                <el-form-item required label="会员姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item required label="会员电话">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item  label="会员性别">
                    <el-radio-group v-model="form.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item  label="会员生日">
                    <el-date-picker
                        v-model="form.birthday"
                        type="date"
                        placeholder="选择生日日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="微信号">
                    <el-input v-model="form.weixin"></el-input>
                </el-form-item>
                <el-form-item label="会员地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="会籍顾问">
                    <el-select v-model="form.excutor" placeholder="选择会籍顾问">
                        <el-option
                            v-for="item in advisers"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                </el-form-item>
            </el-form> 
            <el-button type="primary" @click="saveData">保 存 数 据</el-button>
        </el-dialog>
    </div>  
</template>

<script>
const api = require('@/api/member');
const adviser = require('@/api/adviser'); // 会籍顾问
import { dateFormatYMD } from '@/utils/index';

    export default {
        name: "detail_info",
        props: ['id', "edit"],
        data() {
            return {
                visible: false,
                detail:{},
                advisers:[],
                form: {
                    name: "",
                    phone: "",
                    sex: "",
                    excutor: "",
                    weixin: "",
                    birthday: "",
                    address: "",
                    remark: "",
                }
            }
        },
        mounted() {
            this.fetchAdvisers();
        },
        watch:{    
            id: function(a, b){ //a是value的新值，b是旧值
                this.fetchData();
            },
            edit: function(a, b){ //a是value的新值，b是旧值
                if (a) {
                    setTimeout(() => {
                        //this.visible = true;
                    }, 500) 
                    
                }
            }
        },
        methods: {
            async fetchData() {
                let res = await api.query({
                   id: this.id
                });
                const data = res.data;
                this.detail = data;
                this.form = data;
            },
            editInfo() {
                this.visible = true;
                this.advisers.forEach(item => {
                    if (item.id == this.form.excutor) {
                        this.form.excutor = item.name
                    }
                });
            },
            async saveData() {
                let {
                    name,
                    phone,
                    sex,
                    excutor,
                    weixin,
                    birthday,
                    address,
                    remark
                } = this.form;

                if (!name) {
                    this.$message.error("必须填写会员名字");
                    return;
                }
                if (!phone) {
                    this.$message.error("必须填写会员电话");
                    return;
                }
                if (birthday) {
                    birthday = dateFormatYMD(new Date(birthday));
                }
                let res = await api.update({
                    id: this.id,
                    name,
                    phone,
                    sex,
                    excutor,
                    weixin,
                    birthday,
                    address,
                    remark
                });
                if (res.code == 200) {
                    this.visible = false;
                    this.$emit('refreshData');

                    this.advisers.forEach(item => {
                        if (item.id == this.form.excutor) {
                            this.detail.adviser_name = item.name
                        }
                    });
                } else {
                    console.log(res);
                }
            },
            async fetchAdvisers() {
                let res = await adviser.list({
                    pageSize: 1000,
                    page: 1,
                });
        
                let {list, total} = res.data;
                this.advisers = list;
            }
        }
    };

</script>

<style scoped lang="scss">
.detail_info{
    display: flex;
    padding: 15px;
    .list{
        margin-right: 30px;
        width:300px;
        .item{
            margin-bottom: 10px;
            font-size: 14px;
            display: flex;
        }
        .label{
            font-size: 14px;
            color: #444 ;
            width: 80px;
            text-align: right;
            display: inline-block;
        }
        .item_box{
            display: inline-block;
            width: 200px;
        }
        .item_box_remark{
            color: #666;
        }
        padding-left: 15px;
    }
}
</style>
