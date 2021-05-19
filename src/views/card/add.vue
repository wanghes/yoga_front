<template>
    <div class="wrap">
        <el-form :model="form" label-position="top" style="max-width:1200px; padding-left:30px">
            <!--  老师头像 -->
            <el-form-item label="卡种类名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item required label="卡片封面" :label-width="formLabelWidth">
                <img class="cover_img" v-if="form.cover" :src="form.cover" />
                <div class="empty_pic" v-else>建议尺寸385×215，JPG、PNG、webp格式，图片小于5M。</div>
                <el-upload class="upload_box" action="fakeaction" :show-file-list="false" :auto-upload="true" :http-request="uploadSectionFile">
                    <el-button type="info">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">建议尺寸385×215，JPG、PNG、webp格式，图片小于5M。</div>
                </el-upload>
            </el-form-item>

            <el-form-item required label="卡类别">
                <el-radio-group v-model="form.type" @change="changeType">
                    <el-radio-button :label="1">次卡</el-radio-button>
                    <el-radio-button :label="2">年卡</el-radio-button>
                    <el-radio-button :label="3">季卡</el-radio-button>
                    <el-radio-button :label="4">月卡</el-radio-button>
                    <el-radio-button :label="5">周卡</el-radio-button>
                    <el-radio-button :label="6">储值卡</el-radio-button>
                    <el-radio-button :label="7">小时卡</el-radio-button>
                </el-radio-group>
                <el-alert type="error" style="margin-top: 10px" :closable="false">此类型一旦保存，无法修改！！！</el-alert>
            </el-form-item>

            <el-form-item label="售价">
                <el-input-number v-model="form.price"></el-input-number>
            </el-form-item>
            <el-form-item label="有效期">
                <el-radio-group v-model="form.expire_date_on" @change="changeRadio">
                    <el-radio-button :label="2">不限制</el-radio-button>
                    <el-radio-button :label="1">限制</el-radio-button>
                </el-radio-group>
                <div class="days" v-show="form.expire_date_on == 1">
                    <el-input-number placeholder="填写天数" v-model="form.expire_date"></el-input-number> 天
                </div>
            </el-form-item>
            <el-form-item label="次数" v-if="form.type==1">
                <el-input-number placeholder="填写次数" v-model="form.times"></el-input-number> 次
            </el-form-item>
            <el-form-item label="小时数" v-if="form.type==7">
                <el-input-number placeholder="填写小时数" v-model="form.hours"></el-input-number> 小时
            </el-form-item>
            <el-form-item label="单次可约最大人数">
                <el-input-number placeholder="单次可约最大人数" v-model="form.limit_people"></el-input-number> 人
                <el-tooltip style="color:red" effect="dark" content="用来限制该类型卡预约时，最多可以带多少人一起上课。" placement="top">
                    <i class="el-icon-warning"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="显示顺序">
                <el-input-number placeholder="填写显示顺序" v-model="form.order"></el-input-number>
            </el-form-item>
            <el-form-item label="会员卡使用说明">
                <el-input type="textarea" placeholder="填写会员卡使用说明" maxlength="255" show-word-limit v-model="form.remark">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveData">保 存 数 据</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
const api = require("@/api/card");
export default {
	data() {
		return {
			form: {
				name: "",
				type: 1,
				price: "",
				expire_date_on: 2,
				expire_date: "",
				times: "",
				limit_people: "",
				order: 0,
				remark: "",
                cover: "",
				hours: "",
			},
		};
	},
	mounted() {},
	methods: {
		changeRadio(value) {
			// console.log(value)
		},
        async uploadSectionFile(param) {
            var fileObj = param.file;
            var form = new FormData();
            form.append("file", fileObj);
            let res = await api.uploadCardCover(form)
            this.form.cover = res.data.data.imagePath;
        }, 
		changeType(value) {
			if (value == 2) {
				this.form.expire_date = 365;
			}
			if (value == 3) {
				this.form.expire_date = 93;
			}
			if (value == 4) {
				this.form.expire_date = 31;
			}
			if (value == 5) {
				this.form.expire_date = 7;
			}
			this.form.expire_date_on = 1;
			if (value == 6 || value == 1 || value == 7) {
				this.form.expire_date = 0;
				this.form.expire_date_on = 2;
			}
		},
		async saveData() {
			let {
				name,
				type,
				price,
				expire_date_on,
				expire_date,
				times,
				limit_people,
				hours,
				order,
				remark,
                cover
			} = this.form;

			if (!name) {
				this.$message.error("请填写卡种类名称");
				return;
			}

            if (!cover) {
                this.$message.error("请上传卡片封面");
				return;
            }

			if (!type) {
				this.$message.error("请选择卡类别");
				return;
			}
			if (!price) {
				this.$message.error("请填写售价");
				return;
			}

			if (type == 2 || type == 3 || type == 4 || type == 5) {
				if (expire_date_on != 1) {
					this.$message.error("必须限制有效期");
					return;
				}
			}

			if (expire_date_on == 1) {
				if (!expire_date) {
					this.$message.error("请填写有效期限制天数");
					return;
				}
			}

			if (type == 1) {
				if (!times) {
					this.$message.error("请填写次卡限制次数");
					return;
				}
			}

			if (type == 7) {
				if (!hours) {
					this.$message.error("请填写小时卡小时数");
					return;
				}
			}

			if (!limit_people) {
				this.$message.error("请填写单次可约最大人数");
				return;
			}

			let res = await api.add({
				name,
				type,
				price,
				expire_date_on,
				expire_date,
				times,
				limit_people,
				order,
				remark,
                cover
			});

			if (res.code == 200) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({
					path: "/card/index",
				});
			} else {
				this.$message.error("数据保存失败");
				console.log(res);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.days {
	padding-top: 15px;
}
.cover_img{
    width: 385px;
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