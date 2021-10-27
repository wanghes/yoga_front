<template>
    <div class="wrap">
        <h3>切换预览模式</h3>
        <el-alert
            title="查看手机端后台管理，请务必关闭预览模式"
            type="error">
        </el-alert>
        <div class="switch_wrap">
            <el-switch v-model="value" @change="changeValue" active-text="开启预览" inactive-text="关闭预览">
            </el-switch>
            <div class="imgbox">
            <img  v-if="value" :src="src">
            </div>
            <div>
                <el-button v-if="value" type="primary" size="small" @click="handleClipboard">点击复制链接去微信访问</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
const venues = require("@/api/venues");
import {
    BASEURL
} from "@/config"

export default {
	name: "lookMode",
	data() {
		return {
            value: false,
            look: 0,
            src:""
        };
	},
	mounted() {
		this.getLook();
	},
	methods: {
		async getLook() {
            let res = await venues.queryLook();
            if (res.code == 200) {
                this.look = res.data.is_look;
                if (this.look ==1) {
                    this.value = true;
                    this.src= `${BASEURL}/Tools/getQrCode?venues=${window.venues}`;
                } else {
                    this.value = false;
                }
            }
        },
        handleClipboard(event) {
            clipboard(`http://h5.yogaguanjia.com?aid=${window.venues}`, event)
        },
        async changeValue(val) {
            let res = await venues.updateLook({
                is_look: val ? 1 : 0
            });
            if (res.code == 200) {
                this.$message.success(res.msg);
                this.src= `${BASEURL}/Tools/getQrCode?venues=${window.venues}`;
            } else {
                this.$message.error(res.msg)
            }   
          
        }
	},
};
</script>

<style scoped>
.wrap h3{
    margin: 0;
    margin-bottom: 15px;
}
.switch_wrap{
    padding: 15px 0;
}
.imgbox{
    margin: 10px 0;
}
.imgbox img{
    border:1px solid #efefef;
}
</style>
