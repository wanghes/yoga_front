<template>
    <div class="wrap">
        <el-card class="top_card">
            <div class="userInfo">
                <div class="head">
                    <img v-if="detail.head" :src="detail.head" alt="头像">
                    <img v-else :src="head" alt="头像">
                </div>
                <span class="name">{{detail.name}}</span>
            </div>
            
            <div class="box">
                <div class="item"><label>会员卡名称：</label><span>{{detail.card_name}}</span></div>
                <div class="item"><label>卡种类：</label><span>{{card_style_name}}</span></div>
                <div class="item"><label>状态：</label><span>{{card_status_name}}</span></div>
                <div class="item"><label>卡号：</label><span>{{detail.card_no}}</span></div>
                <div class="item"><label>剩余：</label><span>{{surplus_name}}</span></div>
                <div class="item"><label>有效期：</label><span>{{limit_date}}</span></div>
            </div>
        </el-card>
        <el-divider></el-divider>
        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
            <el-tab-pane label="会员卡资料" name="first"> 
                <info :card="cardNo" ref="info"></info>
            </el-tab-pane>
            <el-tab-pane label="可消费的项目" name="second"> 
                <items :card="cardNo" ref="items"></items>
            </el-tab-pane>
             <el-tab-pane label="卡预约" name="third"> 
                <yuyue :card="cardNo" ref="yuyue"></yuyue>
            </el-tab-pane>
            <el-tab-pane label="卡消费" name="fourth"> 
                <cost @refreshData="fetchDetail" :card_style="card_style" :card="cardNo" ref="cost"></cost>
            </el-tab-pane>
            <el-tab-pane label="取消" name="five"> 
                <cancel :card="cardNo" ref="cancel"></cancel>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
const api = require('@/api/member_card');
const card = require('@/api/card');
const head = require('@/assets/member_head.png');
import info from "./detail_tabs/info";
import cost from "./detail_tabs/cost";
import yuyue from "./detail_tabs/yuyue";
import items from "./detail_tabs/items";
import cancel from "./detail_tabs/cancel";

export default {
    components:{
        info,
        items,
        cost,
        yuyue,
        cancel
    },
    data() {
        return {
            head,
            detail:{},
            cardNo: "",
            card_style:"",
            card_status: "",
            surplus: '',
            activeName: "first"
        }
    },
    mounted() {
        this.cardNo = this.$route.params.card_no;
        if (this.cardNo) {
            this.fetchDetail();
        }
    },
    computed: {
        limit_date() {
            if (this.detail.open_start_time) {
                let { open_start_time, open_end_time } = this.detail;
                return open_start_time.slice(0, 11) + " 至 " + open_end_time.slice(0, 11);
            }
            return "";
        },
        surplus_name() {
            let surplus = this.surplus;
            let card_style = this.card_style;
            if (card_style == 1) {
                return surplus + '次';
            }

            if (card_style == 6) {
                return parseFloat(surplus).toFixed(2)+ '元';
            }

            if (card_style == 7) {
                return surplus + '小时';
            }

            if (card_style == 2) {
                return "年卡，请查看有效期";
            }

            if (card_style == 3) {
                return "季卡，请查看有效期";
            }

            if (card_style == 2) {
                return "月卡，请查看有效期";
            }

            if (card_style == 2) {
                return "周卡，请查看有效期";
            }

            return ""
        },
        card_status_name() {
            let status = this.card_status;
            if (status == 0) {
                return "未开卡"
            }
            if (status == 1) {
                return "正常"
            }
            if (status == 2) {
                return "已用完"
            }
        },
        card_style_name() {
            let type = this.card_style;
            let name = "";
            switch(type) {
                case 1:
                    name = '次卡';
                    break;
                case 2:
                    name = '年卡';
                    break;
                case 3:
                    name = '季卡';
                    break;
                case 4:
                    name = '月卡';
                    break;
                case 5:
                    name = '周卡';
                    break;
                case 6:
                    name = '储值卡';
                    break;
                case 7:
                    name = '小时卡';
                    break;
                default:
                    break;
            }
            return name;
            
        }
    },
    methods: {
        async fetchDetail() {
            let res = await api.queryCard({
                card_no: this.cardNo
            });
            if (res.code == 200) {
                this.detail = res.data[0]
                this.card_style = this.detail.type;
                this.card_status = this.detail.status
                this.surplus = this.detail.surplus
            }
            this.$refs.info.fetchDetail();
        }, 
        
        handleClick(tab, event) {
            if (tab.name == 'first') {
                this.$refs.info.fetchDetail();
            } else if (tab.name == 'second') {
                this.$refs.items.fetchData();
            } else if (tab.name == 'third') {
                this.$refs.yuyue.fetchBooks();
            } else if (tab.name == 'fourth') {
                this.$refs.cost.fetchSpents();
            } else if (tab.name == 'five') {
                this.$refs.cancel.fetchData();
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.top_card{
    .name {
        font-size: 16px;
        color:blueviolet;
    }
    .box{
        display: flex;
        .item{
            margin-right: 20px;
            font-size: 14px;
        }
    }
}
.userInfo{
    display: flex;
    width:200px;
    flex-direction: column ;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    padding: 10px 0 30px;
    .head{
        width: 80px;
        height: 80px;
        img{
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }
    }
}
</style>