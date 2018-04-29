<template>
    <div class="order-detail-info">
        <div class="order-detail-infoBox" >
           <text class="order-di-text">订单编号：{{info.order_sn}}</text>
           <text class="order-di-text">下单时间：{{info.add_time}}</text>
        </div>
        <div class="order-detail-infoBox" >
           <text class="order-di-text">支付方式：{{info.pay_name}}</text>
           <text class="order-di-text">支付时间：{{info.pay_timw}}</text>
        </div>
        <div class="order-detail-infoBox" >
           <text class="order-di-text">配送方式：{{info.shipping_name}}</text>
        </div> 
        <div class="order-detail-infoBox border-bottom-width" >
           <text class="order-di-text">发票类型：{{info.inv_type}}</text>
        </div>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils, } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";



const dom = weex.requireModule("dom");

export default {
  props:['info'],
  components: { Utils },
  mixins: [mixin],
  data: () => ({
     
  }),
  created() {
   
  },
  mounted(){
     
  },
  methods: {
      
  }
};
</script>
<style scoped>
.order-detail-info{
    width:750px;
    margin-top:20px;
    padding-left:30px;
    padding-right:30px;
    background-color: #fff;
}
.order-detail-infoBox{
    flex:1;
    align-items: flex-start;
    padding-top:30px;
    padding-bottom:30px;
    border-bottom-style: solid;
    border-bottom-color: #f9f5f5;
    border-bottom-width: 1px;
}
.order-detail-infoBoxL{
    border-bottom-width: 0px;
}
.order-di-text{
    height:60px;
    line-height:60px;
    font-size: 30px;
    color: #858586;
}
</style>