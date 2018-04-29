<template>
  <div class="address-footer"
       @click="jump('/member/addedit',{title:'新增收货地址',path:'/member/address'})">
        <text class="address-footer-add">+新建地址</text>
  </div>
</template>

<script>
import Vue from "vue";
import {    Utils,WxcIcon
        } from "weex-ui";

import mixin from "@/mixins";

const modal = weex.requireModule("modal");

export default {
  mixins: [mixin],
  data: () => ({
     
  }),
  created(){
   
  },
  methods: {
   
  }
};
</script>
<style>
.address-footer{
    width:750px;
    position: fixed;
    bottom:0px;
    left:0px;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    height:100px;
    line-height: 100px;
    padding-top:20px;
    padding-bottom:20px;
    padding-left:40px;
    padding-right:40px;
    background-color:#fff;
}
.address-footer-add{
    flex:1;
    height:80px;
    line-height: 80px;
    color:#fff;
    font-size: 34px;
    background-color:#D60008;
    text-align: center;
}
</style>