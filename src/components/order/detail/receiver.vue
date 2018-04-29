<template>
    <div class="order-detail-reciver">
        <wxc-icon name="map" 
                  class="order-dr-map"
                  style="font-size: 30px;"></wxc-icon>
        <div class="order-dr-box">
            <div class="order-dr-info">
                <text class="order-dr-name">{{info.consignee}}</text>
                <text class="order-dr-phone">{{info.mobile}}</text>
            </div>
            <text class="order-dr-addr">地址：{{info.address}}</text>
        </div>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils,WxcIcon } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";



const dom = weex.requireModule("dom");

export default {
  props:['info'],
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
.order-detail-reciver{
    width:750px;
    margin-top:20px;
    padding-top:30px;
    padding-bottom:30px;
    flex-direction: row;
    align-items: flex-start;
    background-color: #fff;
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