<template>
    <div class="goods-detail">
        <div class="goods-detail-top-minbar" ref="topMinbar">
            <text v-for="(item,index) in tabTitle" 
                  @click=" activeTabTile = index" 
                  :class="['goods-detail-top-title',activeTabTile === index ? 'goods-detail-top-title-active' : '']" 
                  :key="index">{{item}}</text>
        </div>
        <detail-main-pages  v-if=" activeTabTile === 0 "
                            :goodsDesc="goodsDesc"></detail-main-pages>
        <detail-speci-pages :goodsAttr="goodsAttr" 
                             v-else-if=" activeTabTile === 1"></detail-speci-pages>
        <detail-service-pages v-else-if=" activeTabTile === 2"></detail-service-pages>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils, WxcIcon, wxcMinibar } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import detailMainPages from "./main";
import detailSpeciPages from "./specifications";
import detailServicePages from "./service";

const dom = weex.requireModule("dom");

export default {
    props:['goodsDesc','goodsAttr'],
    components: {
        Utils,
        WxcIcon,
        wxcMinibar,
        detailMainPages,
        detailSpeciPages,
        detailServicePages
    },
    mixins: [mixin],
    data: () => ({
        tabTitle: ["商品介绍", "规格参数", "温馨提示"],
        activeTabTile: 0,
        specifications: [
            {
                name: "帽壳材质",
                size: "ABS"
            },
            {
                name: "下颏带",
                size: "C型"
            },
            {
                name: "帽衬",
                size: "旋钮式"
            },
            {
                name: "颜色",
                size: "白"
            },
            {
                name: "执行标准",
                size: "国标GB 2811-2007"
            },
            {
                name: "透气孔",
                size: "有"
            },
            {
                name: "两侧插槽",
                size: "有"
            },
            {
                name: "电绝缘",
                size: "是"
            }
        ]
    }),
    created() {},
    mounted() {
        this.goTop();
    },
    methods: {
        goTop() {
            //返回顶部
            let elements = this.$refs.topMinbar;
            dom.scrollToElement(elements, { offset: -200 });
        },
        minibarLeftButtonClick() {},
        minibarRightButtonClick() {
            modal.toast({ message: "click rightButton!", duration: 1 });
        }
    }
};
</script>
<style scoped>
.goods-detail {
    width: 750px;
}
.goods-detail-top-minbar {
    width: 750px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
}
.goods-detail-top-title {
    height: 80px;
    line-height: 80px;
    font-size: 24px;
    color: #222;
}
.goods-detail-top-title-active {
    color: red;
}
</style>