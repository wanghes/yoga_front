<template>
    <div class="wrap">
        <h3>{{courseInfo.teacher_name}} - 私教课 {{courseInfo.date && courseInfo.date.slice(0, 11)}} {{courseInfo.start_time}}至{{courseInfo.end_time}} </h3>
        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
            <!-- 预约 -->
            <el-tab-pane label="预约" name="first">
                <div class="first_box">
                    <div class="left">
                        <el-form label-width="80px">
                            <el-form-item label="卡号：">
                                <el-input placeholder="请输入卡号" v-model="form.card_no"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名：">
                                <span>{{detail.name}}</span>
                            </el-form-item>
                            <el-form-item label="手机：">
                                <span>{{detail.phone}}</span>
                            </el-form-item>
                            <el-form-item v-if="queryCards.length" label="选择卡：">
                                <el-select style="width:100%" v-model="form.card_no" placeholder="选择其他卡" @change="cardNoChange">
                                    <el-option v-for="item in queryCards" :key="item.card_no" :label="item.card_name" :value="item.card_no">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <br>
                            <el-form-item>
                                <el-button type="primary" @click="queryCard">查 询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="right">
                        <div class="item">
                            <label>课程：</label>
                            <span>{{courseInfo.teacher_name}} - 私教课</span>
                        </div>
                        <div class="item">
                            <label>卡名称：</label>
                            <span>{{detail.card_name}}</span>
                        </div>
                        <div class="item">
                            <label>状态：</label>
                            <span v-if="detail.status == 0">未开卡</span>
                            <span v-else-if="detail.status == 1">正常</span>
                            <span v-else-if="detail.status == 2">已用完</span>
                            <span v-else></span>
                        </div>
                        <div class="item">
                            <label>剩余：</label>
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
                        <div class="item">
                            <label>私教时间：</label>
                            <span>{{courseInfo.minutes}} 分钟</span>
                        </div>
                        <div class="item" v-if="form.card_no">
                            <el-link type="danger" @click="jump()">查看更多</el-link>
                        </div>
                    </div>
                </div>
                <el-divider></el-divider>
                <el-button-group>
                    <el-button type="primary" @click="addBook">预约</el-button>
                    <el-button type="info" @click="cancelAction">取消</el-button>
                </el-button-group>
            </el-tab-pane>

            <!-- 已预约 -->
            <el-tab-pane label="已预约" name="second">
                <el-table :data="bookList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column prop="head" width="80" label="头像">
                        <template slot-scope="scope">
                            <div class="head">
                                <img v-if="scope.row.head" :src="scope.row.head" alt="头像">
                                <img v-else :src="head" alt="头像">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" width="150" label="预约人"></el-table-column>
                    <el-table-column prop="phone" width="150" label="电话"></el-table-column>
                    <el-table-column prop="book_card_no" width="150" label="卡号"></el-table-column>
                    <el-table-column prop="card_name" width="150" label="卡名称"></el-table-column>
                    <el-table-column prop="teacher_name" width="120" label="教练"></el-table-column>
                    <el-table-column prop="book_time" width="180" label="预约时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.book_time && scope.row.book_time.slice(0, 16)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="book_time" width="180" label="上课时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.date && scope.row.date.slice(0, 11)}} {{scope.row.start_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="预约状态" width="180">
                        <template slot-scope="scope">
                            <span v-if="scope.row.book_status == 1">预约成功</span>
                            <span v-else>学员预约取消</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.qiandao_status==0 && scope.row.book_status == 1" @click="qiaodao(scope.row)" type="success" size="mini">
                                <span>签到</span>
                            </el-button>
                            <span v-if="scope.row.qiandao_status == 1 && scope.row.book_status == 1">已上课</span>
                            <el-button v-if="scope.row.book_status == 1 && scope.row.qiandao_status == 0" @click="cancelCourse(scope.row.id)" size="mini" type="primary">
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

            <!-- 已消费 -->
            <el-tab-pane label="已消费" name="third">
                <el-table :data="orders" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column prop="head" width="80" label="头像">
                        <template slot-scope="scope">
                            <div class="head">
                                <img v-if="scope.row.head" :src="scope.row.head" alt="头像">
                                <img v-else :src="head" alt="头像">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" width="150" label="姓名"></el-table-column>
                    <el-table-column prop="phone" width="150" label="手机号"></el-table-column>
                    <el-table-column prop="order_card_no" width="150" label="卡号"></el-table-column>
                    <el-table-column prop="card_name" width="150" label="卡名称"></el-table-column>
                    <el-table-column prop="order_time" width="200" label="签到时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.order_time && scope.row.order_time.slice(0, 16)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上课时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.date && scope.row.date.slice(0, 11)}} {{scope.row.start_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="消费" fixed="right" width="150">
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
const schedule = require("@/api/trainerSchedule");
const member_card = require("@/api/member_card");
const teacher = require("@/api/teacher");
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
		cardNoChange(val) {
			this.queryCard();
		},
		async fetchOrders() {
			let res = await order.list({
				order_course_type: 2,
				order_schedule_id: this.schedule_id,
			});

			if (res.code == 200) {
				this.orders = res.data.list;
				this.ordersTotal = res.data.total;
			}
		},
		async fetchBookList() {
			let res = await book.list({
				book_course_type: 2,
				book_course_id: this.schedule_id,
			});

			if (res.code == 200) {
				this.bookList = res.data.list;
			}
		},
		async addBook() {
			let { card_id } = this.detail;
			let book_card_no = this.form.card_no;
			if (!book_card_no) {
				this.$message.error("没有设置卡的信息");
				return;
			}
			let teacher_id = this.courseInfo.teacher;
			let teacher_res = await teacher.sijiao_cardinfo({
				id: teacher_id,
			});

			let bindTeachers = teacher_res.data.support_cardinfo.split(",");
			// console.log(bindTeachers)

			let hasCard = false;
			bindTeachers = bindTeachers.map(item => {
				let temp = item.split("_");
				return {
					card_id: temp[0],
					price: temp[1],
				};
			});

			bindTeachers.forEach(item => {
				if (item.card_id == card_id) {
					hasCard = true;
				}
			});

			if (!hasCard) {
				this.$message.error("此卡不能预约该私教课，请选择其他卡");
				return;
			}

			let book_course_id = this.courseInfo.id;
			let book_member_id = this.detail.member_id;
			let book_course_type = 2;

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
			} else {
				console.log(res);
			}
		},
		async qiaodao(row) {
			let cost = "";
			let support_cardinfos = row.support_cardinfo.split(",");
			support_cardinfos = support_cardinfos.map(item => {
				let temp = item.split("_");
				return {
					card_id: temp[0],
					price: temp[1],
				};
			});

			support_cardinfos.forEach(item => {
				if (item.card_id == row.card_id) {
					cost = parseFloat(item.price);
				}
			});

			let res = await order.add({
				book_id: row.id,
				order_card_no: row.book_card_no,
				order_schedule_id: row.book_course_id,
				order_course_type: row.book_course_type,
				order_member_id: row.member_id,
				order_remark: "",
				order_cost: cost,
				cost_type: row.type,
			});

			if (res.code == 200) {
				this.fetchBookList();
				this.$message.success(res.msg);
			} else {
				console.log(res);
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
			} else {
				console.log(res);
			}
		},
		async cancelOrder(row) {
			// 取消订单
			let res = await order.cancel({
				id: row.order_id,
				order_cost: row.order_cost,
				order_card_no: row.order_card_no,
				order_remark: "私教课订单撤销",
			});
			if (res.code == 200) {
				this.$message.success(res.msg);
				this.fetchOrders();
			} else {
				console.log(res);
			}
		},
		jump() {
			this.$router.push({
				path: "/membercard/detail/" + this.form.card_no,
			});
		},
		cancelAction() {
			this.$store.dispatch("tagsView/delView", this.$route);
			this.$router.back();
		},
		handleClick(tab, action) {
			if (tab.paneName == "first") {
			} else if (tab.paneName == "second") {
				this.fetchBookList();
			} else if (tab.paneName == "third") {
				this.fetchOrders();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.head {
	width: 50px;
	height: 50px;
	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
}
.title {
	font-size: 16px;
	line-height: 0;
	margin-bottom: 30px;
	span {
		margin-right: 10px;
	}
}
.first_box {
	display: flex;
	.left {
		width: 400px;
		padding: 20px;
		border-right: 1px solid #ededed;
	}
	.right {
		padding: 20px;
		.item {
			font-size: 14px;
			line-height: 30px;
		}
	}
}
.el-form-item {
	margin-bottom: 0px;
}
.el-button-group {
	text-align: center;
}
</style>