<template>
    <div class="hello">
        
    </div>
</template>

<script>
    import flvjs from "flv.js";
    const img = require('@/assets/1000.jpg');
    const user = require('@/api/user');

    export default {
        name: "dashboard",
        data() {
            
            return {
            
            };
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
