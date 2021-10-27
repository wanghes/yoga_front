<template>
    <div class="wrap">
        <h3>欢迎登录</h3>
    </div>
</template>

<script>
const user = require("@/api/user");
export default {
	name: "dashboard",
	data() {
		return {};
	},
	mounted() {},
};
</script>

<style scoped>
.wrap h3{
    margin: 0;
    margin-bottom: 15px;
}
</style>
