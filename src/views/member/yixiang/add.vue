<template>
    <div>
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
                <el-input type="textarea" placeholder="填写备注" v-model="form.remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="doAdd">完 成</el-button>
        </div>
    </div>
</template>
<script>
const api = require('@/api/member');
const adviser = require('@/api/adviser'); // 会籍顾问
import { dateFormatYMD } from '@/utils/index';
export default {
    data() {
        return {
            advisers: [],
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
    methods: {
        async doAdd(){
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
            let res = await api.add({
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
                this.$emit('refreshData');
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
