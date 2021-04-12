<template>
    <div class="wrap">
        <div class="info">
            <div class="list">
                <div class="item">
                    <label class="label">卡种类名称</label>
                    <el-link type="info">{{form.name}}</el-link>
                </div>
                <div class="item">
                    <label class="label">类别</label>
                    <el-link type="info">{{cards[form.type]}}</el-link>
                </div>
                <div class="item">
                    <label class="label">金额</label>
                    <el-link type="info">{{form.price}}</el-link>
                </div>
            </div>
            <div class="list">
                <div class="item">
                    <label class="label">有效期</label>
                    <el-link type="info">{{form.expire_date}}</el-link>
                </div>
                <div class="item">
                    <label class="label">次数</label>
                    <el-link type="info">{{form.type==1 ? form.times : '--'}}</el-link>
                </div>
                <div class="item">
                    <label class="label">显示顺序</label>
                    <el-link type="info">{{form.order}}</el-link>
                </div>
               
            </div>
        </div>
        <el-divider></el-divider>
        <el-tabs v-model="activeName" type="card" v-on:tab-click="handleClick">
            <el-tab-pane label="卡种类信息" name="first"> 
                <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
                    <el-form-item label="卡种类名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="售价">
                        <el-input-number v-model="form.price"></el-input-number> 元
                    </el-form-item>
                
                    <el-form-item label="单次可约最大人数">
                        <el-input-number placeholder="单次可约最大人数" v-model="form.limit_people"></el-input-number> 人
                    </el-form-item>
                    <el-form-item label="显示顺序">
                        <el-input-number placeholder="填写显示顺序" v-model="form.order"></el-input-number>
                    </el-form-item>
                    <el-form-item label="结账方式">
                        <el-radio-group v-model="form.balance_type">
                            <el-radio-button :label="0">进场结账</el-radio-button>
                            <el-radio-button :label="1">进场登记，出场结账</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="会员卡使用说明">
                        <el-input 
                            type="textarea"
                            placeholder="填写会员卡使用说明" 
                            maxlength="255"
                            show-word-limit
                            v-model="form.remark">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveData">保 存 数 据</el-button>
                    </el-form-item>
                </el-form> 
            </el-tab-pane>
            <el-tab-pane label="卡可消费课程" name="second"> 
                 <el-table ref="multipleTable"
                    :data="cardBindCourses"
                    tooltip-effect="dark"
                    :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        label="是否支持"
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="agree_course_name"
                        label="支持的课程"
                        fit>
                    </el-table-column>
                    <el-table-column
                        v-if="form.type == 1"
                        prop="times"
                        label="单位消费数量">
                        <template slot-scope="scope">
                            每次上课消费扣除 <el-input style="width:80px" v-model="scope.row.times"></el-input> 次/人
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="form.type == 6"
                        prop="amount"
                        label="单位消费数量">
                        <template slot-scope="scope">
                            每次上课消费扣除 <el-input style="width:80px" v-model="scope.row.amount"></el-input> 元/人
                        </template>
                    </el-table-column>
                </el-table>
                <div class="b_btn">
                    <el-button type="primary" @click="saveAllBinds">保 存</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
        
    </div>
</template>

<script>
const api = require("@/api/card");
const course = require("@/api/agreeCourse");
export default {
    data() {
        return {
            activeName: "first",
            form: {
                name: '',
                price: "",
                limit_people:"",
                order: 0,
                remark: "",
                balance_type: "",
                type: ""
            },
            multipleSelection: [],
            courses: [],
            cardBindCourses:[],
            cards:['','次卡','年卡','季卡','月卡','周卡','储值卡','小时卡']
        }
    },
    mounted() {
        this.fetchData();
    }, 
    methods: {
        async fetchData() {
            let id = this.$route.params.id;
            let res = await api.query({
                id
            });
            if (res.code) {
                this.form = res.data;
            }
        },
        async fetchAllList() {
            let res = await course.allList();
            if (res.code) {
                this.courses = res.data;
                this.fetchCardBindCourse()
            }  
        },
        async fetchCardBindCourse() {
            let id = this.$route.params.id;
            let res = await api.list_by_card_id({
                card_id:id
            });
            let list = [];
            if (res.code == 200) {
                list = res.data;
            }

            this.cardBindCourses = [];
            this.courses.forEach(item => {
                this.cardBindCourses.push({
                    card_id: id,
                    agree_course_id: item.id,
                    agree_course_name: item.name,
                    amount: 0,
                    times: 1
                })
            });
           
            let temp = [];
            this.courses.forEach(item => {
                list.forEach(it => {
                    if (it.agree_course_id == item.id) {
                        temp.push({
                            card_id: id,
                            agree_course_id: item.id,
                            agree_course_name: item.name,
                            amount: this.form.type == 6 ? it.amount : 0,
                            times: this.form.type == 1 ? it.times : 1,
                            check: true
                        })
                    } 
                })  
            })
            let len = this.courses.length;
            let tmpItem = temp.pop();
           
            while(tmpItem) {
                for(let i = 0; i < len; i++) {
                    if (this.cardBindCourses[i].agree_course_id == tmpItem.agree_course_id) {
                        this.cardBindCourses.splice(i, 1, tmpItem);
                    }
                }
                tmpItem = temp.pop();
            }

            this.$nextTick(() => {
                this.cardBindCourses.forEach(row => {
                    if(row.check){
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    }
                })
            });
            
        },
        
        async saveData() {
            let id = this.$route.params.id;
            let {
                name,
                price,
                limit_people,
                balance_type,
                order,
                remark
            } = this.form;

            if (!name) {
                this.$message.error("请填写卡种类名称")
                return;
            }
           
            if (!price) {
                this.$message.error("请填写售价")
                return;
            }
          
            if (!limit_people) {
                this.$message.error("请填写单次可约最大人数")
                return;
            }

            let res = await api.update({
                id,
                name,
                price,
                limit_people,
                balance_type,
                order,
                remark
            });

            if (res.code == 200) {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push({
                    path: "/card/index"
                });
            } else {
                this.$message.error("数据保存失败");
                console.log(res);
            }
        },
        async saveAllBinds() {
            let data = this.multipleSelection.map(item => {
                let {
                    card_id,
                    agree_course_id,
                    amount,
                    times
                } = item;
                return {
                    card_id,
                    agree_course_id,
                    amount,
                    times
                }
            });

            let res = await api.cardBindAdd({
                'binds': data
            });
            if (res.code == 200) {
                this.fetchAllList();
                this.$message.success(res.msg);
            } else {
                this.$message.error(res.msg);
                console.log(res);
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleClick(tab, action) {
            if (tab.name == 'first') {
                this.fetchData();
            } else if (tab.name == 'second') {
                this.fetchAllList();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.days{
    padding-top: 15px;
}
.info{
    display: flex;
}

.list{
    .item{
        margin-bottom: 5px;
    }
    .label{
        font-size: 14px;
        color: #333;
        margin-right: 8px;
        width: 80px;
        text-align: right;
        display: inline-block;
    }
    padding-left: 15px;
}
.b_btn{
    padding: 20px 0;
    text-align: center;
}
</style>