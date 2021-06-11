<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1000px; padding-left:30px">
            <!--  老师头像 -->
            <el-form-item required label="拼团活动名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item required label="拼团封面">
                <img v-if="form.cover" class="img_cover" :src="form.cover" />
                <div class="empty_pic" v-else>建议尺寸280×180，JPG、PNG、webp格式，图片小于5M。</div>
                <el-upload class="upload_box" action="fakeaction" :show-file-list="false" :auto-upload="true" :http-request="uploadSectionFile">
                    <el-button type="info">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">建议尺寸280×180，JPG、PNG、webp格式，图片小于5M。</div>
                </el-upload>
            </el-form-item>

            <el-form-item required label="分享的封面">
                <img v-if="form.share_img" class="img_cover" :src="form.share_img" />
                <div class="empty_pic" v-else>建议尺寸960×1700，JPG、PNG、webp格式，图片小于5M。</div>
                <el-upload class="upload_box" action="fakeaction2" :show-file-list="false" :auto-upload="true" :http-request="uploadSectionFile2">
                    <el-button type="info">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">建议尺寸960×1700，JPG、PNG、webp格式，图片小于5M。</div>
                </el-upload>
            </el-form-item>

            <el-form-item required label="活动简单描述（50字）">
                <el-input type="textarea" placeholder="填写活动简单描述（50字）" v-model="form.intro" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <el-form-item required label="团购活动每人限制次数">
                <el-input-number v-model="form.limit"></el-input-number>
            </el-form-item>
            <el-form-item required label="团购价格">
                <el-input-number v-model="form.now_price"></el-input-number>
            </el-form-item>
            <el-form-item required label="团购之前价格">
                <el-input-number v-model="form.old_price"></el-input-number>
            </el-form-item>
            <el-form-item required label="已拼团数">
                <el-input-number v-model="form.people"></el-input-number>
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
            <el-form-item required label="活动卡使用说明">
                <el-input type="textarea" placeholder="填写活动卡使用说明" rows="8" maxlength="255" show-word-limit v-model="form.des">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
const card = require("@/api/card");
const group_purchase = require("@/api/group_purchase");

export default {
	name: "flaseSaleDetail",
	data() {
		return {
			form: {
				name: "",
				des: "",
				cover: "",
				over_time: "",
                limit: 1,
				bind_card_id: "",
                now_price: 0,
                old_price: 0,
                intro: "",
                share_img: "",
                people:0
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
            let res = await group_purchase.query({
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
			let res = await group_purchase.uploadCover(form);
			this.form.cover = res.data.data.imagePath;
		},
        async uploadSectionFile2(param) {
			var fileObj = param.file;
			var form = new FormData();
			form.append("file", fileObj);
			let res = await group_purchase.uploadCover(form);
            
			this.form.share_img = res.data.data.imagePath;
		},
        async saveData() {
            let id = this.$route.query.id;
            let {
                name,
                cover,
                limit,
                bind_card_id,
                over_time,
                des,
                intro,
                now_price,
                old_price,
                people,
                share_img
            } = this.form;

            if (!name) {
                this.$message.error("请填写拼团活动名称");
                return;
            }
            if (!cover) {
                this.$message.error("请上传拼团封面");
                return;
            }

            if (!intro) {
                this.$message.error("请填写拼团活动简单描述");
                return;
            }
            if (limit == 0) {
                this.$message.error("请填写拼团活动每人限制次数");
                return;
            }

            if (now_price == 0) {
                this.$message.error("请填写拼团活动价格");
                return;
            }

            if (old_price == 0) {
                this.$message.error("请填写拼团活动之前的价格");
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
            
            let res = {};

            if (this.editStatus) {
                res = await group_purchase.edit({
                    id,
                    name,
                    cover,
                    limit,
                    bind_card_id,
                    over_time,
                    des,
                    now_price,
                    old_price,
                    intro,
                    share_img,
                    people
                });
            } else {
                 res = await group_purchase.add({
                    name,
                    cover,
                    limit,
                    bind_card_id,
                    over_time,
                    des,
                    share_img,
                    now_price,
                    old_price,
                    intro,
                    people
                });
            }
           

            if (res.code == 200) {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push({
                    path: "/actives/group_purchase"
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
.img_cover{
    max-width: 400px;
}
</style>