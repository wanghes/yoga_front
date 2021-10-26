<template>
    <div class="wrap">
        <h3>切换预览模式</h3>
          <el-alert
            title="查看手机端后台管理，请务必关闭预览模式"
            type="warning">
        </el-alert>
        <el-divider></el-divider>
        <el-switch v-model="value" @change="changeValue" active-text="开启预览" inactive-text="关闭预览">
        </el-switch>
        <el-divider></el-divider>
        <img v-if="look==1" :src="src">
    </div>
</template>

<script>
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
.wrap {
	padding: 15px;
}
</style>
