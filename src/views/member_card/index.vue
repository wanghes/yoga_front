<template>
    <div class="wrap">
        <el-table :data="list" :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}">
            <el-table-column width="100" label="会员头像">
                <template slot-scope="scope">
                    <div class="head">
                        <img v-if="scope.row.head" :src="scope.row.head" alt="头像">
                        <img v-else :src="head" alt="头像">
                    </div>
                </template>
            </el-table-column>  
            <el-table-column prop="card_no" width="160" label="卡号"></el-table-column>  
            <el-table-column prop="card_name" width="150" label="卡类别"></el-table-column>  
            <el-table-column prop="member_name" width="100" label="姓名"></el-table-column>  
            <el-table-column prop="phone" width="150" label="手机号"></el-table-column>  
            <el-table-column width="120" label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==0">未开卡</span>
                    <span v-else-if="scope.row.status==1">正常</span>
                    <span v-else>已用完</span>
                </template>
            </el-table-column>  
            <el-table-column width="150" label="剩余">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==0">未开卡</span>
                    <span v-else-if="scope.row.type == 1">{{scope.row.surplus}} 次</span>
                    <span v-else-if="scope.row.type == 6">{{scope.row.surplus.toFixed(2)}} 元</span>
                    <span v-else-if="scope.row.type == 7">{{scope.row.surplus}} 小时</span>
                    <span v-else>请查看有效期</span>
                </template>
            </el-table-column>  
            <el-table-column width="250" label="有效期">
                <template slot-scope="scope">
                    <span v-if="scope.row.expire_date_on == 1">{{scope.row.open_start_time.slice(0, 11)}} 到 {{scope.row.open_end_time.slice(0, 11)}}</span>
                    <span v-else>不限</span>
                </template>
            </el-table-column> 
            <el-table-column width="150" label="会籍顾问">
                <template>
                    <span>--</span>
                </template>
            </el-table-column>
            <el-table-column width="120" label="上次消费">
                <template slot-scope="scope">
                     <span>{{scope.row.cost_time.slice(0, 11)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="360">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" plain @click="editItem(scope.row)">卡操作</el-button>
                    <el-button type="primary" size="mini" plain @click="linkToMember(scope.row.member_id)">查看该会员</el-button>
                    <el-button v-if="scope.row.status==0" type="success" size="mini" @click="openCard(scope.row)">开卡</el-button>
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
                            <el-button size="mini" style="margin-left: 10px;" type="danger">删除</el-button>
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
const api = require('@/api/member_card');
const head = require('@/assets/member_head.png');
export default {
    data() {
        return {
            head,
            list:[],
            currentPage:1,
            pageSize:15,
            total: 0
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            let res = await api.list({
                pageSize: this.pageSize,
                page: this.currentPage,
            });
            if (res.code == 200) {
                let {
                    list, total
                } = res.data; 

                // list.forEach(item => {
                //     item.status = item.status == 1 ? true : false;
                // })
                this.list = list;
                this.total = total;
            }
        },
        handleSizeChange: function(val) {
            this.pageSize = val;
            this.fetchData();
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage;
            this.fetchData();
        },
        editItem(row) {
            this.$router.push({
                path: '/membercard/operate/' + row.card_no
            });
        },
        linkToMember(member_id) {
            this.$router.push({
                path: '/member/detail/' + member_id
            });
        },
        async openCard(row) {
          
            let res = await api.openCard({
                card_no: row.card_no
            });
            if (res.code == 200) {
                this.fetchData();
                this.$message.success(res.msg)
            } else {
                this.$message.error(res.msg);
                console.log(res);
            }
        },
        async deleteItem(id) {
            let res = await api.deleteItem({
                id
            });
            if (res.code == 200) {
                this.fetchData();
                this.$message.success(res.msg)
            } else {
                this.$message.error(res.msg);
                console.log(res);
            }
        }
    }
}
</script>

<style scoped lang="scss">
.head{
    width: 60px;
    height: 60px;
    img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
</style>