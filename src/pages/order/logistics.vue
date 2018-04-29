<template>
  <div class="logistics">
        <top-pages :topInfo="topInfo" 
                   :orderId="orderId"
                   v-on:activeShortcut="activeShortcut"></top-pages>
        <info-pages :orderInfo="orderInfo"
                    :orderNumber="orderNumber"></info-pages>
        <lists-pages :style="{height:maxHeight+'px'}"
                     :orderTrack="orderTrack"></lists-pages>
        <shortcut-pages :shortcutShow="shortcutShow" 
                        v-on:activeShortcut="activeShortcut"
                        v-if="shortcutShow"></shortcut-pages>
        <wxc-loading :show="isShow"
                          type="default"></wxc-loading>
  </div>
</template>

<script>
import Vue from "vue";
import {    Utils,
            WxcLoading
        } from "weex-ui";

import mixin from "@/mixins";

import topPages from "~/components/order/logistics/top";
import infoPages from "~/components/order/logistics/info";
import listsPages from "~/components/order/logistics/lists"
import shortcutPages from "~/components/common/shortcut";

export default {
    components: {
        topPages,
        infoPages,
        listsPages,
        WxcLoading,
        shortcutPages
    },
    mixins: [mixin],
    data: () => ({ 
        topInfo:{
              title:'订单跟踪',
              rightIcon:true,
              path:'/order/detail',
              id:null
          },
        maxHeight:Utils.env.getPageHeight()-300,
        orderId:null,
        isShow:false,
        orderInfo:null,
        orderNumber:null,
        orderTrack:null,
        shortcutShow:false,
    }),
    mounted(){
     
    },
    created(){
      this.orderId = JSON.parse(this.queryParames().orderInfo).id||'';
      this.orderInfo = JSON.parse(this.queryParames().orderInfo);
      this.$set(this.topInfo,'id',this.orderId)
      this.getLogistics();
    },
    methods: {
        async getLogistics(){
            let self = this;
            self.isShow = true;
            let {data:{payload:{info,code}}} = await self.stream("app.!order.tracking",{
                query:{
                    id:self.orderId
                },
            });
            if(code === 200 && info){
                self.isShow = false;
                self.orderNumber = info;
                self.orderTrack = info.tracking;
            }
          
        },
        activeShortcut(val) {
            //响应快速选择工具点击事件
            this.shortcutShow = val;
        }
    }
};
</script>
<style>
.logistics{
    width:750px;
    background-color: #e8e8ed;
}


</style>