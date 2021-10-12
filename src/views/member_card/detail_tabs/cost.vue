<template>
    <el-card class="box-card">
        <el-tabs v-model="activeName" v-on:tab-click="handleClick">
            <el-tab-pane label="团课消费" name="tuanke">
                <div class="title">
                    <span>共有 {{tuankeTotal}} 条记录</span>
                    <span v-if="card_style == 1">，累计消费 {{tuankeCost}} 次</span>
                    <span v-else-if="card_style == 6">，累计消费 {{tuankeCost}} 元</span>
                    <span v-else-if="card_style == 7">，累计消费 {{tuankeCost}} 小时</span>
                    <span v-else></span>
                </div>
                <el-table :data="tuankeList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column width="150" label="卡号">
                        <span>{{card}}</span>
                    </el-table-column>
                    <el-table-column prop="course_name" width="200" label="课程项目">
                        <template slot-scope="scope">
                            <span v-if="scope.row.order_course_type == 1">(团课) {{scope.row.course_name}}</span>
                            <span v-else>私教课</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="teacher_name" width="150" label="老师">
                    </el-table-column>
                    <el-table-column prop="course_name" width="180" label="上课时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.start_date && scope.row.start_date.slice(0, 11)}} {{scope.row.start_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_time" width="180" label="确认时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.order_time && scope.row.order_time.slice(0, 16)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" label="消费">
                        <template slot-scope="scope">
                            <span v-if="scope.row.cost_type == 1">{{scope.row.order_cost}} 次</span>
                            <span v-else-if="scope.row.cost_type == 6">{{scope.row.order_cost.toFixed(2)}} 元</span>
                            <span v-else-if="scope.row.cost_type == 7">{{scope.row.order_cost}} 小时</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_remark" label="备注">
                    </el-table-column>
                    <el-table-column prop="remark" width="120" fixed="right" label="操作消费">
                        <template slot-scope="scope">
                            <el-button type="primary" v-if="scope.row.order_status == 1" size="mini" @click="chexiao(scope.row)">撤销消费</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="私教课消费" name="sijiao">
                <div class="title">
                    <span>共有 {{sijiaoTotal}} 条记录</span>
                    <span v-if="card_style == 1">，累计消费 {{sijiaoCost}} 次</span>
                    <span v-else-if="card_style == 6">，累计消费 {{sijiaoCost}} 元</span>
                    <span v-else-if="card_style==7">，累计消费 {{sijiaoCost}} 小时</span>
                    <span v-else></span>
                </div>
                <el-table :data="sijiaoList" border :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
                    <el-table-column width="150" label="卡号">
                        <span>{{card}}</span>
                    </el-table-column>
                    <el-table-column prop="course_name" width="200" label="课程项目">
                        <template slot-scope="scope">
                            <span>{{scope.row.teacher_name}} - 私教课</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="180" label="上课时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.date && scope.row.date.slice(0, 11)}} {{scope.row.start_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_time" width="180" label="确认时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.order_time && scope.row.order_time.slice(0, 16)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="course_name" width="120" label="消费">
                        <template slot-scope="scope">
                            <span v-if="scope.row.cost_type == 1">{{scope.row.order_cost}} 次</span>
                            <span v-else-if="scope.row.cost_type == 6">{{scope.row.order_cost.toFixed(2)}} 元</span>
                            <span v-else-if="scope.row.cost_type == 7">{{scope.row.order_cost}} 小时</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_remark" label="备注">
                    </el-table-column>
                    <el-table-column prop="remark" width="120" fixed="right" label="操作消费">
                        <template slot-scope="scope">
                            <el-button type="primary" v-if="scope.row.order_status == 1" size="mini" @click="chexiao(scope.row)">撤销消费</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>
<script>
const order = require("@/api/order");
export default {
	props: ["card", "card_style"],
	data() {
		return {
			activeName: "tuanke",
			order_course_type: 1,
			tuankeList: [],
			tuankeTotal: 0,
			tuankeCost: 0,
			sijiaoList: [],
			sijiaoTotal: 0,
			sijiaoCost: 0,
		};
	},
	methods: {
		async fetchSpents() {
			let res = await order.list({
				order_card_no: this.card,
				order_course_type: this.order_course_type,
				order_status: 1,
			});
			if ((res.code = 200)) {
				let cost = 0;
				if (this.order_course_type == 1) {
					this.tuankeList = res.data.list;
					this.tuankeTotal = res.data.total;
					this.tuankeList.length &&
						this.tuankeList.forEach(item => {
							cost += item.order_cost;
						});

					if (this.card_style == 6) {
						this.tuankeCost = cost.toFixed(2);
					} else {
						this.tuankeCost = cost;
					}
				} else {
					this.sijiaoList = res.data.list;
					this.sijiaoTotal = res.data.total;
					this.sijiaoList.length &&
						this.sijiaoList.forEach(item => {
							cost += item.order_cost;
						});

					if (this.card_style == 6) {
						this.sijiaoCost = cost.toFixed(2);
					} else {
						this.sijiaoCost = cost;
					}
				}
			}
		},
		handleClick(tab) {
			if (tab.name == "tuanke") {
				this.order_course_type = 1;
			} else {
				this.order_course_type = 2;
			}
			this.fetchSpents();
		},
		async chexiao(row) {
			let res = await order.cancel({
				id: row.id,
				order_card_no: row.order_card_no,
				order_cost: row.order_cost,
			});
			if (res.code == 200) {
				this.$message.success(res.msg);
				this.fetchSpents();
				this.$emit("refreshData");
			} else {
				console.log(res);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.title {
	font-size: 14px;
	line-height: 40px;
	margin-bottom: 10px;
}
</style>