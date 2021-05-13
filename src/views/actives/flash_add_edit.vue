<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1000px; padding-left:30px">
            <!--  老师头像 -->
            <el-form-item required label="秒杀活动名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item required label="秒杀封面">
                <img v-if="form.cover" :src="form.cover" />
                <div class="empty_pic" v-else>建议尺寸280×180，JPG、PNG、webp格式，图片小于5M。</div>
                <el-upload class="upload_box" action="fakeaction" :show-file-list="false" :auto-upload="true" :http-request="uploadSectionFile">
                    <el-button type="info">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">建议尺寸280×180，JPG、PNG、webp格式，图片小于5M。</div>
                </el-upload>
            </el-form-item>
            <el-form-item required label="秒杀活动旧价格">
                <el-input-number v-model="form.old_price"></el-input-number>
            </el-form-item>
            <el-form-item required label="秒杀活动新价格">
                <el-input-number v-model="form.now_price"></el-input-number>
            </el-form-item>
            <el-form-item required label="选择活动卡">
                <el-select style="width:100%" v-model="form.bind_card_id" placeholder="选择活动卡" @change="cardChange">
                    <el-option v-for="item in cards" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item required label="活动截止时间">
                <el-date-picker v-model="form.over_time" type="datetime" placeholder="选择活动截止时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="活动卡使用说明">
                <el-input type="textarea" placeholder="填写活动卡使用说明" maxlength="255" show-word-limit v-model="form.des">
                </el-input>
            </el-form-item>
            <el-form-item class="UEditor" required label="活动详细">
                <VueUeditorWrap v-model="form.content" :config="ueConfig" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
const card = require("@/api/card");
const flash_sale = require("@/api/flash_sale");
import VueUeditorWrap from "vue-ueditor-wrap";
import { UEDITOR_DOMAIN } from "@/config";

export default {
	name: "flaseSaleDetail",
	components: {
		VueUeditorWrap,
	},
	data() {
		return {
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
				name: "",
				des: "",
				cover: "",
				over_time: "",
                old_price: 0,
                now_price: 0,
				content: "",
				bind_card_id: "",
			},
			cards: [],
            editStatus: false
		};
	},
	mounted() {
        let id = this.$route.query.id;
        if (id) {
            this.editStatus = true;
            this.fetchDetail(id);
        }
		this.fetchCards();
	},
	methods: {
		async fetchCards() {
			let res = await card.all();
			if (res.code == 200) {
				this.cards = res.data;
			}
		},
        async fetchDetail(id) {
            let res = await flash_sale.query({
                id
            });
            if (res.code == 200) {
                this.form = res.data;
                
            }
          
        },
		cardChange() {

        },
		async uploadSectionFile(param) {
			var fileObj = param.file;
			var form = new FormData();
			form.append("file", fileObj);
			let res = await flash_sale.uploadCover(form);
			this.form.cover = res.data.data.imagePath;
		},
        async saveData() {
            let id = this.$route.query.id;
            let {
                name,
                cover,
                now_price,
                old_price,
                bind_card_id,
                over_time,
                des,
                content
            } = this.form;

            if (!name) {
                this.$message.error("请填写秒杀活动名称");
                return;
            }
            if (!cover) {
                this.$message.error("请上传秒杀封面");
                return;
            }

            if (!old_price) {
                this.$message.error("请填写秒杀活动旧价格");
                return;
            }

            if (!now_price) {
                this.$message.error("请填写秒杀活动新价格");
                return;
            }

            if (!bind_card_id) {
                this.$message.error("请选择活动卡");
                return;
            }

            if (!over_time) {
                this.$message.error("请设置活动截止时间");
                return;
            }

            if (!des) {
                this.$message.error("请填写活动卡使用说明");
                return;
            }

            if (!content) {
                this.$message.error("请填写活动详细");
                return;
            }

            let res = {};

            if (this.editStatus) {
                res = await flash_sale.edit({
                    id,
                    name,
                    cover,
                    now_price,
                    old_price,
                    bind_card_id,
                    over_time,
                    des,
                    content
                });
            } else {
                 res = await flash_sale.add({
                    name,
                    cover,
                    now_price,
                    old_price,
                    bind_card_id,
                    over_time,
                    des,
                    content
                });
            }
           

            if (res.code == 200) {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push({
                    path: "/actives/flash_sale"
                });
            }

        }
	},
};
</script>

<style lang="scss" scoped>
.UEditor {
	position: relative;
	z-index: 1;
}
.empty_pic {
	color: #666;
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