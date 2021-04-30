<template>
    <div class="wrap">
        <el-tabs v-model="activeName">
            <el-tab-pane label="课程编辑" name="first">
                <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
                    <!--  课程主题 -->
                    <el-form-item required label="系列课名称" :label-width="formLabelWidth">
                        <el-input v-model="form.course_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item required label="排课计划" :label-width="formLabelWidth">
                        <el-input-number v-model="form.course_num" :min="1" :max="100" label="排课计划"></el-input-number>
                    </el-form-item>
                    <el-form-item required label="系列课分类" :label-width="formLabelWidth">
                        <el-select v-model="form.course_cate" placeholder="请选择" @change="cateChange">
                            <el-option v-for="item in cates" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--  课程封面 -->
                    <el-form-item required label="课程封面" :label-width="formLabelWidth">
                        <div class="cover">
                            <img v-if="form.course_cover" :src="form.course_cover" />
                            <div class="empty_pic" v-else>建议尺寸280×180，JPG、PNG、webp格式，图片小于5M。</div>
                        </div>
                        <el-upload class="upload_box" action="fakeaction" :show-file-list="false" :auto-upload="true" :http-request="uploadSectionFile">
                            <el-button type="danger">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">建议尺寸280×180，JPG、PNG、webp格式，图片小于5M。</div>
                        </el-upload>
                    </el-form-item>

                    <!--  收费类型 -->
                    <el-form-item required label="收费类型" :label-width="formLabelWidth">
                        <el-radio-group v-model="form.pay_type">
                            <el-radio v-for="item in payTypes" :key="item.id" :disabled="item.id!=form.pay_type" :label="item.id">{{item.name}}</el-radio>
                        </el-radio-group>

                        <div class="pay_money_box" v-if="form.pay_type == 1">
                            <div v-for="item,index in form.pay_money_type" :key="index">
                                <el-input class="short_input" v-model="item.price"></el-input>
                                <span> 元</span>
                            </div>
                        </div>
                        <div v-else class="pay_money_box">
                            <div v-if="form.pay_type==2">
                                <div class="pay_money_type_item" v-for="item,index in form.pay_money_type" :key="index">
                                    <el-input-number class="short_input" v-model="item.time"></el-input-number>
                                    <span> 天收取</span>
                                    <el-input class="short_input" v-model="item.price"></el-input>
                                    <span> 元</span>
                                    <el-link class="del_btn" v-if="index != 0" @click="delPayMonnyItem(index)" type="danger">删除</el-link>
                                </div>
                            </div>
                            <div v-else-if="form.pay_type==3">
                                <div class="pay_money_type_item" v-for="item,index in form.pay_money_type" :key="index">
                                    <el-input-number class="short_input" v-model="item.time"></el-input-number>
                                    <span> 月收取</span>
                                    <el-input class="short_input" v-model="item.price"></el-input>
                                    <span> 元</span>
                                    <el-link class="del_btn" v-if="index != 0" @click="delPayMonnyItem(index)" type="danger">删除</el-link>
                                </div>
                            </div>
                            <div v-else-if="form.pay_type==4">
                                <div class="pay_money_type_item" v-for="item,index in form.pay_money_type" :key="index">
                                    <el-input-number class="short_input" v-model="item.time"></el-input-number>
                                    <span> 年收取</span>
                                    <el-input class="short_input" v-model="item.price"></el-input>
                                    <span> 元</span>
                                    <el-link class="del_btn" v-if="index != 0" @click="delPayMonnyItem(index)" type="danger">删除</el-link>
                                </div>
                            </div>
                            <el-button type="primary" @click="addTypeByTime">添加一个类型</el-button>
                        </div>
                    </el-form-item>

                    <el-form-item class="UEditor" required label="课程内容" :label-width="formLabelWidth">
                        <VueUeditorWrap v-model="form.course_content" :config="ueConfig" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveData">保 存 数 据</el-button>
                    </el-form-item>

                </el-form>

            </el-tab-pane>
        </el-tabs>

        <el-dialog title="播放视频" :visible.sync="visible" width="40%">
            <video :src='form.course_video' controls width='100%' height='100%' autoPlay data-setup='{}'>
                <source :src='form.course_video'>
            </video>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const course = require("@/api/course");
const course_cover = require("@/assets/xilie_cover.png");
import VueUeditorWrap from "vue-ueditor-wrap";
import { UEDITOR_DOMAIN } from "@/config";

import { Message } from "element-ui";
export default {
	name: "CourseAloneDetail",
	components: {
		VueUeditorWrap,
	},
	data() {
		return {
			activeName: "first",
			formLabelWidth: "130",
			course_cover,
			visible: false,
			cate_selected: "",
			cates: [],
			ueConfig: {
				// 编辑器不自动被内容撑高
				autoHeightEnabled: false,
				// 初始容器高度
				initialFrameHeight: 640,
				// 初始容器宽度
				initialFrameWidth: "100%",
				autoFloatEnabled: false,
				// 上传文件接口
				serverUrl: `${UEDITOR_DOMAIN}/upload/ue_upload`,
				// UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项
				UEDITOR_HOME_URL: "/static/UEditor/",
			},
			form: {
				course_name: "",
				course_num: "",
				course_cate: "",
				course_cover: "",
				pay_type: "",
				course_content: "",
				pay_money_type: [],
			},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 3600 * 1000 * 24;
				},
			},
			payTypes: [
				{
					id: 1,
					name: "固定收费",
				},
				{
					id: 2,
					name: "按天收费",
				},
				{
					id: 3,
					name: "按月收费",
				},
				{
					id: 4,
					name: "按年收费",
				},
			],
		};
	},
	mounted() {
		this.fetData();
	},
	methods: {
		async fetData() {
			const id = this.$route.params.id;
			let result = await course.get_manycourse({
				id,
			});
			let res = await course.getCates();

			this.cates = res.data;
			result.data.course_cate =
				result.data.course_cate == 0 ? "" : result.data.course_cate;
			this.form = result.data;
		},
		async saveData() {
			const id = this.$route.params.id;
			let {
				course_name,
				course_num,
				course_cate,
				course_cover,
				course_content,
				pay_type,
				pay_money_type,
			} = this.form;

			if (!course_name) {
				Message.error("课程主题不能为空");
				return;
			}
			if (!course_num) {
				Message.error("请设置排课计划");
				return;
			}
			if (!course_cate) {
				Message.error("请选择课程分类");
				return;
			}
			if (!course_cover) {
				Message.error("请上传课程封面");
				return;
			}
			if (!course_content) {
				Message.error("请填写课程内容");
				return;
			}

			if (pay_type == 1) {
				let status = false;
				pay_money_type.forEach(item => {
					if (!item.price) {
						status = true;
					}
				});

				if (status) {
					Message.error("请正确填写金额相关输入框");
					return;
				}
			}

			if (pay_type != 1) {
				let status = false;
				pay_money_type.forEach(item => {
					if (item.time <= 0 || !item.price) {
						status = true;
					}
				});

				if (status) {
					Message.error("请正确填写金额相关输入框");
					return;
				}
			}

			let res = await course.many_done({
				id,
				course_name,
				course_num,
				course_cate,
				course_cover,
				course_content,
				pay_type,
				pay_money_type,
			});

			if (res.code == 200) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.replace({
					path: "/course/many_index",
				});
			} else {
				Message.error("数据保存失败");
			}
		},
		cateChange(value) {
			console.log(value);
		},
		async uploadSectionFile(param) {
			var fileObj = param.file;
			var form = new FormData();
			form.append("file", fileObj);
			let res = await course.uploadAloneCover(form);
			this.form.course_cover = res.data.data.imagePath;
		},
		addTypeByTime() {
			this.form.pay_money_type.push({
				time: "",
				price: "",
			});
		},
		delPayMonnyItem(idx) {
			this.form.pay_money_type.splice(idx, 1);
			console.log(this.form.pay_money_type);
		},
	},
};
</script>

<style scoped>
.btn_wrap {
	padding-bottom: 20px;
}
.cover {
	width: 600px;
}

.cover img {
	max-width: 100%;
}
.show_video {
	margin-top: 10px;
	width: 500px;
	height: 100px;
	background-color: rgba(1, 175, 113, 0.05);
	display: flex;
	align-content: flex-start;
	align-items: center;
}
.s_right {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding-left: 15px;
	align-items: flex-start;
}
.s_right span:first-child {
	padding-bottom: 10px;
}
.v_inner {
	width: 70px;
	height: 70px;
	display: flex;
	margin-left: 15px;
	justify-content: center;
	align-items: center;
	background: rgba(43, 57, 64, 0.85);
}

.UEditor {
	position: relative;
	z-index: 1;
}
.pay_money_box {
	padding: 15px 0;
	width: 500px;
}
.pay_money_type_item {
	margin-bottom: 10px;
}
.short_input {
	width: 150px;
}
.del_btn {
	margin-left: 20px;
	position: relative;
	top: -2px;
}
.empty_pic{
	color:#666;
	background: #ddd;
	width: 280px;
	height: 180px;
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
