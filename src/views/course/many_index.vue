<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
      
    </div>
</template>

<script>
    const user = require('@/api/course');
    export default {
        name: "CourseIndex",
        data() {
            return {
                msg: "测试"
            }
        },
        mounted() {
            user.getHello({
                name: "初拟"
            })
        },
    };

</script>

<style scoped>
  
</style>
