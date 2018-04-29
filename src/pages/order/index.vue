<template>
  <div class="order"
       :style="{height:maxHeight+'px'}">
        <top-pages :topInfo="topInfo"
                    v-on:activeShortcut="activeShortcut"></top-pages>
        <tab-pages  v-on:searchKey="searchKey"></tab-pages>
        <lists-pages ref="childTop"
                     :orderList="orderList"
                     :meta="meta"
                     :finish="finish"
                     v-on:moreData="moreData"
                     v-on:scrollTop="scrollTop"
                     v-on:getOrder="getOrder" ></lists-pages>
        <shortcut-pages :shortcutShow="shortcutShow" 
                        v-on:activeShortcut="activeShortcut"
                        v-if="shortcutShow"></shortcut-pages>
        <wxc-loading :show="show"
                     loading-text="数据加载中..."></wxc-loading>
       
        <image  v-if="topStatus" 
                :src="imgPath('/category/category_top.png')"  
                @click="backTop" 
                class="order-backTop-icon"/>
  </div>
</template>

<script>
import Vue from "vue";
import {    Utils,
            WxcLoading
        } from "weex-ui";

import mixin from "@/mixins";

import topPages from "~/components/order/top";
import tabPages from "~/components/order/orders/tab"
import listsPages from "~/components/order/orders/lists"
import shortcutPages from "~/components/common/shortcut";

export default {
    components: {
        WxcLoading,
        topPages,
        tabPages,
        listsPages,
        shortcutPages,
     },
    mixins: [mixin],
    data: () => ({
        maxHeight: Utils.env.getPageHeight(),
        show:false,
        topInfo:{
            title:'我的订单',
            rightIcon:false,
            path:'/'
        },
        shortcutShow:false,//快速选择
        orderList:[],
        meta:{
            totalCount:0,
            pageCount:0,
            currentPage:1,
            perPage:0,
        },
        orderType:'',//订单查询
        finish:false,
        page:1,
        topStatus:false,
    }),
    mounted(){
      
    },
    created(){
        this.show = true;
        this.getOrder();
    },
    methods: {
        scrollTop(val){
            let self = this;
            self.topStatus = val
        },
        backTop(){
            this.$refs.childTop.goTop();
        },
        activeShortcut(val){//响应快速选择工具点击事件
            this.shortcutShow = val
        },
        moreData(val){
            let self = this;
            self.show = true;
            self.meta.currentPage = self.meta.currentPage+1;
          if(self.meta.currentPage > self.meta.pageCount){
              self.finish = true;
              self.show = false;
          }else{
              self.getOrder()
          }  
    },
    searchKey(val){
        let self = this;
        self.finish = false;
        self.orderType = val;
        self.orderList = [];
        self.show = true;
        self.getOrder();
    },
    async getOrder(){
        let self = this;
        let {data:{payload:{list,_meta,code}}} = await self.stream("app.!order.list",{
            query:{
                expand:'detail.goods',
                orderType:self.orderType,
                page:self.meta.currentPage
            },
        });
        if(code === 200 && list){
            list.map(item => self.orderList.push(item) )
            self.meta = _meta;
        }
        self.show = false;
        if(self.orderList.length >= self.meta.totalCount){
            //数据加载完毕
            self.finish = true;
        }
    },
  }
};
</script>
<style>
.order{
    width:750px;
    position: relative;
}
.order-backTop-icon {
  position:absolute;
  bottom:30px;;
  right:30px;
  width: 90px;
  height: 90px;
  margin-bottom:15px;
}
figure.order-backTop-icon {
  position:absolute;
  bottom:30px;;
  right:30px;
  width: 90px;
  height: 90px;
  margin-bottom:15px;
}

</style>