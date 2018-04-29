<template>
        <div class="goods-speci-outer">
            <div class="goods-speci">
                <div class="goods-speci-row" 
                     v-for="(item,index) in goodsAttr" 
                     :key="index">
                    <text class="goods-speci-text goods-speci-pl goods-speci-lable">{{item.k}}</text>
                    <text class="goods-speci-text goods-speci-pl goods-speci-name">{{item.v}}</text>
                </div>
            </div>
        </div>
</template>
<script>
import Vue from "vue";

import { Utils } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

const dom = weex.requireModule("dom");

export default {
  components: { Utils },
  mixins: [mixin],
  props:['goodsAttr'],
  data: () => ({}),
  created() {},
  methods: {   }
};
</script>
<style scoped>
.goods-speci-outer{
     border-top-style:solid;
    border-top-color:#e5e5e5;
    border-top-width:1px;
    width:750px;
    background-color: #fff;
    padding-left: 25px;
    padding-right:25px;
    align-items: center;
}
.goods-speci{
    margin-top:20px;
    width:700px;
    border-left-style:solid;
    border-left-color:#e5e5e5;
    border-left-width:1px;
    border-right-style:solid;
    border-right-color:#e5e5e5;
    border-right-width:1px;
    border-bottom-style:solid;
    border-bottom-color:#e5e5e5;
    border-bottom-width:1px;
    justify-content: flex-start;
    margin-bottom: 50px;
}
.goods-speci-row{
    flex-direction: row;
}
.goods-speci-pl{
    padding-left:30px;
}
.goods-speci-text{
    font-size:28px;
    color: #222;
    text-align: left;
    padding-top:10px;
    padding-bottom:10px;
}
.goods-speci-lable{
    flex:1;
    border-top-style:solid;
    border-top-color:#e5e5e5;
    border-top-width:1px;
    border-right-style:solid;
    border-right-color:#e5e5e5;
    border-right-width:1px;
   
}
.goods-speci-name{
    flex:3;
    border-top-style:solid;
    border-top-color:#e5e5e5;
    border-top-width:1px;
}
</style>