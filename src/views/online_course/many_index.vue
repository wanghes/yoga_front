<template>
    <div class="wrap">
        <div class="top_info">
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAddCourse">新建系列课</el-button>
            </el-button-group>
            <div class="right_search">
                <label class="label">按课程分类搜索：</label>
                <el-select v-model="cate_selected" placeholder="请选择" @change="cateChange" clearable>
                    <el-option v-for="item in cates" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-input class="input_search" placeholder="请输入系列课名称" clearable @keyup.enter.native="nameChange" @clear="nameChange" v-model="searchName">
                    <i slot="suffix" @click="nameChange" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </div>

        <el-table :data="tableData" :header-cell-style="{'background-color': '#f9fbff', 'height': '80px','color': 'rgba(43,57,64,.85)','border-bottom': '1px #f0f0f0 solid', 'border-top': '1px #f0f0f0 solid'}">
            <el-table-column prop="course_cover" width="150" label="封面">
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
			 <el-table-column label="上架状态" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.on == 1">已上架</span>
                    <span v-else>未上架</span>
                </template>
            </el-table-column>
			<el-table-column label="是否设置为精品课" width="200">
                <template slot-scope="scope">
					<el-link v-if="scope.row.jingpin == 0" type="primary" @click="setJingpin(scope.row)">设置为精品课</el-link>
					<el-link v-else type="danger" @click="cancelJingpin(scope.row)">取消精品课</el-link>
                </template>
            </el-table-column>
            <el-table-column label="付费类型" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.pay_type == 1">固定收费</span>
                    <span v-if="scope.row.pay_type == 2">按天收费</span>
                    <span v-if="scope.row.pay_type == 3">按月收费</span>
                    <span v-if="scope.row.pay_type == 4">按年收费</span>
                </template>
            </el-table-column>
            <el-table-column label="价格" width="180">
                <template slot-scope="scope">
                    <div class="money">
                        <div v-if="scope.row.pay_type==1" class="by_time">
                            <strong>￥{{scope.row.price.toFixed(2)}}</strong>
                        </div>
                        <div v-else-if="scope.row.pay_type==2" class="by_time">
                            <strong>{{scope.row.time}}</strong> 天<strong> ￥{{scope.row.price.toFixed(2)}} </strong>
                        </div>
                        <div v-else-if="scope.row.pay_type==3" class="by_time">
                            <strong>{{scope.row.time}}</strong> 月<strong> ￥{{scope.row.price.toFixed(2)}} </strong>
                        </div>
                        <div v-else-if="scope.row.pay_type==4" class="by_time">
                            <strong>{{scope.row.time}}</strong> 年<strong> ￥{{scope.row.price.toFixed(2)}} </strong>
                        </div>
                    </div>
                </template>
            </el-table-column>
			<el-table-column label="促销价格" width="180">
                <template slot-scope="scope">
                    <div class="money">
                        <div v-if="scope.row.pay_type==1 && scope.row.cu_status" class="by_time by_time2">
                            <strong>￥{{scope.row.cu_price.toFixed(2)}}</strong>
                        </div>
						<div v-else>--</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="course_cate_name" label="课程分类" width="120"></el-table-column>
            <el-table-column prop="update_time" width="240" label="更新时间"></el-table-column>
            <el-table-column label="操作" width="340" fixed="right">
                <template slot-scope="scope">
                    <el-link class="editbtn" type="success" @click="intoEdit(scope.row)">编辑课程</el-link>
                    <el-link class="editbtn" type="success" @click="jumpPage(scope.row)">管理单课</el-link>
					<el-dropdown @command="handleSale" type="primary" style="margin-left: 15px;">
                        <span class="el-dropdown-link">营销<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <template #dropdown>
                            <el-dropdown-menu>
								<el-dropdown-item v-if="scope.row.pay_type==1 && scope.row.cu_status == 0" :command="'a|'+ scope.row.id">促销</el-dropdown-item>
								<el-dropdown-item v-if="scope.row.pay_type==1 && scope.row.cu_status == 1" :command="'b|'+ scope.row.id">取消促销</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-dropdown @command="handleCommand" type="success" style="margin-left: 15px;">
                        <span class="el-dropdown-link">更多<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :command="'a|'+ scope.row.id">新建单课</el-dropdown-item>
                                <el-dropdown-item :command="'d|'+ scope.row.id">{{scope.row.on == 1 ? '下架':'上架'}}</el-dropdown-item>
                                <el-dropdown-item :command="'b|'+ scope.row.id">选择已有单课</el-dropdown-item>
                                <el-dropdown-item :command="'c|'+ scope.row.id">进入直播</el-dropdown-item>
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

        <el-dialog title="新建系列课" :visible.sync="visible">
            <el-form :model="form">
                <el-form-item required label="课程名称" :label-width="formLabelWidth">
                    <el-input v-model="form.course_name"></el-input>
                </el-form-item>
				
                <el-form-item required label="收费类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.pay_type" @change="changePayType">
                        <el-radio v-for="item in payTypes" :key="item.id" :label="item.id">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="showMoney" required label="金额" :label-width="formLabelWidth">
                    <div v-for="item,index in form.pay_money_type" :key="index">
                        <el-input class="short_input" v-model="item.price"></el-input><span> 元</span>
                    </div>
                </el-form-item>
				<!-- 
                <el-form-item v-if="showMoneyByTime" required label="金额" :label-width="formLabelWidth">
                    <div v-if="form.pay_type==2">
                        <div class="pay_money_type_item" v-for="item,index in form.pay_money_type" :key="index">
                            <el-input class="short_input" v-model="item.time" placeholder="请填写天数"></el-input>
                            <span>天收取</span>
                            <el-input class="short_input" v-model="item.price" placeholder="请填写金额"></el-input>
                            <span>元</span>
                            <el-link class="del_btn" v-if="index != 0" @click="delPayMonnyItem(index)" type="danger">删除</el-link>
                        </div>
                    </div>
                    <div v-else-if="form.pay_type==3">
                        <div class="pay_money_type_item" v-for="item,index in form.pay_money_type" :key="index">
                            <el-input class="short_input" v-model="item.time" placeholder="请填写月数"></el-input>
                            <span>月收取</span>
                            <el-input class="short_input" v-model="item.price" placeholder="请填写金额"></el-input>
                            <span>元</span>
                            <el-link class="del_btn" v-if="index != 0" @click="delPayMonnyItem(index)" type="danger">删除</el-link>
                        </div>
                    </div>
                    <div v-else-if="form.pay_type==4">
                        <div class="pay_money_type_item" v-for="item,index in form.pay_money_type" :key="index">
                            <el-input class="short_input" v-model="item.time" placeholder="请填写年数"></el-input>
                            <span>年收取</span>
                            <el-input class="short_input" v-model="item.price" placeholder="请填写金额"></el-input>
                            <span>元</span>
                            <el-link class="del_btn" v-if="index != 0" @click="delPayMonnyItem(index)" type="danger">删除</el-link>
                        </div>
                    </div>
                    <el-button type="primary" @click="addTypeByTime">添加一个类型</el-button>
                </el-form-item>
				-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="createCourse">完 成</el-button>
            </div>
        </el-dialog>

        <!-- 添加已有单课 -->
        <el-dialog title="添加已有单课" width="50%" :visible.sync="dialogVisible">
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
                <el-table-column property="create_time" width="180" label="创建时间"></el-table-column>
            </el-table>
            <div style="text-align: center; margin: 20px 0 0;">
                <el-pagination background layout="prev, pager, next" :current-page="aloneCurrentPage" :total="allCoursesTotal" @current-change="handleAloneCurrentChange" :page-size="alonePageSize">
                </el-pagination>
            </div>
            <el-button type="primary" @click="okAdd">确定添加</el-button>
        </el-dialog>

		<el-dialog title="设置促销价格" width="40%" :visible.sync="cuxiaoVisible">
			<el-form :model="saleForm">
				<el-form-item required label="促销价格" :label-width="formLabelWidth">
                    <el-input v-model="saleForm.cu_price" placeholder="请填写促销价格"></el-input>
                </el-form-item>
			</el-form>
			 <div slot="footer" class="dialog-footer">
                <el-button @click="cuxiaoVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCu">完 成</el-button>
            </div>
		</el-dialog>
    </div>
</template>

<script>
const course = require("@/api/course");
const course_cover = require("@/assets/xilie_cover.png");
export default {
	name: "CourseIndex",
	data() {
		return {
			formLabelWidth: "120px",
			tableData: [],
			searchName: "",
			pageSize: 5,
			currentPage: 1,
			cates: [],
			visible: false,
			total: 0,
			course_cover,
			cate_selected: "",
			showMoney: true,
			showMoneyByTime: false,
			dialogVisible: false,
			multipleSelection: [],
			aloneCurrentPage: 1,
			alonePageSize: 5,
			allCoursesTotal: 0,
			allCourses: [],
			cuxiaoVisible: false,
			form: {
				course_name: "",
				pay_type: 1,
				pay_money_type: [
					{
						price: "",
						time: "",
					},
				],
			},
			saleForm: {
				cuxiao_id: "",
				cu_price:''
			},
			payTypes: [
				{
					id: 1,
					name: "固定收费",
				},
				/*
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
				*/
			],
			batchPid: "",
		};
	},
	async mounted() {
		let res = await course.getCates();
		this.cates = res.data;
		this.fetData();
	},
	methods: {
		async fetData() {
			let result = await course.many_list({
				page: this.currentPage,
				pageSize: this.pageSize,
				course_cate: this.cate_selected,
				course_name: this.searchName,
			});

			let { list, total } = result.data;
			list = this.setListItemCateName(list);

			this.tableData = list;
			this.total = total;
		},
		setListItemCateName(list) {
			list.forEach(item => {
				this.cates.forEach(it => {
					if (item.course_cate == it.id) {
						item.course_cate_name = it.name;
					}
				});
			});
			return list;
		},
		cateChange() {
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
			this.visible = true;
		},
		async createCourse() {
			let { pay_type, course_name, pay_money_type } = this.form;

			let config = {
				course_name,
				pay_type: parseInt(pay_type),
				pay_money_type: [],
			};

			// 1.固定类型收费， 2、3、4 是按时付费类型的
			if (!config.course_name) {
				this.$message.error("请填写课程名称");
				return;
			} else if (!config.pay_type) {
				this.$message.error("请选择收费类型");
				return;
			} else if (pay_type == 1) {
				let status = false;
				pay_money_type.forEach(item => {
					if (!item.price) {
						status = true;
					}
				});
				if (status) {
					this.$message.error("请填写收费金额");
					return;
				}
				config.pay_money_type = pay_money_type;
			} else {
				let status = false;
				for (let i = 0; i < pay_money_type.length; i++) {
					let item = pay_money_type[i];

					if (isNaN(item.time)) {
						status = true;
						break;
					}
 					if (item.time <= 0 || !item.price) {
						status = true;
						break;
					}
				}
			
				if (status) {
					this.$message.error("请填写正确的时间或者金额相数据");
					return;
				}
				config.pay_money_type = pay_money_type;
			}

			let res = await course.many_add(config);
			this.visible = false;
			let id = res.data.insertId;
			this.$alert("新建系列课成功", {
				confirmButtonText: "去优化",
				callback: action => {
					this.$router.push({
						path: "/course/many_detail/" + id,
					});
				},
			});
		},
		intoPlay(row) {
			let { id } = row;
			this.$router.push({
				path: "/course/many_detail/" + id,
			});
		},
		intoEdit(row) {
			let { id } = row;
			this.$router.push({
				path: "/course/many_detail/" + id,
			});
		},
		changePayType(val) {
			var val = parseInt(val);
			this.showMoney = false;
			this.showMoneyByTime = false;
			if (val == 1) {
				this.showMoney = true;
			} else {
				this.showMoneyByTime = true;
				this.form.pay_money_type = [
					{
						time: "",
						pay_money: "",
					},
				];
			}
		},
		handleCommand(command) {
			let [mand, id] = command.split("|");
			switch (mand) {
				case "a":
					this.$router.push({
						path: "/course/add",
						query: {
							pid: id,
						},
					});
					break;
				case "b":
					this.addHasCourse(id);
					break;
				case "c":
					break;
				case "d":
					this.operateOnline(id);
					break;
				case "e":
					this.cuxiao(id);
					break;
				default:
					break;
			}
		},
		handleSale(command) {
			let [mand, id] = command.split("|");
			switch (mand) {
				case "a":
					this.cuxiao(id);
					break;
				case "b":
					this.cancelCuxiao(id);
					break;
				default:
					break;
			}
		},
		cuxiao(id) {
			this.cuxiaoVisible = true;
			this.saleForm.cuxiao_id = id;
		},
		async cancelCuxiao(id) {
			let res = await course.updateCu({
				id: id,
				cu_price: 0,
				cu_status: 0
			});
			if (res.code == 200) {
				this.cuxiaoVisible = false;
				this.$message.success(res.msg);
				this.fetData()
			}
		},
		async addCu() {
			let {
				cu_price,
				cuxiao_id
			} = this.saleForm;

			let res = await course.updateCu({
				id: cuxiao_id,
				cu_price,
				cu_status: 1
			});
			if (res.code == 200) {
				this.cuxiaoVisible = false;
				this.$message.success(res.msg);
				this.fetData()
			}
		},
		async operateOnline(id) {
			let on = 0;
		
			this.tableData.forEach(item => {
				if (item.id == id) {
					on = item.on
				}
			});
			
			let res = await course.updateOnline({
				id,
				on: on == 0 ? 1 : 0
			});
			if (res.code == 200) {
				this.$message.success(res.msg);
				this.fetData();
			}
			

		},
		jumpPage(row) {
			let { id } = row;
			this.$router.push({
				path: "/course/many_panel",
				query: {
					id: id,
				},
			});
		},
		addTypeByTime() {
			this.form.pay_money_type.push({
				time: "",
				pay_money: "",
			});
		},
		delPayMonnyItem(idx) {
			this.form.pay_money_type.splice(idx, 1);
			console.log(this.form.pay_money_type);
		},
		addHasCourse(pid) {
			this.dialogVisible = true;
			this.batchPid = pid;
			this.getAllAloneCourses();
		},
		async getAllAloneCourses() {
			let result = await course.list({
				page: this.aloneCurrentPage,
				pageSize: this.alonePageSize,
				status: "",
			});
			let { list, total } = result.data;
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
				pid: this.batchPid,
			});
			this.dialogVisible = false;
			if (up) {
				this.$message.success("添加完成");
				this.batchPid = "";
			}
		},
		async setJingpin(row) {
			let res = await course.updateManyJingpin({
				id: row.id,
				jingpin: 1
			});
			if (res.code == 200) {
				this.$message.success(res.msg)
				this.fetData();
			}
		},
		async cancelJingpin(row) {
			let res = await course.updateManyJingpin({
				id: row.id,
				jingpin: 0
			});

			if (res.code == 200) {
				this.$message.success(res.msg)
				this.fetData();
			}
		}
	},
};
</script>

<style scoped>
 .el-dropdown-link {
    cursor: pointer;
    color: #eb5f28;
}
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
.course_name {
	color: #333;
}

.el-dropdown-link {
	margin-right: 10px;
}
.editbtn {
	margin-right: 10px;
}
.short_input {
	width: 150px;
}
.del_btn {
	margin-left: 20px;
	position: relative;
	top: -2px;
}
.pay_money_type_item {
	margin-bottom: 10px;
}

.by_time strong {
	color: red;
}
.by_time2 strong{
	color: green;
}
</style>
