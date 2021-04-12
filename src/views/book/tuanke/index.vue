<template>
    <div class="wrap">
        <h3 class="title">
            <span>{{courseInfo.start_date && courseInfo.start_date.slice(0, 11)}} </span>
            <span>{{courseInfo.start_time}}-{{courseInfo.end_time}}</span>
            <span>{{courseInfo.course_name}}</span>
            <span>{{courseInfo.teacher_name}}</span> 
            <span>人数限制：最多{{courseInfo.p_num}}人</span> 
        </h3>
        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
            <el-tab-pane label="预约和消费" name="first"> 
                <div class="first_box">
                    <div class="left"   >
                        <el-form label-width="80px">
                            <el-form-item label="卡号：">
                                <el-input placeholder="请输入卡号" v-model="form.card_no"></el-input>
                            </el-form-item>
                            <el-form-item label="手机：">
                                <!-- <el-input v-model="form.phone"></el-input> -->
                                <span>{{detail.name}}</span>
                            </el-form-item>
                            <el-form-item label="姓名：">
                                <!-- <el-input v-model="form.name"></el-input> -->
                                <span>{{detail.phone}}</span>
                            </el-form-item> 
                            <el-form-item label="选择卡：">
                                <!-- <el-input v-model="form.name"></el-input> -->
                            </el-form-item>
                            <el-form-item label="">
                                <el-button type="primary" @click="queryCard">查 询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="right">
                        <div class="item">
                            <label>卡名称：</label>
                            <span>{{detail.card_name}}</span>
                        </div>
                        <div class="item">
                            <label>状态：</label>
                            <span v-if="detail.status == 0">未开卡</span>
                            <span v-else-if="detail.status == 1">正常</span>
                            <span v-else-if="detail.status == 2" >已用完</span>
                            <span v-else ></span>
                        </div>
                        <div class="item">
                            <label>剩余：</label>
                            <span v-if="detail.type == 1">{{detail.surplus}}次</span>
                            <span v-else-if="detail.type == 6">{{detail.surplus}}元</span>
                            <span v-else-if="detail.type == 7">{{detail.surplus}}小时</span>
                            <span v-else></span>
                        </div>
                        <div class="item">
                            <label>开卡时间：</label>
                            <span>{{detail.open_start_time && detail.open_start_time.slice(0, 11)}}</span>
                        </div>
                        <div class="item">
                            <label>到期时间：</label>
                            <span>{{detail.open_end_time && detail.open_end_time.slice(0, 11)}}</span>
                        </div>
                        <div class="item" v-if="form.card_no">
                            <el-link type="danger" @click="jump()">查看更多</el-link>
                        </div>
                    </div>
                </div>
                <el-divider></el-divider>
                <el-button-group>
                    <el-button type="primary" @click="addBook">预约</el-button>
                    <el-button type="primary">上课</el-button>
                    <el-button type="info" @click="cancelAction">取消</el-button>
                </el-button-group>
            </el-tab-pane>
            <el-tab-pane label="已预约" name="second"> 
                <el-table :data="bookList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column prop="head" width="150" label="头像">
                        <template slot-scope="scope">
                            <div class="head">
                                <img v-if="scope.row.head" :src="scope.row.head" alt="头像">
                                <img v-else :src="head" alt="头像">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" width="150" label="预约人"></el-table-column>
                    
                    <el-table-column prop="phone" width="150" label="电话"></el-table-column>
                    <el-table-column prop="book_card_no" width="150" label="会员卡"></el-table-column>
                    <el-table-column prop="book_time" width="200" label="预约时间"></el-table-column>
                    
                    <el-table-column prop="book_status" width="150" label="预约状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.book_status == 1">预约成功</span>
                            <span v-else>学员取消</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" class="editbtn" type="success" @click="qiaodao(scope.row)">签到</el-button>
                            <el-button size="mini" v-if="scope.row.book_status==1" class="editbtn" type="primary" @click="cancelCourse(scope.row.id)">取消</el-button>
                            <!--<el-button size="mini" v-else class="editbtn" type="success" @click="qiaodao(scope.row.id)">重新预约</el-button> -->
                        </template>
                    </el-table-column> 
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="已消费" name="third"> 
                <el-table :data="orders" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column prop="name" width="150" label="下单学员"></el-table-column>
                    <el-table-column prop="teacher_name" width="150" label="老师"></el-table-column>
                    <el-table-column prop="course_name" width="150" label="课程名字"></el-table-column>
                    <el-table-column width="200" label="上课时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.start_date && scope.row.start_date.slice(0, 11)}} {{scope.row.start_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_time" width="200" label="确认时间"></el-table-column>
                    <el-table-column  width="180" label="消费">
                        <template slot-scope="scope">
                            <span v-if="scope.row.cost_type == 1">{{scope.row.order_cost}} 次</span>
                            <span v-else-if="scope.row.cost_type == 6">{{scope.row.order_cost}} 元</span>
                            <span v-else-if="scope.row.cost_type == 7">{{scope.row.order_cost}} 小时</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" v-if="scope.row.order_status==1" type="primary" @click="cancelOrder(scope.row.id)">撤销消费</el-button>
                        </template>
                    </el-table-column> 
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
      
</template>
    
<script>
const schedule = require('@/api/schedule');
const member_card = require('@/api/member_card');
const book = require('@/api/book');
const order = require('@/api/order');
const head = require('@/assets/member_head.png');
export default {
    data() {
        return {
            head,
            activeName: "first",
            form: {
                card_no:"",
                phone: "",
                name: ""
            },
            courseInfo: {},
            detail: {},
            schedule_id: '',
            bookList:[],
            orders:[],
            ordersTotal: 0
        }
    },
    mounted() {
        this.schedule_id = this.$route.params.schedule_id;
        this.queryScheduleById();
    },
    methods: {
        async queryScheduleById() {
            let res = await schedule.query({
                id: this.schedule_id
            });
            this.courseInfo = res.data;
        },
        async fetchOrders() {
            let res = await order.list({
                order_course_type: 1,
                order_course_id: this.schedule_id
            });

            if (res.code == 200) {
                this.orders = res.data.list;
                this.ordersTotal = res.data.total
                //console.log(res.data)
            }
            
        },
        async fetchBookList() {
            let res = await book.list({
                book_course_type: 1,
                book_course_id: this.schedule_id
            });

            if (res.code == 200) {
                this.bookList = res.data.list;
                //console.log(res.data)
            }
            
        },
        async queryCard() {
            let {
                card_no,
                name,
                phone
            } = this.form;

            if (!card_no){
                this.$message.error("输入卡号")
            }
            
            let res = await member_card.queryCard({
                card_no: card_no
            });
           
            if (res.code == 200 && res.data.length) {
                this.detail = res.data[0];
                console.log(this.detail)
            } else {
                this.$message.error("信息获取失败，可能卡号输入错误")
            }
        },
        handleClick(tab, action) {
            if (tab.paneName == "first") {
                return;
            } else if (tab.paneName == "second") {
                this.fetchBookList();
            } else if (tab.paneName == "third") {
                this.fetchOrders();
            }
        },
        async addBook() {
            let book_card_no = this.form.card_no;
            let book_course_id = this.courseInfo.id;
            let book_member_id = this.detail.member_id;
            let book_course_type = 1; // 团课

            let res = await book.add({
                book_card_no,
                book_course_id,
                book_member_id,
                book_course_type
            });

            if (res.code == 200) {
                this.$message.success(res.msg);
                this.activeName = 'second';
            } else {
                // this.$message.error(res.msg);
                console.log(res);
            }
        },
        jump() {
            this.$router.push({
                path: '/membercard/detail/'+this.form.card_no
            })
        },
        cancelAction() {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.back();
        },
        async qiaodao(row) {
            console.log(row.type)
            let cost = "";
            if (row.type == 1 || row.type == 7) { // 次卡,小时卡每次消费单位是1
                cost = row.times;
            } else if (row.type == 6) {
                cost = row.amount;
            }

    
            let res = await order.add({
                book_id: row.id,
                order_card_no: row.book_card_no,
                order_course_id: row.book_course_id,
                order_course_type: row.book_course_type,
                order_member_id: row.member_id,
                order_remark: "",
                order_cost: cost,
                cost_type: row.type
            });

            if (res.code == 200) {
                this.fetchOrders();
                this.$message.success(res.msg);
            } else {
                console.log(res);
            }
        },
        async cancelCourse(book_id) { // 取消预约
            let res = await book.cancel({
                id: book_id
            });
            if (res.code == 200) {
                this.$message.success(res.msg);
                this.fetchBookList();
            } else {
                console.log(res);
            }
        },
        async cancelOrder(order_id) { // 取消订单
            let res = await order.cancel({
                id: order_id
            });
            if (res.code == 200) {
                this.$message.success(res.msg);
                this.fetchOrders();
            } else {
                console.log(res);
            }
        }
        
    }
}
</script>

<style scoped lang="scss">
.head{
    width: 50px;
    height: 50px;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
.title{
    font-size: 16px;
    line-height: 0;
    margin-bottom: 30px;
    span{
        margin-right: 10px;
    }
}
.first_box{
    display: flex;
    .left{
        width: 400px;
        padding: 20px;
        border-right: 1px solid #ededed;    
    }
    .right{
        padding: 20px;
        .item{
            font-size: 14px;
            line-height: 40px;
        }
    }
}
.el-form-item{
    margin-bottom: 5px;
}
.el-button-group{
    text-align: center;
}
</style>