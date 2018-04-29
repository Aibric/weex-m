<template>
    <div class="order-detail-track"
         @click="jump('order/logistics',{orderInfo:orderInfo})">
        <image :src="imgPath('/order/track.png')" 
              class="order-detail-tl"/>
        <text class="order-detail-tt">物流详情</text>
        <wxc-icon name="more" class="morder-detail-tr"></wxc-icon>
    </div> 
</template>
<script>
import Vue from "vue";

import { Utils,WxcIcon } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";



const dom = weex.requireModule("dom");

export default {
  props:['orderInfo'],
  components: { Utils,WxcIcon },
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
.order-detail-track{
    width:750px;
    margin-top:20px;
    padding-top:30px;
    padding-bottom:30px;
    padding-left:30px;
    padding-right: 30px;
    align-items: flex-start;
    background-color: #fff;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}
.order-detail-tt{
    flex:1;
    padding-left:25px;
    text-align: left;
    font-size: 34px;
    color: #26262A;
}
.order-detail-tl{
    width:45px;
    height:45px;
}
.order-detail-tr {
    color: #888;
    padding-top: 20px;
    font-size: 16px;
    margin-left: 15px;
}
p.order-detail-tr {
    color: #888;
    padding-top: 20px;
    font-size: 16px;
    margin-left: 15px;
}




















.order-dr-map{
    flex:1;
    padding-left:30px;   
}
.order-dr-box{
    flex: 14;
    padding-right:30px;
    padding-left:10px;
}
.order-dr-info{
    flex:1;
    flex-direction: row;
}
.order-dr-name{
    font-size: 34px;
    height:34px;
    line-height: 34px;
    color: #26262A;
    font-weight: 500;
    margin-right: 30px;
}
.order-dr-phone{
    font-size: 34px;
    height:34px;
    line-height: 34px;
    color: #26262A;
    font-weight: 500;
}
.order-dr-addr{
    flex:1;
    font-size: 30px;
    padding-top:15px;
    color: #858586;
}
</style>