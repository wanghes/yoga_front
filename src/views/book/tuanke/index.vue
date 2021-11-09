<template>
    <div class="wrap tuanke_book">
        <el-card class="top_card">
            <div class="desk_info">
                <div class="list">
                    <div class="item">
                        <label class="label">课程名称：</label>
                        <el-link type="info">{{courseInfo.course_name}}</el-link>
                    </div>
                    <div class="item">
                        <label class="label">上课日期：</label>
                        <el-link type="info">{{courseInfo.start_date && courseInfo.start_date.slice(0, 10)}}</el-link>
                    </div>
                    <div class="item">
                        <label class="label">上课时间：</label>
                        <el-link type="info">{{courseInfo.start_time}}-{{courseInfo.end_time}}</el-link>
                    </div>
                    <div class="item">
                        <label class="label">上课老师：</label>
                        <el-link type="info">{{courseInfo.teacher_name}}</el-link>
                    </div>
                    <div class="item">
                        <label class="label">人数限制：</label>
                        <el-link type="info">最多{{courseInfo.p_num}}人</el-link>
                    </div>
                </div>
            </div>
        </el-card>
        <el-divider></el-divider>
        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
            <el-tab-pane label="预约和消费" name="first">
                <div class="first_box">
                    <div class="top">
                        <el-form label-width="80px" :inline="true">
                            <el-form-item label="">
                                <el-input placeholder="请输入卡号" v-model="form.card_no"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-button type="primary" @click="queryCard">查 询</el-button>
                                <el-button type="success" @click="addBook">预约</el-button>
                                <el-button type="info" @click="cancelAction">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-card class="bottom" v-if="form.card_no" shadow="never" style="width: 400px;">
                        <div slot="header" class="card_header">
                            <span>卡片信息</span>
                            <el-button type="danger" size="mini" @click="jump()">查看更多</el-button>
                        </div>
                        <div class="item">
                            <label>用户姓名：</label>
                            <span>{{detail.name}}</span>
                        </div>
                        <div class="item">
                            <label>用户手机：</label>
                            <span>{{detail.phone}}</span>
                        </div>
                        <div class="item">
                            <label>卡的名称：</label>
                            <span>{{detail.card_name}}</span>
                        </div>
                        <div class="item">
                            <label>卡的状态：</label>
                            <span v-if="detail.status == 0">未开卡</span>
                            <span v-else-if="detail.status == 1">正常</span>
                            <span v-else-if="detail.status == 2">已用完</span>
                            <span v-else></span>
                        </div>
                        <div class="item">
                            <label>卡的剩余：</label>
                            <span v-if="detail.type == 1">{{detail.surplus}}次</span>
                            <span v-else-if="detail.type == 6">{{detail.surplus}}元</span>
                            <span v-else-if="detail.type == 7">{{detail.surplus}}小时</span>
                            <span v-else-if="detail.type == 2">年卡</span>
                            <span v-else-if="detail.type == 3">季卡</span>
                            <span v-else-if="detail.type == 4">月卡</span>
                            <span v-else-if="detail.type == 5">周卡</span>
                        </div>
                        <div class="item">
                            <label>开卡时间：</label>
                            <span>{{detail.open_start_time && detail.open_start_time.slice(0, 11)}}</span>
                        </div>
                        <div class="item">
                            <label>到期时间：</label>
                            <span>{{detail.open_end_time && detail.open_end_time.slice(0, 11)}}</span>
                        </div>
                    </el-card>
                </div>
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
                            <el-button size="mini" v-if="scope.row.qiandao_status==0 && scope.row.book_status == 1" type="success" @click="qiaodao(scope.row)">
                                <span>签到</span>
                            </el-button>
                            <span v-if="scope.row.qiandao_status==1 && scope.row.book_status == 1">已消费</span>
                            <el-button size="mini" type="primary" v-if="scope.row.book_status == 1 && scope.row.qiandao_status == 0" @click="cancelCourse(scope.row.id)">
                                <span>取消预约</span>
                            </el-button>
                            <span v-if="scope.row.book_status == 2 && scope.row.qiandao_status == 0">预约被取消</span>
                            <!-- 
                            <el-button size="mini" 
                                v-if="scope.row.book_status == 2 && scope.row.qiandao_status == 0" 
                                class="editbtn" type="success" 
                                @click="againBook(scope.row.id)">
                                <span>重新预约</span>    
                            </el-button> 
                            -->
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
                    <el-table-column width="180" label="消费">
                        <template slot-scope="scope">
                            <span v-if="scope.row.order_card_type == 1">{{scope.row.order_cost}} 次</span>
                            <span v-else-if="scope.row.order_card_type == 6">{{scope.row.order_cost}} 元</span>
                            <span v-else-if="scope.row.order_card_type == 7">{{scope.row.order_cost}} 小时</span>
                            <span v-else-if="scope.row.order_card_type == 2">年卡</span>
                            <span v-else-if="scope.row.order_card_type == 3">季卡</span>
                            <span v-else-if="scope.row.order_card_type == 4">月卡</span>
                            <span v-else-if="scope.row.order_card_type == 5">周卡</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_remark" width="200" label="备注说明"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" v-if="scope.row.order_status==1" type="primary" @click="cancelOrder(scope.row)">撤销消费</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>
    
<script>
const schedule = require("@/api/schedule");
const member_card = require("@/api/member_card");
const book = require("@/api/book");
const order = require("@/api/order");
const head = require("@/assets/member_head.png");

export default {
	data() {
		return {
			head,
			activeName: "first",
			form: {
				card_no: "",
				phone: "",
				name: "",
			},
			courseInfo: {},
			detail: {},
			schedule_id: "",
			bookList: [],
			orders: [],
			ordersTotal: 0,
			queryCards: [],
		};
	},
	mounted() {
		this.schedule_id = this.$route.params.schedule_id;
		this.queryScheduleById();
	},
	methods: {
		async queryScheduleById() {
			let res = await schedule.query({
				id: this.schedule_id,
			});
			this.courseInfo = res.data;
		},
		async fetchOrders() {
			let res = await order.list({
				order_course_type: 1,
				order_schedule_id: this.schedule_id,
			});

			if (res.code == 200) {
				this.orders = res.data.list;
				this.ordersTotal = res.data.total;
			}
		},
		async fetchBookList() {
			let res = await book.list({
				book_course_type: 1,
				book_course_id: this.schedule_id,
			});

			if (res.code == 200) {
				this.bookList = res.data.list;
			}
		},
		async queryCard() {
			let { card_no, name, phone } = this.form;

			if (!card_no) {
				this.$message.error("输入卡号");
			}

			let res = await member_card.queryCard({
				card_no: card_no,
			});

			if (res.code == 200 && res.data.length) {
				this.detail = res.data[0];
				let member_id = this.detail.member_id;

				let re = await member_card.query_by_member({
					member_id,
				});

				if (re.code == 200) {
					this.queryCards = re.data;
				}
			} else {
				this.$message.error("信息获取失败，可能卡号输入错误");
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

			if (!book_card_no) {
				this.$message.error("没有设置卡的信息");
				return;
			}

			let res = await book.add({
				book_card_no,
				book_course_id,
				book_member_id,
				book_course_type,
			});

			if (res.code == 200) {
				this.$message.success(res.msg);
				this.activeName = "second";
				this.fetchBookList();
			}
		},
		againBook() {},
		jump() {
			this.$router.push({
				path: "/membercard/detail/" + this.form.card_no,
			});
		},
		cancelAction() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.back();
		},
		// 用户签到就证明消费了
		async qiaodao(row) {
			let cost = "";
			if (row.type == 1 || row.type == 7) {
				// 次卡, 小时卡每次消费单位是1
				cost = row.times;
			} else if (row.type == 6) {
				cost = row.amount;
			}

			let res = await order.add({
				book_id: row.id,
				card_name: row.card_name,
                order_card_no: row.book_card_no,
				order_schedule_id: row.book_course_id,
				order_course_type: row.book_course_type,
				order_member_id: row.member_id,
				order_cost: cost,
				order_card_type: row.type,
			});

			if (res.code == 200) {
				this.fetchBookList();
				this.$message.success(res.msg);
			}
		},
		async cancelCourse(book_id) {
			// 取消预约
			let res = await book.cancel({
				id: book_id,
			});
			if (res.code == 200) {
				this.$message.success(res.msg);
				this.fetchBookList();
			}
		},
		async cancelOrder(row) {
			// 取消订单
			let res = await order.cancel({
				id: row.id,
				order_cost: row.order_cost,
				order_card_no: row.order_card_no,
				order_remark: "团课订单撤销",
			});
			if (res.code == 200) {
				this.$message.success(res.msg);
				this.fetchOrders();
			}
		},
	},
};
</script>


<style>
.tuanke_book .el-card__header{
    padding: 15px;
    background-color:ghostwhite;
}
</style>
<style scoped lang="scss">
.head {
	width: 50px;
	height: 50px;
	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
}
.desk_info {
	margin-bottom: 30px;
    font-size: 14px;
	.list {
		.item {
			margin-bottom: 5px;
		}
		.label {
			font-size: 14px;
			color: #333;
			margin-right: 8px;
			width: 80px;
			text-align: right;
			display: inline-block;
		}
		padding-left: 15px;
	}
}
.first_box {
	.top {
		padding: 20px 0;
		border-right: 1px solid #ededed;
	}
	.bottom {    
        .card_header{
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
                flex: 1;
            }
        }   
		.item {
			margin-bottom: 5px;
            font-size: 14px;
		}
		label {
			font-size: 14px;
			color: #333;
			margin-right: 8px;
			width: 80px;
			text-align: right;
			display: inline-block;
		}
	}
}
.el-form-item {
	margin-bottom: 5px;
}
.el-button-group {
	text-align: center;
}

</style>