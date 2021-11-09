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
            <div class="bottom" v-else>
                <br>
                <el-alert type="error" :closable="false">目前没有搜索到数据</el-alert>
            </div>
        </div>
          
        <div class="cost" v-show="visible">
            <div class="box">
                <h3 class="title">团课消费</h3>
                <div class="inner">
                    <el-tag style="margin-right: 15px" type="info" effect="dark" v-for="item in courses" :key="item.agree_course_id">{{item.course_name}}</el-tag>
                </div>
            </div>
            <div class="box">
                <h3 class="title">已预约</h3>
                <div class="inner">
                    <el-card class="box-card">
                        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
                            <el-tab-pane label="团课预约" name="tuanke"> 
                                <div slot="header" class="clearfix">
                                    <span>预约总计 {{tuankeTotal}} 次</span>
                                </div>
                                <el-table :data="tuankeList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                                    <el-table-column prop="book_card_no" width="150" label="卡号">
                                    </el-table-column>  
                                    <el-table-column prop="course_name" width="200" label="预约的课程">
                                    </el-table-column>  
                                    <el-table-column prop="teacher_name"  width="130" label="老师">
                                    </el-table-column> 
                                    <el-table-column prop="book_time" width="180" label="预约时间">
                                    </el-table-column>  
                                    <el-table-column  width="180" label="上课时间">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.start_date && scope.row.start_date.slice(0, 11)}} {{scope.row.start_time}}</span>
                                        </template>
                                    </el-table-column>  
                                    <el-table-column prop="course_name"  width="120" label="预约状态">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.book_status == 1">已预约</span>
                                            <span v-else>已取消</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" fixed="right">
                                        <template slot-scope="scope">
                                            <el-button v-if="scope.row.book_status == 1 && !scope.row.order_status" size="mini" type="primary" @click="chexiao(scope.row)">撤销预约</el-button>
                                            <span v-if="scope.row.order_status == 2">已取消</span>
                                            <span v-else-if="scope.row.order_status == 1">已消费</span>
                                        </template>
                                    </el-table-column>  
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="私教课预约" name="sijiao">
                                <div slot="header" class="clearfix">
                                    <span>预约总计 {{sijiaoTotal}} 次</span>
                                </div>
                                <el-table :data="sijiaoList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                                    <el-table-column prop="book_card_no" width="150" label="卡号">
                                    </el-table-column>  
                                    <el-table-column width="200" label="预约的项目">
                                        <span>私教课</span>
                                    </el-table-column>  
                                    <el-table-column prop="teacher_name" width="150" label="老师">
                                    </el-table-column> 
                                    <el-table-column   width="180" label="课程时间">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.date && scope.row.date.slice(0, 11)}} {{scope.row.start_time}}</span>
                                        </template>
                                    </el-table-column>  
                                    <el-table-column prop="course_name" width="120" label="预约状态">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.book_status == 1">已预约</span>
                                            <span v-else>已取消</span>
                                        </template>
                                    </el-table-column>  
                                    <el-table-column fixed="right" label="操作">
                                        <template slot-scope="scope">
                                            <el-button v-if="scope.row.book_status == 1 && !scope.row.order_status" size="mini" type="primary" @click="chexiao(scope.row)">撤销预约</el-button>
                                            <span v-if="scope.row.order_status == 2">已取消</span>
                                            <span v-else-if="scope.row.order_status == 1">已消费</span>
                                        </template>
                                    </el-table-column>  
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const api = require('@/api/member_card');
const book = require('@/api/book');
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
            courses:[],
            activeName: 'tuanke',
            tuankeTotal: 0,
            tuankeList: [],
            sijiaoList:[],
            sijiaoTotal:0,
            book_course_type: 1
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
                } else {
                    this.cards = [];
                }
            }
        },
        async fetchBooks() {
            let res = await book.list({
                book_card_no: this.form.card_no,
                book_course_type: this.book_course_type
            });
     
            if (res.code == 200) {
                if (this.book_course_type == 2) {
                    this.sijiaoList = res.data.list;
                    this.sijiaoTotal = res.data.total;
                } else {
                    this.tuankeList = res.data.list;
                    this.tuankeTotal = res.data.total;
                }
            } else {
                console.log(res);
            }
        },
        look(card_no) {
            this.$router.push({
                path: '/membercard/detail/'+card_no
            })
        },
        async chexiao(row) {
            let res = await book.cancel({
                id: row.id,
            });
            if (res.code == 200) {
                this.$message.success(res.msg);
                this.fetchBooks();
            } else {
                console.log(res);
            }
        },
        async more(item) {
            this.visible = true;
            this.fetchBooks();
            let res = await card.list_by_card_id({
                card_id: item.card_type_id
            });

            if (res.code == 200) {
                this.courses = res.data;   
            }
        },
        handleClick(tab, event) {
            if (tab.name == 'tuanke') {
                this.book_course_type = 1;
                this.fetchBooks();
            } else {
                this.book_course_type = 2;
                this.fetchBooks();
            }
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