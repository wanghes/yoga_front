<template>
    <el-form :model="form" label-position="top">
        <el-form-item required label="选择上课日期">
            <el-date-picker v-model="form.date" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <div style="margin: 10px 0 0;"></div>
            <div class="weeks">
                <el-checkbox v-model="open_week_status" @change="handleCheckAllChange">开启星期周几排课
                </el-checkbox>
                <el-checkbox-group v-show="open_week_status" v-model="checkedWeeks"
                    @change="handleCheckedWeeksChange">
                    <el-checkbox v-for="day in weeks" :label="day" :key="day">{{days[day]}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </el-form-item>

        <el-form-item required label="开始和结束时间点设置">
            <el-time-select placeholder="起始时间" v-model="form.start_time" :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '20:00'
                }">
            </el-time-select>
            <el-time-select placeholder="结束时间" v-model="form.end_time" :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '20:00',
                    minTime: form.start_time
                }">
            </el-time-select>
        </el-form-item>
        <el-form-item required label="选择课程">
            <el-select v-model="form.agree_id" placeholder="选择课程">
                <el-option v-for="item in courses" :key="item.id" :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="选择上课老师">
            <el-select v-model="form.teacher_id" placeholder="选择上课老师">
                <el-option v-for="item in teachers" :key="item.id" :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="选择场地">
            <el-select v-model="form.ground_id" placeholder="选择场地">
                <el-option v-for="item in rooms" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="设置最大参与人数">
            <el-input-number v-model="form.p_num" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item required label="课程颜色">
            <el-color-picker v-model="form.color"></el-color-picker>
        </el-form-item>
        <el-form-item required label="备注说明">
            <el-input type="textarea" placeholder="请输备注说明" v-model="form.des" maxlength="150"
                show-word-limit>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="saveData">保 存 数 据</el-button>
        </el-form-item>
    </el-form>

</template>

<script>
const schedule = require("@/api/schedule");
const room = require("@/api/room");
import { dateFormatYMD } from "@/utils/index";
export default {
	props: ["courses", "teachers"],
	data() {
		return {
			rooms: [],
			open_week_status: false,
			isIndeterminate: true,
			checkedWeeks: [],
			weeks: [1, 2, 3, 4, 5, 6, 0],
			days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
			form: {
				start_date: "",
				start_time: "",
				end_time: "",
				p_num: 0,
				ground_id: "",
				agree_id: "",
				teacher_id: "",
				color: "#f5f5f5",
				des: "",
			},
		};
	},
	mounted() {
		this.fetchRooms();
		this.checkedWeeks = this.open_week_status ? this.weeks : [];
	},
	methods: {
		async fetchRooms() {
			let res = await room.getRooms();
			this.rooms = res.data;
		},
		filterWeekDate(date, weeks) {
			let newWeeks = JSON.parse(JSON.stringify(weeks));
			let addedweeks = [];
			let [start, end] = date;
			let start_time = new Date(start);
			let end_time = new Date(end);
			let temp = newWeeks.pop();

			while (temp >= 0) {
				while (start_time <= end_time) {
					let addDate = dateFormatYMD(start_time);

					if (temp == start_time.getDay()) {
						addedweeks.push(addDate);
					}
					start_time.setDate(start_time.getDate() + 1);
				}
				start_time = new Date(start);
				temp = newWeeks.pop();
			}

			return addedweeks;
		},
		async saveData() {
			let {
				date,
				start_time,
				end_time,
				ground_id,
				p_num,
				agree_id,
				teacher_id,
				color,
				des,
			} = this.form;
			let open_week = this.open_week_status ? 1 : 0;

			if (!date || !date.length) {
				this.$message.error("请选择上课日期");
				return;
			}

			if (open_week == 1 && !this.checkedWeeks.length) {
				this.$message.error("请选择周几上课日期");
				return;
			}

			let addedWeeks = this.filterWeekDate(date, this.checkedWeeks);

			if (!start_time) {
				this.$message.error("请选择上课开始时间");
				return;
			}
			if (!end_time) {
				this.$message.error("请选择上课结束时间");
				return;
			}
			if (!agree_id) {
				this.$message.error("请选择课程");
				return;
			}
			if (!teacher_id) {
				this.$message.error("请选择老师");
				return;
			}
			if (!ground_id) {
				this.$message.error("请选择场地");
				return;
			}
			if (!p_num) {
				this.$message.error("请设置最大参与人数");
				return;
			}

			let start_date = dateFormatYMD(new Date(date[0]));
			let end_date = dateFormatYMD(new Date(date[1]));

			let res = await schedule.add({
				start_date,
				end_date,
				start_time,
				end_time,
				ground_id,
				p_num,
				agree_id,
				teacher_id,
				open_week,
				color,
				des,
				weeks: addedWeeks,
			});

			if (res.code) {
				this.$emit("refreshData");
			}
			this.form = {
				start_date: "",
				start_time: "",
				end_time: "",
				p_num: 0,
				ground_id: "",
				agree_id: "",
				color: "",
				teacher_id: "",
				des: "",
			};
		},
		handleCheckAllChange(val) {
			this.checkedWeeks = val ? this.weeks : [];
			this.isIndeterminate = false;
		},
		handleCheckedWeeksChange(value) {
			let checkedCount = value.length;
			// this.open_week_status = checkedCount === this.weeks.length;
			// this.isIndeterminate = checkedCount > 0 && checkedCount < this.weeks.length;
		},
	},
};
</script>

<style scoped>
</style>