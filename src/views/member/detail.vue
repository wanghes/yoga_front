<template>
    <div class="wrap">
        <div class="info">
            <div class="head">
                <img v-if="detail.head" :src="detail.head" alt="头像">
                <img v-else :src="head" alt="头像">
            </div>
            <div class="list">
                <div class="item">
                    <label class="label">姓名：</label>
                    <span>{{detail.name}}</span>
                    <el-tag type="success" v-if="hasCard">有卡</el-tag>
                    <span v-else-if="loading"></span>
                    <el-tag type="danger" v-else>无卡</el-tag>
                </div>
                <div class="item">
                    <label class="label">手机：</label>
                    <el-link type="info">{{detail.phone}}</el-link>
                </div>
                <div class="item">
                    <label class="label">会籍顾问：</label>
                    <el-link type="info">{{detail.adviser_name}}</el-link>
                </div>
                
                <div class="item">
                    <label class="label">积分：</label>
                    <el-link type="info">{{detail.point}}</el-link>
                </div>
            </div>
        </div>
        <el-divider></el-divider>
        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
            <el-tab-pane label="会员基本信息" name="1"> 
                <info ref="info" :id="id" :edit="edit"></info>
            </el-tab-pane>
            <el-tab-pane label="会员卡列表" name="2"> 
                <cardList :id="id" ref="card_list"></cardList>
            </el-tab-pane>
            <el-tab-pane label="预约" name="3"> 
                <yuyue ref="yuyue"></yuyue>
            </el-tab-pane>
            <el-tab-pane label="消费" name="4"> 
                <cost ref="cost"></cost>
            </el-tab-pane>
            <el-tab-pane label="交易汇总" name="5"> 
                <order ref="jiaoyi"></order>
            </el-tab-pane>
            <el-tab-pane label="体验课记录" name="6"> 
                <experience ref="experience"></experience>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
const api = require('@/api/member');
const member_card = require('@/api/member_card');
const adviser = require('@/api/adviser'); // 会籍顾问
const head = require('@/assets/member_head.png');
import info from "./detail_tabs/info";
import cardList from "./detail_tabs/card_list";
import cost from "./detail_tabs/cost";
import yuyue from "./detail_tabs/yuyue";
import order from "./detail_tabs/order";
import experience from "./detail_tabs/experience";


export default {
     components: {
        info,
        cardList,
        cost,
        yuyue,
        order,
        experience
    },
    data() {
        return {
            head:head,
            edit: false,
            id: "",
            hasCard: false,
            activeName: "1",
            detail: {},
            loading: true
        }
    },
    mounted() {
        this.id = this.$route.params.id;
        this.edit = this.$route.query.edit;
        this.fetchData()
    },
    methods: {
        async fetchData() {
            let id = this.$route.params.id;
            let res = await api.query({
                id
            });
            if (res.code) {
                this.detail = res.data;
            }

            let cardRes = await member_card.query({
                member_id: this.detail.id
            });
            
            if (cardRes.code == 200 && cardRes.data.total > 0) {
                this.hasCard = true;
            }
            this.loading = false;
        },
        handleClick(tab, action) {  
             switch(tab.name) {
                case "1":
                    this.$refs.info.fetchData();
                break; 
                case "2":
                    this.$refs.card_list.fetchData();
                break; 
                case "3":
                    
                break; 
                case "4":
                    
                break; 
                case "5":
                    
                break; 
                case "6":
                    
                break; 
                default:
                break;  
            }
        }
    }
}
</script>

<style scoped lang="scss">
.info{
    display: flex;
}
.head{
    width: 80px;
    height: 80px;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
.list{
    .item{
        margin-bottom: 5px;
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
</style>