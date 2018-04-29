<template>
    <div class="brand-box">
        <div class="brand-gray-layout">
            <div class="brand-gray-layout-line"></div>
            <div class="brand-gray-layout-box">
                <div class="brand-gray-img-box">
                    <image class="brand-gray-img"
                        :src="imgPath('gray-text-img.png')"></image>
                </div>
                <text class="brand-gray-layout-title">推荐品牌</text>
            </div>
        </div>
        <div class="brand-body">
            <div v-for="(val,key) in brandList"
                :key="key"
                class="brand-item">
                <image v-if="val.logo_url"
                    class="brand-logo"
                    :src="imgPath(val.logo_url)"></image>
                <text v-else
                    class="brand-name">{{val.name}}</text>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from "~/mixins"
    import filters from "~/filters"

    export default {
        props: ['brands'],
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
            brandList () {
                return Array.isArray(this.brands) 
                    ? this.brands.slice(0, 8) 
                    : []
            }
        },
        data: () => ({
            adImgWidth: 750,
            adImgHeight: 230
        })
    }
</script>
<style>
.brand-box {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 750px;
    padding-top: 16px;
    background-color: #ffffff;
    border-top-left-radius: 26px;
    border-top-right-radius: 26px;
    margin-top: -26px;
}
.brand-gray-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 750px;
    padding-top: 25px;
    margin-bottom: 20px;
    background-color: #ffffff;
}
.brand-gray-layout-line {
    width: 720px;
    height: 2px;
    background-color: #cbcbcb;
}
.brand-gray-layout-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    background-color: #ffffff;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: -22px;
}
.brand-gray-img-box {
    margin-right: 15px;
}
.brand-gray-img {
    width: 32px;
    height: 32px;
    display: block;
}
.brand-gray-layout-title {
    line-height: 40px;
    font-size: 30px;
    color: #848689;
}
.brand-body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 10px;
}
.brand-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 2px;
    margin-right: 2px;
    margin-bottom: 2px;
}
.brand-logo,
.brand-name {
    width: 176px;
    height: 80px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}
.brand-name {
    background-color: #ececec;
    line-height: 80px;
    text-align: center;
    font-size: 28px;
    color: #d60008;
}
</style>
