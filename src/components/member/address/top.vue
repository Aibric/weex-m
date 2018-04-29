<template>
  <div class="address-top">
        <wxc-icon name="back" 
                  class="address-minibar-icon"
                  @wxcIconClicked="backPage(topInfo.back)" ></wxc-icon>
        <div class="address-top-title">
            <text class="address-top-text">{{topInfo.title}}</text>
        </div>
  </div>
</template>

<script>
import Vue from "vue";
import {    Utils,WxcIcon
        } from "weex-ui";

import mixin from "@/mixins";

const modal = weex.requireModule("modal");

export default {
  props:['topInfo'],
  components: { WxcIcon },
  mixins: [mixin],
  data: () => ({
     
  }),
  created(){
   
  },
  methods: {
    backPage(path){
        this.jump(path,{'pages':'3'});
    },
    editName(){
        //编辑姓名
        this.newName
    }
  }
};
</script>
<style>
.address-top{
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    height:100px;
    line-height: 100px;
    border-bottom-style:solid;
    border-bottom-color:#e7e7e7;
    border-bottom-width:1px;
    background-color:#fff;
}
.address-minibar-icon{
    flex:1;
    align-items: center;
}
.address-top-title{
    flex:6;
    align-items: center;
    padding-right:50px;
}
.address-top-text{
    font-size:38px;
    color:#26262A;
}
.address-minibar-short{
    width:40px;
    height:40px;
}
figure.address-minibar-short{
    width:40px;
    height:40px;
}
.address-minibar-right{
    flex:1;
    align-items: center;
    text-align: center;
}
.address-minibar-sure{
    font-size:34px;
    color:#85878A;
}
</style>