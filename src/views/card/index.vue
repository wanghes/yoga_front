<template>
    <div class="wrap">
        <div class="top_info">
            <div class="left_search">
                <el-select clearable v-model="searchForm.status" placeholder="卡可售状态" @change="statusChange">
                    <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select clearable v-model="searchForm.type" placeholder="卡类别" @change="typeChange">
                    <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                    class="input_search"
                    placeholder="请填写卡种名称"
                    clearable
                    @keyup.enter.native="nameChange"
                    @clear="nameChange"
                    v-model="searchForm.name">
                    <i slot="suffix" @click="nameChange" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <el-button-group class="btn_wrap">
                <el-button type="primary" @click="toAdd">新建卡种</el-button>
            </el-button-group>
        </div>
        
        <el-table :data="list" :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
            <el-table-column width="180" label="卡种类封面">
                <template slot-scope="scope">
                    <div class="card_wrap">
                        <img width="150" :src="scope.row.cover" alt="">
                    </div>
                </template>
            </el-table-column>  
            <el-table-column prop="name" width="200" label="卡种类名称"></el-table-column>  
            <el-table-column prop="type" width="80" label="卡类别">
                <template slot-scope="scope">
                    <span v-if="scope.row.type==1">次卡</span>
                    <span v-if="scope.row.type==2">年卡</span>
                    <span v-if="scope.row.type==3">季卡</span>
                    <span v-if="scope.row.type==4">月卡</span>
                    <span v-if="scope.row.type==5">周卡</span>
                    <span v-if="scope.row.type==6">储值卡</span>
                    <span v-if="scope.row.type==7">小时卡</span>
                </template>
            </el-table-column> 
            <el-table-column prop="price" width="130" label="价值(元)">
                <template slot-scope="scope">
                    <span>￥{{scope.row.price.toFixed(2)}}</span>
                </template>
            </el-table-column>  
            <el-table-column prop="expire_date_on"  width="120" label="卡有效期(天)">
                <template slot-scope="scope">
                    <span v-if="scope.row.expire_date_on==1">{{scope.row.expire_date}}天</span>
                    <span v-else>不限</span>
                </template>
            </el-table-column>  
            <el-table-column prop="times" width="100" label="上课次数">
                <template slot-scope="scope">
                    <span v-if="scope.row.times > 0">{{scope.row.times}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>  
            <el-table-column prop="hours" width="100" label="上课小时数">
                <template slot-scope="scope">
                    <span v-if="scope.row.hours > 0">{{scope.row.hours}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column> 
            
            <el-table-column width="150" label="限制上课的人数">
                <template slot-scope="scope">
                    <span>仅限 <strong class="limit_people">{{scope.row.limit_people}}</strong> 人使用</span>
                </template>
            </el-table-column>
            <el-table-column prop="order" width="80" label="显示顺序">
            </el-table-column>
            <el-table-column width="150" label="绑定的课程">
                <template slot-scope="scope">
                    <span v-if="scope.row.count > 0">已绑定 <strong class="limit_people">{{scope.row.count}}</strong> 门课程</span>
                    <span v-else>未绑定课程</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" fit label="可售状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" @change="changeSwitchStatus(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="160">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="editItem(scope.row.id)">编辑</el-button>
                    <el-popover
                        placement="top"
                        trigger="click"
                        :width="160">
                        <div style="margin-bottom: 10px;">
                            <span>你确定要删除该卡种吗？</span>
                        </div>
                        <div style="text-align: center; margin: 0">
                            <el-button type="primary" size="mini" @click="deleteItem(scope.row.id)">确定</el-button>
                        </div>
                        <template slot="reference">
                            <el-button size="mini" type="danger">删除</el-button>
                        </template>
                    </el-popover>   
                    
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: center; margin: 30px 0;">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[15, 30, 50]"
                :page-size="pageSize"
                :total="total">
            </el-pagination>
        </div>

    </div>

</template>
<script>
const api = require("@/api/card");
export default {
    data() {
        return {
            list:[],
            currentPage:1,
            pageSize:15,
            total: 0,
            searchForm: {
                status: "",
                type: "",
                name: ""
            },
            status: [
                {
                    value: 1,
                    label: "可售"
                },
                {
                    value: 0,
                    label: "不可售"
                }
            ],
            types: [
                {
                    value: 1,
                    label: "次卡"
                },
                {
                    value: 2,
                    label: "年卡"
                },
                {
                    value: 3,
                    label: "季卡"
                },
                {
                    value: 4,
                    label: "月卡"
                },
                {
                    value: 5,
                    label: "周卡"
                },
                {
                    value: 6,
                    label: "储值卡"
                },
                {
                    value: 7,
                    label: "小时卡"
                }
            ]
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            let {
                name,
                type,
                status
            } = this.searchForm;

            let res = await api.list({
                pageSize: this.pageSize,
                page: this.currentPage,
                name,
                type,
                status
            });

            let {
                list, total
            } = res.data; 

            list.forEach(item => {
                item.status = item.status == 1 ? true : false;
            })

            this.list = list;
           
            this.total = total;
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.fetchData();
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage;
            this.fetchData();
        },
        async changeSwitchStatus(row) {
            let res = await api.updateStatus({
                id: row.id,
                status: row.status ? 1 : 0
            });
            if (res.code) {
                this.$message.success("修改成功")
            }
        },
        async editItem(id) {
            this.$router.push({
                path: '/card/edit/' +id
            })
        },
        async deleteItem(id) {
            let res = await api.deleteItem({
                id,
            });
            if (res.code == 200) {
                this.$message.success("操作成功");
                this.fetchData();
            }
        },
        toAdd() {
            this.$router.push({
                path: '/card/add'
            })
        },
        statusChange() {
            this.fetchData()
        },
        typeChange() {
            this.fetchData()
        },
        nameChange() {
            this.fetchData()
        }
    }

}
</script>
<style lang="scss" scoped>
.top_info{
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}
.right_search{
    display: flex;
    align-items: center;
    position:relative;
    top: -10px;
}
.input_search {
    display: inline-block;
    width: 230px;
    margin-left:15px;
}
.limit_people{
    color:red;
}
</style>