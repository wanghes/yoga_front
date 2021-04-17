<template>
    <el-form :model="addForm" label-position="top">
        <el-form-item required label="选择上课日期">
            <el-date-picker
                v-model="addForm.date"
                placeholder="选择上课日期">
            </el-date-picker>
        </el-form-item>

        <el-form-item required label="开始和结束时间点设置">
            <el-time-select
                placeholder="起始时间"
                v-model="addForm.start_time"
                :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '20:00'
                }">
            </el-time-select>
            <el-time-select
                placeholder="结束时间"
                v-model="addForm.end_time"
                :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '20:00',
                    minTime: addForm.start_time
                }">
            </el-time-select>
        </el-form-item>
        <el-form-item required label="选择老师">
            <el-select v-model="addForm.teacher" placeholder="选择老师">
                <el-option
                    v-for="item in teachers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="选择教室">
            <el-select v-model="addForm.room" placeholder="选择教室">
                <el-option
                    v-for="item in rooms"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="设置课时分钟数">
            <el-select v-model="addForm.minutes" placeholder="设置课时分钟数">
                <el-option
                    v-for="item in minutess"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="课程颜色">
            <el-color-picker v-model="addForm.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="备注说明">
            <el-input
                type="textarea"
                placeholder="请输备注说明"
                v-model="addForm.des"
                maxlength="150"
                show-word-limit>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="saveData">保 存 数 据</el-button>
        </el-form-item>
    </el-form>
      
</template>

<script>
const schedule = require('@/api/trainerSchedule');
const teacher = require('@/api/teacher');
const room = require('@/api/room');
import { dateFormatYMD } from '@/utils/index';
export default {
    props:['teachers'],
    data() {
        return {
            rooms: [],
            minutess: [
                '30分钟',
                '45分钟',
                '60分钟',
                '75分钟',
                '90分钟',
                '120分钟',
                '180分钟',
                '240分钟',
                '360分钟'
            ],
            addForm: {
                date: '',
                start_time: "",
                end_time: "",
                minutes: "",
                color: '#f5f5f5',
                room: "",
                teacher: "",
                des: ""
            }
        }  
    },
    mounted() {
        this.fetchRooms();
    },
    methods: {
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
                des
            } = this.addForm;

            if (!date) {
                this.$message.error("请选择上课日期")
                return;
            }
            if (!start_time) {
                this.$message.error("请选择上课开始时间")
                return;
            }
            if (!end_time) {
                this.$message.error("请选择上课结束时间")
                return;
            }
            
            if (!teacher) {
                this.$message.error("请选择老师")
                return;
            }
            if (!room) {
                this.$message.error("请选择教室")
                return;
            }
            if (!minutes) {
                this.$message.error("请设置课时分钟数")
                return;
            }
            
            date = dateFormatYMD(new Date(date));
            let res = await schedule.add({
                date,
                start_time,
                end_time,
                room,
                teacher,
                minutes,
                color,
                des
            });
           
            if (res.code == 200) {
                this.$emit('refreshData');
                this.addForm = {
                    date: '',
                    start_time: "",
                    end_time: "",
                    minutes: "",
                    color: '#409EFF',
                    room: "",
                    teacher: "",
                    des: ""
                }
            } else {
                console.log(res)
            }

    
        }
    }
}
</script>

<style scoped>

</style>