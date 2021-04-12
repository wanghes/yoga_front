<template>
    <el-form :model="form" label-position="top">
        
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
        <el-form-item required label="课程颜色">
            <el-color-picker v-model="form.color"></el-color-picker>
        </el-form-item>
        <el-form-item required label="备注说明">
            <el-input
                type="textarea"
                placeholder="请输备注说明"
                v-model="form.des"
                maxlength="150"
                show-word-limit>
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
const schedule = require('@/api/schedule');
const room = require('@/api/room');

export default {
    props:['courses', 'teachers','id'],
    data() {
        return {
            rooms: [],
            form: {
                date: '',
                start_time: "",
                end_time: "",
                ground_id: "",
                agree_id:"",
                teacher_id: "",
                p_num: 0,
                color: '#f5f5f5',
                des: ""
            }
        }  
    },
    mounted() {
        this.queryScheduleById();
        this.fetchRooms()
    },
    
    watch:{    
        id: function(a, b){ //a是value的新值，b是旧值
            this.queryScheduleById();
            this.fetchRooms()
        }
    },
    methods: {
        async queryScheduleById() {
            let res = await schedule.query({
                id: this.id
            });
            this.form = res.data;
        },
        async fetchRooms() {
            let res = await room.getRooms();
            this.rooms = res.data;
        },
        
        async saveData() {
            let {
                start_date,
                end_date,
                start_time,
                end_time,
                ground_id,
                p_num,
                agree_id,
                teacher_id,
                color,
                des
            } = this.form;

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


            let res = await schedule.update({
                id: this.id,
                start_date,
                end_date,
                start_time,
                end_time,
                ground_id,
                p_num,
                agree_id,
                teacher_id,
                color,
                des
            });
           
            if (res.code) {
                this.$emit('refreshData');
            }
        
        },
        async stopClass() {
            let res = await schedule.updateStatus({
                id: this.id,
                status: 2
            });
             this.form.status = 2;
            if (res.code == 200) {
                this.$emit('refreshData');
            } else {
                console.log(res)
            }
        },
        async recoverClass() {
            let res = await schedule.updateStatus({
                id: this.id,
                status: 1
            });
            this.form.status = 1;
            if (res.code == 200) {
                this.$emit('refreshData');
            } else {
                console.log(res)
            }
        },
        async delClass() {
            let res = await schedule.deleteClass({
                id: this.id
            });
            if (res.code == 200) {
                this.$emit('refreshData');
            } else {
                console.log(res)
            }
        }
    }
}
</script>

<style scoped>

</style>