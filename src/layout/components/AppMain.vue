<template>
    <section class="app-main">
        <div class="wrapper">
            <transition name="fade-transform" mode="out-in"> 
                <keep-alive :include="cachedViews">
                    <router-view :key="key" />
                </keep-alive>
            </transition> 
        </div>
        <div class="bot_f">瑜老师后台管理1.0系统</div>
    </section>
</template>

<script>
    export default {
        name: 'AppMain',
        computed: {
            cachedViews() {
                return this.$store.state.tagsView.cachedViews
            },
            key() {
                return this.$route.path
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-main {
        min-height: calc(100vh - 50px);
        position: relative;
        overflow: hidden;
    }

    .app-main {
        padding: 0 24px 0 24px;
        background: #f0f2f5;
    }
    .fixed-header + .app-main{
        padding: 24px 24px 0 24px;
        padding-top:50px;
    }

    .app-main .wrapper {
        width: 100%;
        background: #fff;
        min-height: calc(100vh - 170px);
        padding: 15px;
        box-sizing: border-box;
    }

    .bot_f {
        line-height: 50px;
        color: #333;
        font-size: 13px;
        text-align: center;
    }

    .hasTagsView {
        .app-main {
            min-height: calc(100vh - 84px);
        }
        .app-main {
            padding-top: 20px;
        }
        .fixed-header + .app-main{
            padding-top: 110px;
        }
    }
</style>

<style lang="scss">
    .el-popup-parent--hidden {
        .fixed-header {
            padding-right: 15px;
        }
    }
</style>
