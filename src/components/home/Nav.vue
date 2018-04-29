<template>
    <div class="quick-nav">
        <div v-for="(val,key) in quick"
            :key="key"
            @click="jump(val.key)"
            class="quick-item">
            <image class="quick-icon" :src="val.icon"></image>
            <div class="quick-title-box">
                <text class="quick-title">{{val.title}}</text>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from "~/mixins"
    import filters from "~/filters"

    export default {
        props: ['quick'],
        mixins: [mixin],
        filters: {
            ...filters
        }
    }
</script>
<style>
.quick-nav {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 750px;
    padding-top: 36px;
    background-color: #ffffff;
    border-top-left-radius: 26px;
    border-top-right-radius: 26px;
    margin-top: -26px;
}
.quick-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 5px;
    margin-right: 5px;
}
.quick-icon {
    width: 80px;
    height: 80px;
}
.quick-title-box {
    margin-top: 15px;
    margin-bottom: 25px;
}
.quick-title {
    width: 140px;
    text-align: center;
    font-size: 28px;
    color: #686868;
}
</style>
