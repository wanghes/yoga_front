<template>
    <div class="wrap">
        <div class="detail_info">
            <div class="d_left">
                <img :src="detail.course_cover" />
                <div class="info">
                    <h3 class="info_title">{{detail.course_name}}</h3>
                    <div class="s_i">
                        <strong>收费类型：</strong><span>{{detail.pay_type_name}}</span>
                        <strong>分类：</strong><span>{{detail.course_cate_name ? detail.course_cate_name : '暂时还没有分类'}}</span>
                    </div>
                    <div class="money">
                        <div v-if="detail.pay_type==1">
							<span v-for="item in detail.pay_money_type" :key="item.id">
                                ￥{{item.price.toFixed(2)}}
                            </span>
						</div>
                        <div v-else-if="detail.pay_type==2" class="by_time">
                            <span v-for="item in detail.pay_money_type" :key="item.id">
                                <strong>{{item.time}}</strong>天收取<strong>{{item.price.toFixed(2)}}</strong>元
                            </span>
                        </div>
                        <div v-else-if="detail.pay_type==3" class="by_time">
                            <span v-for="item in detail.pay_money_type" :key="item.id">
                                <strong>{{item.time}}</strong>月收取<strong>{{item.price.toFixed(2)}}</strong>元
                            </span>
                        </div>
                        <div v-else-if="detail.pay_type==4" class="by_time">
                            <span v-for="item in detail.pay_money_type" :key="item.id">
                                <strong>{{item.time}}</strong>年收取<strong>{{item.price.toFixed(2)}}</strong>元
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d_right">
                <el-button type="success" @click="goLook">课程预览</el-button>
                <el-button type="success" @click="editCourse(detail.id)">编辑课程</el-button>
                <el-button type="success">报名管理</el-button>
            </div>
        </div>

        <div class="top_info">
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAddCourse">新建单课</el-button>
                <el-button type="primary" @click="addHasCourse">添加已有单课</el-button>
            </el-button-group>
            <div class="right_search">
                <label class="label">填写课程名字查询</label>
                <!-- <el-select v-model="status_selected" placeholder="请选择" @change="statusChange">
                    <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select> -->
                <el-input class="input_search" placeholder="请填写课程名称" clearable @keyup.enter.native="nameChange" @clear="nameChange" v-model="searchName">
                    <i slot="suffix" @click="nameChange" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </div>

        <el-table :data="tableData" :header-cell-style="{'background-color': '#f9fbff', 'height': '80px','color': 'rgba(43,57,64,.85)','border-bottom': '1px #f0f0f0 solid', 'border-top': '1px #f0f0f0 solid'}">
            <el-table-column prop="course_cover" width="150" label="课程封面">
                <template slot-scope="scope">
                    <img class="cover" v-if="!scope.row.course_cover" :src="course_cover" />
                    <img class="cover" v-else :src="scope.row.course_cover" />
                </template>
            </el-table-column>
            <el-table-column prop="course_name" label="课程名称" width="200">
                <template slot-scope="scope">
                    <span class="course_name">{{scope.row.course_name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="open" label="试听状态" fit>
                <template slot-scope="scope">
                    <span>{{scope.row.open == 1?"已启用":"禁用中"}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="open" label="课程排序" width="100">
                <template slot-scope="scope">
                    <el-popover placement="top" trigger="click" :width="160">
                        <div style="margin-bottom: 10px;">
                            <el-input width="100" size="mini" v-model="scope.row.order"></el-input>
                        </div>
                        <div style="text-align: right; margin: 0">
                            <el-button type="primary" size="mini" @click="repairOrder(scope.row.id, scope.row.order)">确定</el-button>
                        </div>
                        <template slot="reference">
                            <div class="edit_order">
                                <span>{{scope.row.order}}</span>
                                <svg-icon icon-class="edit" />
                            </div>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="course_type_name" label="课程类型" width="200"></el-table-column>
            <el-table-column label="课程状态" width="150">
                <template slot-scope="scope">
                    <el-tag type="danger" effect="dark" v-if="!scope.row.course_video">还未上传资源</el-tag>
                    <el-tag type="success" effect="dark" v-else>正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="240"></el-table-column>
            <el-table-column label="操作" fixed="right" width="370">
                <template slot-scope="scope">
                    <el-link type="success" @click="intoEdit(scope.row)" style="margin-right: 10px;">编辑课程</el-link>
                    <el-button type="success" @click="intoPlay(scope.row)">查看链接</el-button>
                    <el-dropdown @command="handleCommand" :split-button="true" type="info" style="margin-left: 10px;">
                        <span class="el-dropdown-link">更多操作</span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-if="scope.row.open" :command="'a|'+ scope.row.id">取消免费试听</el-dropdown-item>
                                <el-dropdown-item v-else :command="'c|'+ scope.row.id">开启免费试听</el-dropdown-item>
                                <el-dropdown-item :command="'b|'+ scope.row.id">移除系列课</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <div style="text-align: center; margin: 30px 0;">
            <el-pagination background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20, 30, 40, 50]" :page-size="pageSize" :total="total">
            </el-pagination>
        </div>

        <el-dialog title="添加已有单课" width="60%" :visible.sync="dialogVisible">
            <el-table :data="allCourses" :header-cell-style="{'background-color': '#f9fbff', 'height': '50px','color': 'rgba(43,57,64,.85)','border-bottom': '1px #f0f0f0 solid', 'border-top': '1px #f0f0f0 solid'}" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="course_cover" label="课程封面" width="150">
                    <template slot-scope="scope">
                        <img class="cover" width="100" v-if="!scope.row.course_cover" :src="course_cover" />
                        <img class="cover" width="100" v-else :src="scope.row.course_cover" />
                    </template>
                </el-table-column>
                <el-table-column property="course_name" label="课程名称" fit height="50">
                    <template slot-scope="scope">
                        <span>{{scope.row.course_name.length>20 ? scope.row.course_name.slice(0, 20)+'...': scope.row.course_name.slice(0, 20)}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="course_type_name" label="课程类型" width="200"></el-table-column>
                <el-table-column property="create_time" width="180" label="创建时间"></el-table-column>
            </el-table>
            <div style="text-align: center; margin: 20px 0 0;">
                <el-pagination background layout="prev, pager, next" :current-page="aloneCurrentPage" :total="allCoursesTotal" @current-change="handleAloneCurrentChange" :page-size="alonePageSize">
                </el-pagination>
            </div>
            <el-button type="primary" @click="okAdd">确定添加</el-button>
        </el-dialog>
    </div>
</template>

<script>
const course = require("@/api/course");
const course_cover = require("@/assets/cover.png");
export default {
	name: "manyPanel",
	inject: ["reload"],
	data() {
		return {
			tableData: [],
			searchName: "",
			currentPage: 1,
			pageSize: 5,
			total: 0,
			aloneCurrentPage: 1,
			alonePageSize: 5,
			allCoursesTotal: 0,
			course_cover,
			dialogVisible: false,
			pid: "",
			detail: {},
			cates: [],
			allCourses: [],
			multipleSelection: [],
			payTypes: [
				{
					id: 1,
					name: "固定收费",
				},
				{
					id: 2,
					name: "按天收费",
				},
				{
					id: 3,
					name: "按月收费",
				},
				{
					id: 4,
					name: "按年收费",
				},
			],
		};
	},
	async mounted() {
		let pid = this.$route.query.id;
		this.pid = pid;
		this.fetdetail();
		this.fetData();
	},
	methods: {
		async fetdetail() {
			let result = await course.get_manycourse({
				id: this.pid,
			});
			let data = result.data;

			let res = await course.getCates();
			this.cates = res.data;

			this.payTypes.forEach(item => {
				if (data.pay_type == item.id) {
					data["pay_type_name"] = item.name;
				}
			});

			this.cates.forEach(item => {
				if (data.course_cate == item.id) {
					data["course_cate_name"] = item.name;
				}
			});
			this.detail = data;
		},
		async fetData() {
			let result = await course.listByPid({
				page: this.currentPage,
				pageSize: this.pageSize,
				course_name: this.searchName.trim(),
				id: this.pid,
			});

			let { list, total } = result.data;
			list.forEach(item => {
				item.orderVisible = false;
			});
			this.setCourseType(list);
			this.tableData = list;
			this.total = total;
		},
		statusChange() {
			this.currentPage = 1;
			this.fetData();
		},
		nameChange() {
			this.fetData();
		},
		handleSizeChange: function (val) {
			this.pageSize = val;
			this.fetData();
		},
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
			this.fetData();
		},
		toAddCourse() {
			this.$router.push({
				path: "/course/add",
				query: {
					pid: this.pid,
				},
			});
		},
		setCourseType(list) {
			list.map(item => {
				let label = "";
				switch (item.course_type) {
					case 1:
						label = "视频录播-无互动模式";
						break;
					case 2:
						label = "视频录播-互动模式";
						break;
					case 3:
						label = "音频录播-无互动模式";
						break;
					case 4:
						label = "音频录播-互动模式";
						break;
					default:
						break;
				}
				item.course_type_name = label;
			});
		},
		intoPlay(row) {
			let { id } = row;
			this.$router.push({
				path: "/course/detail/" + id,
			});
		},
		intoEdit(row) {
			let { id } = row;
			this.$router.push({
				path: "/course/detail/" + id,
			});
		},
		editCourse(id) {
			this.$router.push({
				path: "/course/many_detail/" + id,
			});
		},
		goLook() {},
		addHasCourse() {
			this.dialogVisible = true;
			this.getAllAloneCourses();
		},
		async getAllAloneCourses() {
			let result = await course.list({
				page: this.aloneCurrentPage,
				pageSize: this.alonePageSize,
				status: "",
			});

			let { list, total } = result.data;
			this.setCourseType(list);
			this.allCourses = list;
			this.allCoursesTotal = total;
		},
		handleAloneCurrentChange(currentPage) {
			this.aloneCurrentPage = currentPage;
			this.getAllAloneCourses();
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		async okAdd() {
			let temp = this.multipleSelection;
			let ids = [];
			temp.forEach(item => {
				ids.push(item.id);
			});

			if (!ids.length) {
				this.$message.error("请选择要添加的课程");
				return;
			}

			let up = await course.batchPids({
				ids,
				pid: this.pid,
			});
			this.dialogVisible = false;
			if (up) {
				this.reload();
			}
		},
		repairOrder(id, order) {
			course
				.updateOrder({
					id: id,
					order: parseInt(order),
				})
				.then(res => {
					if (res.code == 200) {
						this.reload();
					}
				});
		},
		handleCommand(command) {
			let [mand, id] = command.split("|");
			switch (mand) {
				case "a":
					course
						.closeListen({
							id: id,
						})
						.then(res => {
							if (res.code == 200) {
								this.reload();
							}
						});
					break;
				case "b":
					course
						.removeCourseFromSeries({
							id: id,
						})
						.then(res => {
							if (res.code == 200) {
								this.reload();
							}
						});
					break;
				case "c":
					course
						.openListen({
							id: id,
						})
						.then(res => {
							if (res.code == 200) {
								this.reload();
							}
						});
					break;
				default:
					break;
			}
		},
	},
};
</script>

<style scoped>
.btn_wrap {
	padding-bottom: 20px;
}
.cover {
	width: 120px;
}
.label {
	color: #666;
	font-weight: normal;
}
.top_info {
	display: flex;
	justify-content: space-between;
}
.course_name {
	color: #333;
}
.right_search {
	display: flex;
	align-items: center;
	position: relative;
	top: -10px;
}
.input_search {
	display: inline-block;
	width: 230px;
	margin-left: 15px;
}
.detail_info {
	display: flex;
	height: 150px;
	justify-content: space-between;
	align-items: flex-start;
	border-bottom: 20px solid #f0f2f5;
	margin: 0 -24px 30px;
	padding: 0 24px;
}
.detail_info img {
	max-width: 200px;
	max-height: 120px;
	margin-right: 20px;
}
.detail_info .d_left {
	display: flex;
}
.info_title {
	line-height: 30px;
	color: #333;
	margin: 0 0 10px;
	font-size: 18px;
	font-weight: bold;
}
.detail_info .d_left .s_i {
	color: #333;
}
.detail_info .d_left .s_i span {
	margin-right: 20px;
}
.detail_info .d_left .money {
	padding-top: 10px;
}
.by_time span {
	margin-right: 10px;
	display: inline-block;
	padding: 3px 10px;
	border: 1px solid #dedede;
}
.by_time span strong {
	color: red;
	margin: 0 4px;
}
.edit_order {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	color: #409eff;
}
.edit_order span {
	margin-right: 5px;
}
</style>
