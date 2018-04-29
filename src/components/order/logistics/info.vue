<template>
  <div class="logistics-info">
        <div class="logistics-ir">
           <text class="logistics-irt">订单编号：</text>
           <text class="logistics-irt">{{orderInfo.sn}}</text>
        </div>
         <div class="logistics-ir">
           <text class="logistics-irt">货运单号：</text>
           <text class="logistics-irt">222222222222</text>
        </div>
         <div class="logistics-ir">
           <text class="logistics-irt">发货方式：</text>
           <text class="logistics-irt">{{orderInfo.name}}</text>
        </div>
  </div >
</template>
<script>
import Vue from "vue";

import { Utils, } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";



const dom = weex.requireModule("dom");

export default {
    props:['orderInfo','orderNumber'],
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
.logistics-info{
    width:750px;
    padding-left:30px;
    padding-right:30px;
    background-color: #fff;
}
.logistics-ir{
    flex:1;
    flex-direction: row;
    align-items: flex-start;
}
.logistics-irt{
    height:60px;
    line-height:60px;
    font-size: 30px;
    color: #858586;
}
</style>