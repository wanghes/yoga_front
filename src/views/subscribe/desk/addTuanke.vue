<template>
    <el-form :model="form" label-position="top">
        <el-form-item required label="选择上课日期">
            <el-date-picker
                v-model="form.start_date"
                type="date"
                placeholder="请选择上课日期">
            </el-date-picker>
        </el-form-item>
            <el-form-item required label="开始和结束时间点设置">
            <el-time-select
                placeholder="起始时间"
                v-model="form.start_time"
                :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '20:00'
                }">
            </el-time-select>
            <el-time-select
                placeholder="结束时间"
                v-model="form.end_time"
                :picker-options="{
                    start: '08:30',
                    step: '00:30',
                    end: '20:00',
                    minTime: form.start_time
                }">
            </el-time-select>
        </el-form-item>
        <el-form-item required label="选择课程">
                <el-select v-model="form.agree_id" placeholder="选择课程">
                <el-option
                    v-for="item in courses"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="选择上课老师">
            <el-select v-model="form.teacher_id" placeholder="选择上课老师">
                <el-option
                    v-for="item in teachers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="选择场地">
            <el-select v-model="form.ground_id" placeholder="选择场地">
                <el-option
                    v-for="item in rooms"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item required label="设置最大参与人数">
            <el-input-number v-model="form.p_num" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="saveData">保 存 数 据</el-button>
        </el-form-item>
    </el-form>
      
</template>

<script>
const schedule = require('@/api/schedule');
const room = require('@/api/room');
import { dateFormatYMD } from '@/utils/index';
export default {
    props:['courses', 'teachers'],
    data() {
        return {
            rooms: [],
            form: {
                start_date: '',
                start_time: "",
                end_time: "",
                p_num: 0,
                ground_id: "",
                agree_id:"",
                teacher_id: ""
            }
        }  
    },
    mounted() {
        this.fetchRooms()
    },
    methods: {
        async fetchRooms() {
            let res = await room.getRooms();
            console.log(res)
            this.rooms = res.data;
        },
        async saveData() {
            let {
                start_date,
                start_time,
                end_time,
                ground_id,
                p_num,
                agree_id,
                teacher_id
            } = this.form;

            if (!start_date) {
                
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
            if (!agree_id) {
                this.$message.error("请选择课程")
                return;
            }
            if (!teacher_id) {
                this.$message.error("请选择老师")
                return;
            }
            if (!ground_id) {
                this.$message.error("请选择场地")
                return;
            }
            if (!p_num) {
                this.$message.error("请设置最大参与人数")
                return;
            }

    
            start_date = dateFormatYMD(new Date(start_date));
            let res = await schedule.add({
                start_date,
                start_time,
                end_time,
                ground_id,
                p_num,
                agree_id,
                teacher_id
            });
           
            if (res.code) {
                this.$emit('refreshData');
            }
            
        }
    }
}
</script>

<style scoped>

</style>