<template>
    <div class="recommend love-floor">
        <div class="gray-layout">
            <div class="gray-layout-line"></div>
            <div class="gray-layout-box">
                <div class="gray-img-box">
                    <image class="gray-img"
                        :src="imgPath('gray-text-img.png')"></image>
                </div>
                <text class="gray-layout-title">为您推荐</text>
            </div>
        </div>
        <div class="recommend-list">
            <div v-for="(value,index) in recommend"
                :key="index"
                class="recommend-list-box">
                <div v-for="(val,key) in value"
                    :key="key"
                    class="recommend-item similar-product">
                    <div class="product-image-box">
                        <image class="product-image"
                            :src="imgPath(val.img_url)"
                            @click="jump(val.href,{pages: 0})"></image>
                    </div>
                    <div class="product-title-box"
                        @click="jump(val.href)">
                        <text class="product-title">{{val.goods_name}}</text>
                    </div>
                    <div class="product-info-box">
                        <text class="product-price-start">￥</text>
                        <text class="product-price">{{val.price | startPrice}}</text>
                        <text class="product-price-end">.{{val.price | endPrice}}</text>
                    </div>
                    <div :class="['praise-info', val.hasOwnProperty('praise') ? '' : 'praise-info-end']">
                        <div v-if="val.similar_url"
                            class="guess-button"
                            @click="jump(val.similar_url)">
                            <text class="guess-button-text">看相似</text>
                        </div>
                        <text v-if="val.hasOwnProperty('praise')"
                            class="praise-num">好评率{{val.praise}}</text>
                    </div>
                </div>
            </div>
        </div>
        <wxc-loading :show="getLoading"></wxc-loading>
        <div v-if="loading == 2" class="recommend-empty">
            <text class="recommend-empty-text">没有更多推荐了呢 ~ ~ </text>
        </div>
    </div>
</template>
<script>
    import { WxcLoading } from 'weex-ui'
    import { isString } from "lodash"

    import mixin from "~/mixins"
    import filters from "~/filters"

    export default {
        props: ['recommend', 'loading'],
        components: {
            WxcLoading
        },
        mixins: [mixin],
        filters: {
            ...filters,
            startPrice (value) {
                if (!isString(value)) value = value.toString()
                value = value.split('.')
                value.pop()
                return value.join('.')
            },
            endPrice (value) {
                if (!isString(value)) value = value.toString()
                if ((value = value.split('.')) && value.length < 2) return '00'
                return value.pop().substring(0, 2)
            }
        },
        computed: {
            getLoading () {
                return this.loading === 1 ? true : false
            }
        }
    }
</script>
<style>
.recommend {
    background-color: #f0f2f5;
    margin-top: 12px;
}
.gray-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 750px;
    padding-top: 35px;
    margin-bottom: 30px;
    background-color: #f0f2f5;
}
.gray-layout-line {
    width: 720px;
    height: 2px;
    background-color: #cbcbcb;
}
.gray-layout-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    background-color: #f0f2f5;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: -22px;
}
.gray-img-box {
    margin-right: 15px;
}
.gray-img {
    width: 32px;
    height: 32px;
    display: block;
}
.gray-layout-title {
    line-height: 40px;
    font-size: 30px;
    color: #848689;
}
.recommend-list {
    display: flex;
    flex-direction: column;
    width: 750px;
}
.recommend-list-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
}
.recommend-item {
    width: 370px;
    background-color: #ffffff;
}
.product-image-box,
.product-image {
    width: 370px;
    height: 370px;
}
.product-title-box {
    height: 68px;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 15px;
    margin-bottom: 10px;
}
.product-title {
    width: 340px;
    height: 68px;
    lines: 2;
    line-height: 34px;
    text-overflow: ellipsis;
    font-size: 28px;
    color: #232326;
}
.product-info-box {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    padding-left: 10px;
    margin-bottom: 10px;
}
.product-price-start,
.product-price-end {
    line-height: 28px;
    font-size: 28px;
    color: #f23030;
}
.product-price {
    height: 34px;
    line-height: 37px;
    font-size: 34px;
    color: #f23030;
}
.praise-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 15px;
}
.praise-info-end {
    justify-content: flex-end;
}
.praise-num {
    font-size: 24px;
    color: #999999;
}
.guess-button {
    height: 46px;
    padding-left: 15px;
    padding-right: 15px;
    border-width: 1px;
    border-style: solid;
    border-color: #cecece;
    background-color: #ffffff;
}
.guess-button-text {
    line-height: 46px;
    font-size: 24px;
    color: #666666;
}
.recommend-empty {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 750px;
}
.recommend-empty-text {
    line-height: 120px;
    font-size: 30px;
    color: #999999;
}
</style>
