<template>
    <div class="order-detail-total">
        <div class="order-detail-totalBox" >
           <div class="order-dt-row">
               <text class="order-dt-text">商品总额</text>
               <text class="order-dt-text">￥{{info.goods_amount}}</text>
           </div>
           <div class="order-dt-row">
               <text class="order-dt-text">运费(快递)</text>
               <text class="order-dt-text">￥{{info.shipping_fee}}</text>
           </div>
           <div class="order-dt-row">
               <text class="order-dt-text">订单总价</text>
               <text class="order-dt-text">￥{{info.order_amount}}</text>
           </div>
        </div>
        <div class="order-detail-totalBox order-detail-totalBoxL">
            <text class="order-dt-total">实付款：</text>
            <text class="order-dt-total order-dt-totalRed">￥{{info.order_amount}}</text>
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
.order-detail-total{
    width:750px;
    margin-top:20px;
    padding-left:30px;
    padding-right:30px;
    background-color: #fff;
}
.order-detail-totalBox{
    flex:1;
    padding-top:30px;
    padding-bottom:30px;
    border-bottom-style: solid;
    border-bottom-color: #f9f5f5;
    border-bottom-width: 1px;
}
.order-detail-totalBoxL{
    flex-direction: row;
    border-bottom-width: 0px;
    justify-content: flex-end;
}
.order-dt-row{
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
}
.order-dt-text{
    height:60px;
    line-height:60px;
    font-size: 30px;
    color: #858586;
}
.order-dt-total{
    font-size: 40px;
    height:80px;
    line-height: 80px;
    color: #26262A;
}
.order-dt-totalRed{
    color:#D60008;
}



</style>