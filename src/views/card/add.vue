<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
            <!--  老师头像 -->
            <el-form-item label="卡种类名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item required label="卡类别">
                <el-radio-group v-model="form.type">
                    <el-radio-button :label="1">次卡</el-radio-button>
                    <el-radio-button :label="2">年卡</el-radio-button>
                    <el-radio-button :label="3">季卡</el-radio-button>
                    <el-radio-button :label="4">月卡</el-radio-button>
                    <el-radio-button :label="5">周卡</el-radio-button>
                    <el-radio-button :label="6">储值卡</el-radio-button>
                    <el-radio-button :label="7">小时卡</el-radio-button>
                </el-radio-group>
                <el-alert type="error" style="margin-top: 10px" :closable="false">此类型一旦保存，无法修改！！！</el-alert>
            </el-form-item>

            <el-form-item label="售价">
                <el-input-number v-model="form.price"></el-input-number>
            </el-form-item>
            <el-form-item label="有效期">
                <el-radio-group v-model="form.expire_date_on" @change="changeRadio">
                    <el-radio-button :label="2">不限制</el-radio-button>
                    <el-radio-button :label="1">限制</el-radio-button>
                </el-radio-group>
                <div class="days" v-show="form.expire_date_on == 1">
                    <el-input-number placeholder="填写天数" v-model="form.expire_date"></el-input-number> 天
                </div>
            </el-form-item>
            <el-form-item label="次数" v-if="form.type==1">
                <el-input-number placeholder="填写次数" v-model="form.times"></el-input-number> 次
            </el-form-item>
            <el-form-item label="小时数" v-if="form.type==7">
                <el-input-number placeholder="填写小时数" v-model="form.hours"></el-input-number> 小时
            </el-form-item>
            <el-form-item label="单次可约最大人数">
                <el-input-number placeholder="单次可约最大人数" v-model="form.limit_people"></el-input-number> 人
            </el-form-item>
            <el-form-item label="显示顺序">
                <el-input-number placeholder="填写显示顺序" v-model="form.order"></el-input-number> 
            </el-form-item>
            <el-form-item label="会员卡使用说明">
                <el-input 
                    type="textarea"
                    placeholder="填写会员卡使用说明" 
                    maxlength="255"
                    show-word-limit
                    v-model="form.remark">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
const api = require("@/api/card");
export default {
    data() {
        return {
            form: {
                name: '',
                type: 1,
                price: "",
                expire_date_on: 1,
                expire_date: "",
                times:"",
                limit_people:"",
                order: 0,
                remark: "",
                hours: ""
            }
        }
    },
    mounted() {

    }, 
    methods: {
        changeRadio(value) {
            console.log(value)
        },
        async saveData() {
            let {
                name,
                type,
                price,
                expire_date_on,
                expire_date,
                times,
                limit_people,
                hours,
                order,
                remark
            } = this.form;

            if (!name) {
                this.$message.error("请填写卡种类名称")
                return;
            }

            if (!type) {
                this.$message.error("请选择卡类别")
                return;
            }
            if (!price) {
                this.$message.error("请填写售价")
                return;
            }
            
            if (expire_date_on == 1) {
                if (!expire_date) {
                    this.$message.error("请填写有效期限制天数")
                    return;
                }
            }

            if (type == 1) {
                if (!times) {
                    this.$message.error("请填写次卡限制次数")
                    return;
                }
            }

            if (type == 7) {
                if (!hours) {
                    this.$message.error("请填写小时卡小时数")
                    return;
                }
            }

            if (!limit_people) {
                this.$message.error("请填写单次可约最大人数")
                return;
            }

            let res = await api.add({
                name,
                type,
                price,
                expire_date_on,
                expire_date,
                times,
                limit_people,
                order,
                remark
            });

            if (res.code == 200) {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push({
                    path: "/card/index"
                });
            } else {
                this.$message.error("数据保存失败");
                console.log(res);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.days{
    padding-top: 15px;
}
</style>