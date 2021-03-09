<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
      
    </div>
</template>

<script>

    const user = require('@/api/user');

    export default {
        name: "HelloWorld",
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
    h1,
    h2 {
        font-weight: normal;
        margin: 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .hello {
        padding: 15px;
    }
</style>
