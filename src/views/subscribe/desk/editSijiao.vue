<template>
    <el-form :model="form" label-position="top">
        <el-form-item required label="选择上课日期">
            <el-date-picker v-model="form.date" placeholder="选择上课日期">
            </el-date-picker>
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
        <el-form-item required label="选择老师">
            <el-select v-model="form.teacher" placeholder="选择老师">
                <el-option v-for="item in teachers" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="选择教室">
            <el-select v-model="form.room" placeholder="选择教室">
                <el-option v-for="item in rooms" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="设置课时分钟数">
            <el-select v-model="form.minutes" placeholder="设置课时分钟数">
                <el-option v-for="item in minutess" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="课程颜色">
            <el-color-picker v-model="form.color"></el-color-picker>
        </el-form-item>
        <el-form-item required label="备注说明">
            <el-input type="textarea" placeholder="请输备注说明" v-model="form.des" maxlength="150" show-word-limit>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            <el-button type="info" v-if="form.status==1" @click="stopClass">停 课</el-button>
            <el-button type="success" v-else @click="recoverClass">复 课</el-button>
            <el-button type="danger" @click="delClass">删 除</el-button>
        </el-form-item>
    </el-form>

</template>

<script>
const schedule = require("@/api/trainerSchedule");
const room = require("@/api/room");
import { dateFormatYMD } from "@/utils/index";
export default {
	props: ["teachers", "id"],
	data() {
		return {
			rooms: [],
			minutess: [
				"30分钟",
				"45分钟",
				"60分钟",
				"75分钟",
				"90分钟",
				"120分钟",
				"180分钟",
				"240分钟",
				"360分钟",
			],
			form: {
				date: "",
				start_time: "",
				end_time: "",
				minutes: "",
				color: "#f5f5f5",
				room: "",
				teacher: "",
				des: "",
			},
		};
	},
	mounted() {
		this.queryScheduleById();
		this.fetchRooms();
	},
	watch: {
		id: function (a, b) {
			this.queryScheduleById();
			this.fetchRooms();
		},
	},
	methods: {
		async queryScheduleById() {
			let res = await schedule.query({
				id: this.id,
			});
			this.form = res.data;
		},
		async fetchRooms() {
			let res = await room.getRooms();
			this.rooms = res.data;
		},
		async saveData() {
			let {
				date,
				start_time,
				end_time,
				room,
				teacher,
				minutes,
				color,
				des,
			} = this.form;

			if (!date) {
				this.$message.error("请选择上课日期");
				return;
			}
			if (!start_time) {
				this.$message.error("请选择上课开始时间");
				return;
			}
			if (!end_time) {
				this.$message.error("请选择上课结束时间");
				return;
			}

			if (!teacher) {
				this.$message.error("请选择老师");
				return;
			}
			if (!room) {
				this.$message.error("请选择教室");
				return;
			}
			if (!minutes) {
				this.$message.error("请设置课时分钟数");
				return;
			}

			date = dateFormatYMD(new Date(date));
			let res = await schedule.update({
				id: this.id,
				date,
				start_time,
				end_time,
				room,
				teacher,
				minutes,
				color,
				des,
			});

			if (res.code) {
				this.$emit("refreshData");
			}
		},
		async stopClass() {
			let res = await schedule.updateStatus({
				id: this.id,
				status: 2,
			});
			this.form.status = 2;
			if (res.code == 200) {
				this.$emit("refreshData");
			} else {
				console.log(res);
			}
		},
		async recoverClass() {
			let res = await schedule.updateStatus({
				id: this.id,
				status: 1,
			});
			this.form.status = 1;
			if (res.code == 200) {
				this.$emit("refreshData");
			} else {
				console.log(res);
			}
		},
		async delClass() {
			let res = await schedule.deleteClass({
				id: this.id,
			});
			if (res.code == 200) {
				this.$emit("refreshData");
			} else {
				console.log(res);
			}
		},
	},
};
</script>

<style scoped>
</style>