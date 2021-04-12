<template>
    <div class="wrap">
        <div class='top_box'>
            <div class="top">
                <el-form label-position="left" label-width="80px">
                    <el-form-item label="卡号">
                        <el-input v-model="form.card_no" placeholder="请输入卡号"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="queryCard">查 询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="bottom" v-if="cards.length">
                <h3>查询到的结果</h3>
                <div class="e_cards">
                    <el-card shadow="always" v-for="item in cards" :key="item.id">
                        <div class="list">
                            <div class="item">
                                <label class="label">持卡人：</label>
                                <el-link type="primary">{{item.name}}</el-link>
                            </div>
                            <div class="item">
                                <label class="label">会员卡：</label>
                                <span>{{item.card_no}}（{{item.card_name}}）</span>
                            </div>
                            <div class="item">
                                <label class="label">状态：</label>
                                <span v-if="item.status == 1" >正常</span>
                                <span v-else-if="item.status == 0">未开卡</span>
                                <span v-else>已用完</span>
                            </div>
                            <div class="item">
                                <label class="label">剩余：</label>
                                <span>{{item.surplus}}</span>
                            </div>
                            <div class="item">
                                <label class="label">所属会籍：</label>
                                <span>{{item.adviser_name}}</span>
                            </div>
                            <div class="item">
                                <label class="label">有效期：</label>
                                <span>{{item.open_start_time.slice(0, 11)}} 至 {{item.open_end_time.slice(0, 11)}}</span>
                            </div>
                            <div class="item">
                                <label class="label"></label>
                                <el-button size="mini" type="primary" @click="more(item)">消费和预约</el-button>
                                <el-button size="mini" type="info" @click="look(item.card_no)">查看更多</el-button>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
          
        <div class="cost" v-show="visible">
            <el-divider></el-divider> 
            <div class="box">
                <h3 class="title">团课消费</h3>
                <div class="inner">
                    <el-tag style="margin-right: 15px" type="info" effect="dark" v-for="item in courses" :key="item.agree_course_id">{{item.course_name}}</el-tag>
                </div>
            </div>
            <div class="box">
                <h3 class="title">已预约</h3>
                <div class="inner">
                    <el-tag style="margin-right: 15px" type="info" effect="dark" v-for="item in courses" :key="item.agree_course_id">{{item.course_name}}</el-tag>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const api = require('@/api/member_card');
const card = require('@/api/card');
export default {
    name: "member_card_operate",
    data() {
        return{
            form:{
                card_no: "",
                phone: "",
                name: ""
            },
            cards: [],
            currentCardNo: '',
            visible: false,
            courses:[]
        }
    },
    mounted() {
        let no = this.$route.params.card_no;
        if (no) {
            this.form.card_no = no;
            this.queryCard();
        }
        
    },
    methods: {
        async queryCard() {
            let {
                card_no,
                phone,
                name
            } = this.form;
            let res = await api.queryCard({
                card_no,
                phone,
                name
            });
           
            if (res.code == 200) {
                if (res.data.length) {
                    this.cards = res.data;
                }
            }
        },
        look(card_no) {
            this.$router.push({
                path: '/membercard/detail/'+card_no
            })
        },
        async more(item) {
            this.visible = true;
            let res = await card.list_by_card_id({
                card_id: item.card_type_id
            });

            if (res.code == 200) {
                this.courses = res.data;
            }
            console.log(res)
        }
    }
}
</script>

<style lang="scss" scoped>
.top_box{
    display: flex;
    flex-direction: column;
    .bottom{
        border-top: 1px solid #efefef; 
        display: flex; 
        flex-direction: column;
        h3{
            font-size: 16px;
            line-height: 32px;
        }
        .e_cards{
            display: flex; 
            .el-card{
                margin:0px 10px 0 0;
            }
        }
    }
}
.list{
    .item{
        margin-bottom: 5px;
        font-size: 14px;
    }
    .label{
        font-size: 14px;
        color: #333;
        margin-right: 8px;
        width: 80px;
        text-align: right;
        display: inline-block;
    }
    padding-left: 15px;
}
.cost{
    margin-top:20px;
    .box{
        .title{
            font-size: 14px;
            font-weight: normal;
            line-height: 42px;
            border-bottom: 1px solid #efefef;
        }
    }
}
</style>