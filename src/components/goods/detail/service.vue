<template>
        <div class="goods-service">
            <div class="goods-service-item">
                <div class="goods-service-row goods-service-top ">
                    <div class="goods-service-line"></div>
                    <text class="goods-service-title goods-service-text">配送</text>
                    <div class="goods-service-line"></div>
                </div>
                <text class="goods-service-text">默认申通快递，大货、重货可发物流，如收货地未开通服务范围，可联系客服更改发货方式</text>
            </div>
            <div class="goods-service-item">
                <div class="goods-service-row goods-service-top ">
                    <div class="goods-service-line"></div>
                    <text class="goods-service-title goods-service-text">发货</text>
                    <div class="goods-service-line"></div>
                </div>
                <text class="goods-service-text">除特殊节假日及特殊情况，当日系统订单16:30点前当天发货，之后订单次日发货</text>
            </div>
            <div class="goods-service-item">
                <div class="goods-service-row goods-service-top ">
                    <div class="goods-service-line"></div>
                    <text class="goods-service-title goods-service-text">售后</text>
                    <div class="goods-service-line"></div>
                </div>
                <text class="goods-service-text">3日内如发现货物不足或多出情况，请与本公司客服人员联系，进行重新确认</text>
            </div>
            <div class="goods-service-item">
                <div class="goods-service-row goods-service-top ">
                    <div class="goods-service-line"></div>
                    <text class="goods-service-title goods-service-text">提醒</text>
                    <div class="goods-service-line"></div>
                </div>
                <text class="goods-service-text">请您务必在签收快递前，确认商品完好无损后再签收</text>
            </div>
            <div class="goods-service-item">
                <div class="goods-service-row goods-service-top ">
                    <div class="goods-service-line"></div>
                    <text class="goods-service-title goods-service-text">发票</text>
                    <div class="goods-service-line"></div>
                </div>
                <text class="goods-service-text">确认收到商品后由新明辉统一开具。欲了解详情请联系客服</text>
            </div>
            <div class="goods-service-item">
                <div class="goods-service-row goods-service-top ">
                    <div class="goods-service-line"></div>
                    <text class="goods-service-title goods-service-text">价格</text>
                    <div class="goods-service-line"></div>
                </div>
                <text class="goods-service-text">注册享受会员价格</text>
            </div>
        </div>
</template>
<script>
import Vue from "vue";

import { Utils,
         WxcIcon,
         wxcMinibar } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

const dom = weex.requireModule("dom");

export default {
  components: { Utils, WxcIcon, wxcMinibar },
  mixins: [mixin],
  data: () => ({
 
  }),
  created() {
    
  },
  methods: {
     
   
  }
};
</script>
<style scoped>
.goods-service-row{
    flex-direction: row;
}
.goods-service-text{
    font-size:24px;
    color:#868489;
}
.goods-service-item{
    width:750px;
    padding-left: 25px;
    padding-right:25px;
    padding-top:30px;
    padding-bottom:30px;
    background-color: #fff;
    margin-top:25px;
}
.goods-service-top{
    align-items: center;
    padding-bottom:20px;
}
.goods-service-line{
    width:270px;
    height:2px;
    background-color: #E4E4E4;
}
.goods-service-title{
    width:120px;
    text-align: center;
}
</style>