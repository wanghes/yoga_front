<template>
    <div class="wrap">
        <div class="box">
            <div class="title">
                <span><i class="el-icon-s-management"></i> 发卡信息</span>
            </div>
            <el-form label-position="left" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="5">
                        <el-form-item required label="卡号：">
                            <el-input v-model="cardNo"></el-input>
                        </el-form-item>
                        <el-form-item required label="手机号：">
                            <el-input v-model="member.phone"></el-input>
                        </el-form-item>
                        <el-form-item required label="姓名：">
                            <el-input v-model="member.name"></el-input>
                        </el-form-item>
                        <el-form-item required label="卡类型：">
                            <el-select style="width:100%" v-model="card_type" placeholder="选择卡类型" @change="typeChange">
                                <el-option
                                    v-for="item in card_types"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="备注：">
                            <el-input 
                                type="textarea"
                                placeholder="填写备注" 
                                maxlength="255"
                                show-word-limit
                                v-model="remark">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
        </div>
        <div class="box">
            <div class="title">
                <span><i class="el-icon-user-solid"></i> 会员信息</span>
            </div>
            <el-form class="form2" label-position="left" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="5">
                        <el-form-item label="性别：">
                            <span>{{member.sex==1 ? '男':'女'}}</span>
                        </el-form-item>
                        <el-form-item label="生日：">
                            <span>{{member.birthday}}</span>
                        </el-form-item>
                        <el-form-item label="会籍顾问：">
                            <span>{{member.adviser_name}}</span>
                        </el-form-item>
                        <el-form-item label="微信号：">
                            <span>{{member.weixin}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="头像：">
                            <div class="head">
                                <img v-if="member.head" :src="member.head" alt="头像">
                                <img v-else :src="head" alt="头像">
                            </div>
                        </el-form-item>
                         <el-form-item label="来源：">
                            <span>{{member.orgin}}</span>
                        </el-form-item>
                        <el-form-item label="地址：">
                            <span>{{member.address}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
         </div>
         <div class="box" v-show="showt">
            <div class="title">
                <span><i class="el-icon-s-claim"></i> 可消费团课</span>
            </div>
            <div class="courses">
                <el-tag class="item" effect="dark" v-for="item in cost_course" :key="item.id" type="primary ">{{item.course_name}}</el-tag>
            </div>
        </div>
        <div class="box" v-show="showt">
            <div class="title">
                <span><i class="el-icon-s-claim"></i> 收费信息</span>
            </div>
            <div class="money">
                <el-form label-position="left" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="5">
                            <el-form-item label="应收付款:">
                                <span>{{cardInfo.price && cardInfo.price.toFixed(2)}} 元</span>
                            </el-form-item>
                            <el-form-item label="实际收款:">
                                <el-input-number v-model="truePrice"></el-input-number>
                            </el-form-item>
                            <el-form-item label="支付类型:">
                                <el-select v-model="pay_type" placeholder="选择支付类型">
                                    <el-option
                                        v-for="item in payTypes"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>

                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="btn_box">
            <el-button type="primary" @click="faka">发 卡</el-button>
        </div>
    </div>
</template>
<script>
const api = require('@/api/member_card');
const member = require('@/api/member');
const card = require('@/api/card');
const head = require('@/assets/member_head.png');
export default {
    data() {
        return {
            head,
            status: true,
            cardNo:"",
            member_id: "",
            member: {},
            card_type: "",
            cardInfo: {},
            card_types:[],
            card_model:"",
            remark:"",
            showt: false,
            cost_course: [],
            truePrice: '',
            payTypes: [
                {
                    value: 1,
                    label: "现金"
                },
                {
                    value: 2,
                    label: "微信"
                },
                {
                    value: 3,
                    label: "支付宝"
                },
                {
                    value: 4,
                    label: "刷卡"
                }
            ],
            pay_type: ""
        }
    },
    mounted() {
        this.member_id = this.$route.params.member_id;
        this.fetchCardNo();
        this.fetchMember();
        this.getTypeCards();
    },
    methods: {
        async fetchCardNo() {
            let res = await api.cardno();
        
            if (res.code == 200) {
                this.cardNo = res.data.cardno;
            }
        },
        async fetchMember() {
            let res = await member.query({
                id: this.member_id
            });
            if (res.code) {
                this.member = res.data;
            }
        },
        async getTypeCards() {
            let res = await card.all();
            if (res.code == 200) {
                this.card_types = res.data;
            }
        },
        async typeChange(val) {
            let res1 = await card.query({
                id: val
            });
            if(res1.code == 200) {
                this.cardInfo = res1.data;
                this.card_model =res1.data.type
            }

            card.list_by_card_id({
                card_id: val
            }).then(res => {
                if (res.code == 200) {
                    if (res.data.length) {
                        this.cost_course = res.data;
                        this.showt = true;
                    } else {
                        this.$message.error("该种类的卡还没有绑定使用的课程，请先设置课程");
                        this.showt = false
                    }
                }
            })
        },
        async faka() {
            let member_id = this.member_id;
            let card_no = this.cardNo;
            let pay_type = this.pay_type;
            let amount = this.truePrice;
            let remark = this.remark;
            let card_type = this.card_type;
            let card_model = this.card_model; // 卡模型
            let times = "";
            let expire_date= '';
            let hours = "";
            let normal_amount = 0;

            if (!card_type) {
                this.$message.error("请先选择开卡的类型");
                return;
            }

            if (!member_id) {
                this.$message.error("会员ID没有");
                return;
            }
            if (!card_no) {
                this.$message.error("会员卡卡号必填");
                return;
            }
            if (!amount) {
                this.$message.error("请填写支付的实际金额");
                return;
            }
            if (!pay_type) {
                this.$message.error("选择支付类型");
                return;
            }

            if (card_model == 1) {
                times = this.cardInfo.times;
                expire_date = this.cardInfo.expire_date;
            } else if (card_model == 6){
                expire_date = this.cardInfo.expire_date;
            } else if (card_model == 7){
                hours = this.cardInfo.hours;
                expire_date = this.cardInfo.expire_date;
            } else {
                expire_date = this.cardInfo.expire_date;
            }

            normal_amount = this.cardInfo.price;
    //         console.log({
    //             card_type_id: card_type,
    //             member_id,
    //             card_no,
    //             pay_type,
    //             remark,
    //             amount,
    //             card_model,
    //             times,
    //             normal_amount,
    //             expire_date,
    //             hours
    //         })
    // return;
            let res = await api.add({
                card_type_id: card_type,
                member_id,
                card_no,
                pay_type,
                remark,
                amount,
                card_model,
                times,
                normal_amount,
                expire_date,
                hours
            });

            if (res.code == 200) {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.replace({
                    path: "/membercard/index"
                });
            } else {
                this.$message.error("开卡失败");
                console.log(res);
            }
         }
    }
}
</script>

<style>
.el-form-item__label {
    text-align: right!important;
}
</style>
<style scoped lang="scss">
.wrap{
    padding-top: 0;
}
.el-form--label-left .el-form-item__label {
    text-align: right;
}
.form2 .el-form-item{
    margin-bottom: 0;
}
.box {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #efefef;
    .title{
        font-size: 16px;
        color:#333;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        margin: -20px -20px 20px;
        border-bottom: 1px solid #efefef;
        background: #f5f5f5;
        padding-left: 20px;
    }
}
.head{
    width: 50px;
    height: 50px;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
.courses{   
    .item{
        margin-right: 10px;
    }
}
</style>