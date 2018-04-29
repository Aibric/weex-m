<template>
  <div class="order">
        <top-pages :topInfo="topInfo"
                    v-on:activeShortcut="activeShortcut"></top-pages>
        <detail-pages :orderInfo="orderInfo" 
                      ref="detailTop"
                      :maxHeight="maxHeight"></detail-pages>
        <shortcut-pages :shortcutShow="shortcutShow" 
                        v-on:activeShortcut="activeShortcut"
                        v-if="shortcutShow"></shortcut-pages>
  </div>
</template>

<script>
import Vue from "vue";
import {    Utils,
        } from "weex-ui";

import mixin from "@/mixins";

import topPages from "~/components/order/top";
import detailPages from "~/components/order/detail/index"
import shortcutPages from "~/components/common/shortcut";

const modal = weex.requireModule("modal");

export default {
    components: {
        topPages,
        detailPages,
        shortcutPages
     },
    mixins: [mixin],
    data: () => ({
        topInfo:{
            title:'订单详情',
            rightIcon:true,
            path:'/order/index'
        },
        orderInfo:{},//订单详情信息
        maxHeight: 0,
        shortcutShow:false,
    }),
    mounted(){
        this.maxHeight = Utils.env.getPageHeight() - 100;
    },
    created(){
      
    },
    methods: {
        activeShortcut(val) {
            //响应快速选择工具点击事件
            this.shortcutShow = val;
        }
    }
};
</script>
<style>
.order-detail{
    width:750px;
}

</style>