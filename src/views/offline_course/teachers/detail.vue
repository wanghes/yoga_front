<template>
    <div class="wrap">
        <div class="top">
            <div class="top_left">
                <div class="head">
                    <img v-if="form.avatar" :src="form.avatar" alt="头像">
                    <img v-else :src="headDefault" alt="头像">
                </div>
                <div class="center">
                    <div class="item"><label>姓名：</label><span>{{form.name}}</span></div>
                    <div class="item"><label>昵称：</label><span>{{form.nickname}}</span></div>
                    <div class="item"><label>电话：</label><span>{{form.phone}}</span></div>
                </div>
                <div class="center_right">
                    <div class="item">
                        <label>从业经验：</label>
                        <span v-if="!!form.jingyan" class="jingyan">{{form.jingyan}}</span>
                        <span v-else class="jingyan">目前还没有设置老师的经验</span>
                    </div>
                    <div class="item"><label>入职时间：</label><span>{{form.join_date.slice(0, 10)}}</span></div>
                    <div class="item"><label>显示顺序：</label><span>{{form.order}}</span></div>
                </div>
            </div>
            <div class="btns">
                <el-button type="primary">编辑</el-button>
            </div>
        </div>
        <el-divider></el-divider>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first"> 
                <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
                    <el-form-item label="老师头像">
                        <img class="head_cover" v-if="form.avatar" :src="form.avatar" />
                        <img class="head_cover" v-else :src="headDefault" />
                        <el-upload
                            class="upload_box"
                            action="fakeaction"
                            :show-file-list="false"
                            :auto-upload="true"
                            :http-request="uploadSectionFile">
                            <el-button type="danger">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">建议尺寸100×100，JPG、PNG、webp格式，图片小于5M。</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item required label="姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item required label="手机">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="form.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="入职时间">
                        <el-date-picker
                            v-model="form.join_date"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="生日">
                        <el-date-picker
                            v-model="form.birthday"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item  label="显示顺序">
                        <el-input-number v-model="form.order"></el-input-number>
                    </el-form-item>
                    <el-form-item label="是否支持私教">
                        <el-radio-group v-model="form.can_alone">
                            <el-radio :label="0">不支持</el-radio>
                            <el-radio :label="1">支持</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item required="" label="一句话描述">
                        <el-input v-model="form.des"
                            type="textarea"
                            placeholder="填写一句话描述" 
                            maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="教学经验">
                        <el-input v-model="form.jingyan"
                            type="textarea"
                            placeholder="填写教学经验" 
                            maxlength="255">
                        </el-input> 
                    </el-form-item>
                    <el-form-item label="身份证照">
                        <img class="id_img" v-if="form.id_card" :src="form.id_card" />
                        <div class="empty_pic" v-else>建议尺寸400×250，JPG、PNG、webp格式，图片小于5M。</div>
                        <el-upload
                            class="upload_box"
                            action="action"
                            :show-file-list="false"
                            :auto-upload="true"
                            :http-request="uploadIdSectionFile">
                            <el-button type="danger">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">建议尺寸400×250，JPG、PNG、webp格式，图片小于5M。</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="详细介绍">
                        <VueUeditorWrap class="UEditor" v-model="form.content" :config="ueConfig" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveData">保 存 数 据</el-button>
                        <el-button type="info" @click="cancelSubmit">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="私教预约设置" name="second"> 
                <div v-if="detail.can_alone==1" class="shezhi">
                    <el-table ref="multipleTable"
                        :data="sijiaoBindedCards"
                        tooltip-effect="dark"
                        :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                       
                        <el-table-column
                            prop="card_name"
                            label="支持预约的会员卡"
                            width="300">
                        </el-table-column>
                        
                        <el-table-column
                            prop="setted"
                            label="单位消费数量">
                            <template slot-scope="scope">
                                <div class="per_box" v-if="scope.row.card_type == 1">
                                    <el-input-number placeholder="请输入单位消费数量" v-model="scope.row.setted"></el-input-number> 
                                    <span>次</span>
                                </div>
                                <div class="per_box" v-if="scope.row.card_type == 6">
                                    <el-input-number placeholder="请输入单位消费数量" v-model="scope.row.setted"></el-input-number>
                                    <span>元/小时</span>
                                </div>
                                <div v-else></div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="b_btn">
                        <el-button type="primary" @click="saveAllBinds">保 存</el-button>
                    </div>
                </div>
                <el-alert v-else title="目前该老师还不支持私教课" :closable="false" type="error">
                </el-alert>
            </el-tab-pane>

            <el-tab-pane label="设置课时费用" name="third">
                <div class="inner_box">
                    <h3>团课课时费设置</h3>
                </div>
                <div v-if="teacherCourses.length" class="content_box">
                    <el-table ref="multipleCoursesTable"
                        :data="teacherCourses"
                        tooltip-effect="dark"
                        :header-cell-style="{'color':'#333', 'background-color':'#f5f5f5'}"
                        @selection-change="handleSelectionTeacherCoursesChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            prop="course_name"
                            label="团课项目"
                            width="300">
                        </el-table-column>
                        <el-table-column
                            prop="must_course_num"
                            label="每月义务授课节数"
                            width="400">
                            <template slot-scope="scope">
                                <div class="per_box">
                                    <el-input-number placeholder="每月义务授课节数" v-model="scope.row.must_course_num"></el-input-number> 
                                    <span>节</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="course_price"
                            label="基本课时费">
                            <template slot-scope="scope">
                                <div class="per_box">
                                    <el-input-number placeholder="基本课时费" v-model="scope.row.course_price"></el-input-number> 
                                    <span>元/节</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="b_btn">
                        <el-button type="primary" @click="saveTeacherPricesAllBinds">保 存</el-button>
                    </div>
                </div>
                <div v-else>
                    <el-alert
                        title="还没有给老师排课，快去排课吧"
                        type="error">
                    </el-alert>
                </div>
                <el-divider></el-divider>
                <div class="inner_box">
                    <h3>私教课时费设置</h3>
                </div>
                <div v-if="detail.can_alone==1">   
                    <el-input-number placeholder="私教课时费" v-model="sijiao_price"></el-input-number> 
                    <span>元/节</span>
                    <div class="b_btn">
                        <el-button type="primary" @click="saveSijiaoPrice">保 存</el-button>
                    </div>
                </div>
                <div v-else>
                    <el-alert title="目前该老师还不支持私教课" type="error">
                    </el-alert>
                </div>
            </el-tab-pane>
            <el-tab-pane label="评价" name="fourth"> 
                <el-alert
                    title="功能开发中，敬请期待"
                    type="info">
                </el-alert>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
const teacher = require('@/api/teacher');
const schedule = require('@/api/schedule');
const headCover = require('@/assets/head.png');
const idImg = require('@/assets/id.jpg');
const card = require('@/api/card');
import VueUeditorWrap from 'vue-ueditor-wrap';
import {UEDITOR_DOMAIN} from "@/config"
import {dateFormat} from "@/utils/index";

export default {
     components: {
        VueUeditorWrap
    },
    data() {
        return {
            activeName: "first",
            headDefault: headCover,
            idImg: idImg,
            sijiaoBindedCards:[],
            sijiao_price: 0,
            ueConfig: {
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 640,
                // 初始容器宽度
                initialFrameWidth: '100%',
                autoFloatEnabled: false,
                // 上传文件接口
                serverUrl: `${UEDITOR_DOMAIN}/upload/ue_upload`,
                // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项
                UEDITOR_HOME_URL: '/static/UEditor/'
            },
            detail: {},
            form: {
                avatar: "",
                name: "",
                nickname: "",
                phone: "",
                jingyan: "",
                join_date: "",
                birthday: "",
                order: "",
                can_alone: 0,
                id_card: "",
                des: "",
                content: ''
            },
            multipleSelection:[] ,
            multipleTeacherCoursesSelection:[],
            teacherCourses:[]
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const id = this.$route.params.id;
            const res = await teacher.query({id});
            this.form  = this.detail = res.data;
            this.sijiao_price = res.data.can_alone_price;

        },
        async getTypeCards() {
            
        },
        async uploadSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            let res = await teacher.uploadHead(form);
            this.form.avatar = res.data.data.imagePath;
        },
        async uploadIdSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("idcard", fileObj);
            let res = await teacher.uploadIdCard(form);
            this.form.id_card = res.data.data.imagePath;
        },
        async fetchTeacherCourses() {
            const id = this.$route.params.id;
            let res = await schedule.teacher_courses({
                id
            });
            if (res.code == 200) {
                this.teacherCourses = res.data;
                this.$nextTick(() => {
                    this.teacherCourses.forEach(row => {
                        if(row.course_price){
                            this.$refs.multipleCoursesTable.toggleRowSelection(row, true);
                        }
                    })
                });
               
            }
        },
        cancelSubmit() {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.back(-1);
        },
        handleClick(tab, event) {
            if (tab.name == 'first') {
                this.fetchData();
            } else if (tab.name == 'second') {
                this.fetchSijiaoCardinfo();
            } else if (tab.name == 'third') {
                this.fetchTeacherCourses();
            }
        },
        async fetchSijiaoCardinfo() {
            const id = this.$route.params.id;
            let res = await teacher.sijiao_cardinfo({
                id
            });
            let support_cardinfo = res.data.support_cardinfo;
            let sijiaoBindedCards = []
            let res2 = await card.all();
            if (res2.code == 200) {
                sijiaoBindedCards = res2.data.map(item => {
                    return {
                        card_id: item.id,
                        card_name: item.name,
                        setted: "",
                        card_type: item.type,
                        check: false
                    }
                });
            }

            let values = support_cardinfo.split(',');
            let arr =[];
            let card_len = sijiaoBindedCards.length;

            values.forEach(item => {
                let tem = item.split('_');
                let obj = {
                    card_id: tem[0],
                    setted: tem[1],
                    check: true
                }
                arr.push(obj)
            });

            let outItem = arr.pop();
            while(outItem) {
                for(let i = 0; i < card_len; i++) {
                    if (sijiaoBindedCards[i].card_id == outItem.card_id) {
                        outItem.card_name = sijiaoBindedCards[i].card_name;
                        outItem.card_type = sijiaoBindedCards[i].card_type;
                        sijiaoBindedCards.splice(i, 1, outItem);
                    }
                }
                outItem = arr.pop();
            }
            this.sijiaoBindedCards = sijiaoBindedCards;

            this.$nextTick(() => {
                this.sijiaoBindedCards.forEach(row => {
                    if(row.check){
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    }
                })
            });
        },
        async saveData() {
            const id = this.$route.params.id;
            let {
                avatar,
                name,
                nickname,
                phone,
                jingyan,
                join_date,
                birthday,
                order,
                can_alone,
                id_card,
                des,
                content
            } = this.form;

            if (!name) {
                this.$message.error("老师姓名不能为空");
            } else if (!phone) {
                this.$message.error("老师手机号不能为空");
            } else if (order && order < 0) {
                this.$message.error("正确填写显示顺序");
            } else if (!des) {
                this.$message.error("请填写一句话描述");
            } else {
                if (join_date) {
                    join_date = dateFormat("YYYY-mm-dd HH:MM:SS",new Date(join_date));
                }
                if (birthday) {
                    birthday = dateFormat("YYYY-mm-dd HH:MM:SS",new Date(birthday));
                }
                
                let res = await teacher.update({
                    id,
                    avatar,
                    name,
                    nickname,
                    phone,
                    jingyan,
                    join_date,
                    birthday,
                    order,
                    can_alone,
                    id_card,
                    des,
                    content
                });

                if (res.code == 200) {
                    this.$store.dispatch('tagsView/delView', this.$route)
                    this.$router.replace({
                        path: "/offline/teacher"
                    });
                    
                } else {
                    Message.error("数据保存失败");
                }
            }
        },
        handleSelectionTeacherCoursesChange(val) {
            this.multipleTeacherCoursesSelection = val;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async saveAllBinds() {
            const id = this.$route.params.id;
            let data = this.multipleSelection;
           
            if (!data.length) {
                this.$message.error('选择要设置的卡');
                return;
            }
            let status = true;
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (!item.setted && (item.card_type == 1 || item.card_type == 6 || item.card_type == 7)) {
                    status = false;
                    break;
                }
            }
            
            if (!status) {
                this.$message.error('设置单位数量');
                return;
            };
            let support_cardinfo = []
            data.forEach(item => {
                let setted= '';
                if (item.card_type == 6) {
                    setted = parseFloat(item.setted).toFixed(2);
                } else {
                    setted = item.setted;
                }
                support_cardinfo.push(''+item.card_id + '_'+setted)
            });

            support_cardinfo = support_cardinfo.join(',');

            let res = await teacher.set_sijiao_cardinfo({
                id,
                support_cardinfo
            });

            if (res.code == 200) {
                this.$message.success(res.msg);
                this.fetchSijiaoCardinfo();
            } else {
                this.$message.error('设置失败');
                console.log(res);
            }
        },
        async saveTeacherPricesAllBinds(){
            let checks = this.multipleTeacherCoursesSelection;
            
            if (!checks.length) {
                this.$message.error('选择要设置的课程');
                return;
            }

            let status = true;
            for (let i = 0; i < checks.length; i++) {
                let item = checks[i];
                if (!item.course_price || !item.must_course_num) {
                    status = false;
                    break;
                }
            }

            if (!status) {
                this.$message.error('请填写选中的并且不能为0或者空');
                return;
            }


            let infos = [];
            checks.forEach(item => {
                infos.push(item.teacher_id + ':'+item.agree_id + ':'+ parseFloat(item.course_price).toFixed(2) + ':'+item.must_course_num);
            });

           
            let res = await teacher.teacher_courses_price({
                prices:infos
            });

            if (res.code == 200) {
                this.$message.success(res.msg);
                this.fetchTeacherCourses();
            } else {
                this.$message.error('设置失败');
                console.log(res);
            }
            // console.log(JSON.stringify(this.teacherCourses));   
        },
        async saveSijiaoPrice() {
            const id = this.$route.params.id;
            let price = this.sijiao_price;
            let res = await teacher.set_alone_price({
                id,
                can_alone_price:price
            });

            if (res.code == 200) {
                this.$message.success(res.msg);
                this.fetchData();
            } else {
                this.$message.error('设置失败');
                console.log(res);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.UEditor{
    position: relative;
    z-index: 1;
}
.top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .center_right {
        margin-right: 20px;
        .item{
            display: flex;
            align-items: center;
            .jingyan{
                width: 500px;
                display: block;
                padding: 10px;
                font-size: 14px;
                border-radius: 5px;
                border: 1px solid #efefef;
                background-color: #f5f5f5;
                color:#454545;
            }
        }
        label{
            width: 100px;
            display: inline-block;  
            text-align: right;
        }
    }
}
.top_left{
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.top_left .item{
    margin: 5px 0;
}
.top .head {
    width: 100px;
    height: 100px;
    margin-right: 20px;
}
.top .head  img {
    width:100%;
    height: 100%;
    border-radius: 50%;
}
.top .center {
    margin-right: 20px;
}

.id_img{
    max-width: 673px;
    max-height: 425px;
}
.head_cover{
    max-width: 100px;
    max-height: 100px;
}
.b_btn{
    padding: 20px 0;
    text-align: left;
}
.per_box{
    display: flex;  
    align-items: center;
}
.per_box .el-input-number{
    width:220px; 
    margin-right: 10px;
}
.inner_box h3{
    font-size: 14px;
}
.content_box{
    padding-top: 15px;
}
.empty_pic{
    color:#666;
    background: #ddd;
    width: 400px;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 24px;
    text-align: left;
    margin-bottom: 15px;
    font-size: 12px;
    padding: 30px;
    box-sizing: border-box;
}
</style>