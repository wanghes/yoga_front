<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>会员卡详细资料</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <div class="box">
            <div class="left">
                <div class="item">
                    <label>会员卡号：</label>
                    <span>{{detail.card_no}}</span>
                </div>
                <div class="item">
                    <label>会员卡名称：</label>
                    <span>{{detail.card_name}}</span>
                </div>
                <div class="item">
                    <label>会员名字：</label>
                    <span>{{detail.name}}</span>
                </div>
                <div class="item">
                    <label>会员手机：</label>
                    <span>{{detail.phone}}</span>
                </div>
                <div class="item">
                    <label>会员卡种类：</label>
                    <span>{{card_style_name}}</span>
                </div>
                <div class="item">
                    <label>会员卡状态：</label>
                    <span>{{card_status_name}}</span>
                </div>
                <div class="item">
                    <label>会员卡剩余：</label>
                    <span>{{surplus_name}}</span>
                </div>
                <div class="item">
                    <label>会员卡有效期：</label>
                    <span>{{limit_date}}</span>
                </div>
            </div>
            <div class="right">
                <div class="item">
                    <label>预约次数：</label>
                    <span></span>
                </div>
                <div class="item">
                    <label>消费次数：</label>
                    <span></span>
                </div>
                <div class="item">
                    <label>单次消费价格（折算）：</label>
                    <span></span>
                </div>
                <div class="item">
                    <label>折算已消费/剩余：</label>
                    <span></span>
                </div>
                <div class="item">
                    <label>备注：</label>
                    <span>{{detail.remark}}</span>
                </div>
            </div>
        </div>
    </el-card>

</template>
<script>
const api = require('@/api/member_card');
export default {
    props: ['card'],
    data() {
        return {
            detail:{},
            cardNo: "",
            card_style:"",
            card_status: "",
            surplus: '',
            activeName: "first"
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
                return "年卡，查看有效期";
            }
            if (card_style == 3) {
                return "季卡，查看有效期";
            }
            if (card_style == 4) {
                return "月卡，查看有效期";
            }
            if (card_style == 5) {
                return "周卡，查看有效期";
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

            if (status == 3) {
                return "已过期"
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
                card_no: this.card
            });
            if (res.code == 200) {
                

                let result = res.data[0];
                if (result.open_end_time) {
                    let now = new Date().getTime();
                    let open_end_time = new Date(result.open_end_time).getTime();
                    if (now > open_end_time) {
                        result.status = 3;
                    }
                }
                this.detail = result;
                this.card_style = this.detail.type;
                this.card_status = this.detail.status
                this.surplus = this.detail.surplus
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.box{
    display: flex;
    .item{
        margin-bottom: 10px;
        label{
            width: 200px;
            display: inline-block;
            text-align: right;
        }
        margin-right: 20px;
        font-size: 14px;
    }
}
</style>