<template>
    <div class="wrap">
        <div class="top_box">
            <el-button type="primary" @click="showPaike">添加班课排课</el-button>
        </div>
        <el-divider></el-divider>
        <div class="main_box">
            <div class="search_box">
                <div>
                    <el-select v-model="course" placeholder="所有课程" @change="courseChange" clearable>
                        <el-option
                            v-for="item in courses"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select v-model="teacher" placeholder="所有老师" @change="teacherChange" clearable>
                        <el-option
                            v-for="item in teachers"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="controls">
                    <el-button size="small" @click="prevWeek" type="primary">上一周</el-button>
                    <el-date-picker
                        v-model="dateValue"
                        type="date"
                        size="medium"
                        @change="changeDate"
                        placeholder="选择日期">
                    </el-date-picker>
                    <el-button size="small" @click="nextWeek" type="primary">下一周</el-button>
                </div>
            </div>
            <table class="weeks">
                <thead>
                    <tr>
                        <th>上课时间</th>
                        <th v-for="item,idx in rankWeeks" :key="idx">{{item}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item,index in list" :key="index">
                        <td v-for="it,idx in item" :key="idx">
                            <div v-if="typeof it == 'string'">{{it}}</div>
                            <div v-else v-for="one,i in it" :key="i">
                                <div class="inner_box">
                                    <span class="time_show">{{one.start_time}}-{{one.end_time}}</span>
                                    <span>课程：{{one.course_name}}</span>
                                    <span>老师：{{one.teacher_name}}</span>
                                    <span>人数限制：{{one.p_num}}</span>
                                    <el-button style="width:100px; margin-top:10px" type="primary" size='mini'>管理</el-button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <el-dialog title="添加团课排课" width="60%" :visible.sync="addVisible">
            <addTuanke :teachers="teachers" :courses="courses" @refreshData="refreshData"></addTuanke>
        </el-dialog>
    </div>
</template>

<script>
const teacher = require('@/api/teacher');
const course = require('@/api/agreeCourse');
const schedule = require('@/api/schedule');
import { dateFormatYMD } from '@/utils/index';
import addTuanke from "./addTuanke";
export default {
    components:{
        addTuanke
    },
    data() {
        return {
            dateValue: new Date(),
            addVisible: false,
            rankWeeks: [],
            teachers:[],
            courses:[],
            course: "",
            teacher: '',
            addForm: {
                start_date: '',
                start_time: "",
                end_time: "",
                p_num: 0,
                ground_id: "",
                agree_id:"",
                teacher_id: ""
            },
            date: {
                start: "",
                end:""
            },
            list:[]
        };
    },
    mounted() {
        this.fetchTeachers();
        this.fetchDesks();
        this.rankWeeks = this.getWeekTime();

        setTimeout(() => {
            this.fetchData();
        },100);
    },
    methods: {
        async fetchData(){
            let start_date = dateFormatYMD(new Date(this.date.start)) + ' 00:00:00'
            let end_date = dateFormatYMD(new Date(this.date.end)) + ' 23:59:59'
            let res = await schedule.list({
                start_date,
                agree_id: this.course,
                teacher_id: this.teacher,
                end_date
            });
            let weeks = this.getWeeks(start_date);
            let tempData = [];
            let list = [];
            if (res.code) {
                tempData = res.data;
                tempData.forEach(item => {
                    let timenum = item.start_time.split(":");
                    item.timeSec = timenum[0] * 60 + timenum[1];
                });

                tempData = tempData.sort((a, b) => {
                    return a.timeSec - b.timeSec;
                });

                let dataList = {};
                
                tempData.forEach(item => {
                    if (dataList["time_"+item.timeSec]) {
                        dataList["time_"+item.timeSec].push(item)
                    } else {
                        dataList["time_"+item.timeSec] = [item];
                    }
                })
                
                for(let key in dataList) {
                    let layer = [dataList[key][0].start_time,[],[],[],[],[],[],[]]
                    weeks.forEach((item,index) => {
                        dataList[key].forEach(it => {
                            if (item == it.start_date.slice(0, 10)) {
                                layer[index + 1].push(it)
                            }
                        });
                    });
                    list.push(layer);
                }
                this.list = list;
            }
        },
        getWeeks(start) {
            let weeks = [];
            let temp = ''
            for(let i = 0; i < 7; i++) {
                let date = new Date(start);
                date.setDate(date.getDate() + i);
                temp = dateFormatYMD(date)
                weeks.push(temp)
            }
            return weeks;
        },
        refreshData() {
            this.addVisible = false;
            this.fetchData();
        },
        changeDate() {
            this.rankWeeks = this.getWeekTime();
            this.fetchData();
        },
        prevWeek() {
            this.rankWeeks =  this.getWeekTime(2);
            this.fetchData();
        },
        nextWeek() {
            this.rankWeeks =  this.getWeekTime(1);
            this.fetchData();
        },
        getWeekTime(isNext) {
            let that = this;
            var currentFirstDate;
            let formatDate = function (date) {
                const year = date.getFullYear() + "年";
                const month = date.getMonth() + 1 + "月";
                const day = date.getDate() + "日";
                const week = [
                    "星期日",
                    "星期一",
                    "星期二",
                    "星期三",
                    "星期四",
                    "星期五",
                    "星期六",
                ][date.getDay()];

                //return year + month + day + "  " + week;
                return month + day + "   " + week;
            };

            let addDate = function (date, n) {
                date.setDate(date.getDate() + n);
                return date;
            };

            let setDate = function (date) {
                var week = date.getDay() - 1;
                date = addDate(date, week * -1);
                currentFirstDate = new Date(date);

                var arr = [];
                
                for (var i = 0; i < 7; i++) {
                    var a = formatDate(i == 0 ? date : addDate(date, 1)); //星期一开始
                    arr.push(a);
                    if (i == 0) {
                        that.date.start = date.valueOf();
                    }

                    if (i == 6) {
                        that.date.end = date.valueOf();
                    }
                }
                return arr;
            };
            
            var num = 0;//num为0时表示当前周，递增或递减时周数也递增或递减
            if (isNext == 1) {
               let time = this.dateValue.setDate(this.dateValue.getDate() + 7);
               this.dateValue = new Date(time);
            } else if (isNext == 2) {
                let time = this.dateValue.setDate(this.dateValue.getDate() - 7)
                this.dateValue = new Date(time);
            } 
            setDate(new Date(this.dateValue.valueOf()));
            return setDate(addDate(currentFirstDate,7*num));
        },
        async fetchTeachers() {
            let res = await teacher.list({
                pageSize: 10000,
                page: 1,
            });
        
            let {list} = res.data;
            this.teachers = list
        },
        async fetchDesks() {
            let res = await course.list({
                pageSize: 10000,
                page: 1,
            });
            
            let {list} = res.data;
            this.courses = list
        },
        courseChange() {
            this.rankWeeks = this.getWeekTime();
            this.fetchData();
        },
        teacherChange() {
            this.rankWeeks = this.getWeekTime();
            this.fetchData();
        },
        showPaike() {
            this.addVisible = true;
        }
    },
};
</script>

<style lang="scss" scoped>
    .search_box{
        height: 60px;
        display: flex;
        justify-content: space-between;
    }
    .weeks{
        width:100%;
        border: 1px solid #efefef;
        
        border-collapse:collapse;
        thead{
            th{
                background: #f7f7f7;
                font-size: 14px;
                border: 1px solid #eaeaea;
                padding: 10px;
                font-weight: normal;
            }
        }
        tbody {
            td{
                background: #fff;
                font-size: 14px;
                border: 1px solid #eaeaea;
                padding: 10px;
                font-weight: normal;
                text-align: center;
            }
        }
    }
    .inner_box{
        display: flex;
        flex-direction: column;
        text-align: left;
        border:1px solid #eb5f28;
        padding: 15px;
        box-sizing: border-box;
        margin-bottom: 15px;
        background: #f5f5f5;
        line-height: 24px;
       
        .time_show{
            font-size: 16px;
            color: #eb5f28;
            margin-bottom: 5px;
        }
    }
    .inner_box:hover{
        background: #fefefe;
        cursor: pointer;
    }
</style>