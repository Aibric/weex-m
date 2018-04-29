<template>
  <div class="order-saerch">
        <wxc-searchbar ref="wxc-searchbar"
                       @wxcSearchbarCancelClicked="wxcSearchbarCancelClicked"
                       @wxcSearchbarInputOnInput="wxcSearchbarInputOnInput"
                       @wxcSearchbarCloseClicked="wxcSearchbarCloseClicked"
                       @wxcSearchbarInputOnFocus="wxcSearchbarInputOnFocus"
                       @wxcSearchbarInputOnBlur="wxcSearchbarInputOnBlur"
                       :bar-style="barStyle"
                       class="order-saerch-input"></wxc-searchbar>
        <text class="value-text">{{value}}</text>
  </div>
</template>

<script>
import Vue from "vue";
import {    Utils,
            WxcIcon,
            WxcSearchbar
        } from "weex-ui";

import mixin from "@/mixins";

const modal = weex.requireModule("modal");

export default {
  props:['topTitle'],
  components: { WxcIcon,
                WxcSearchbar },
  mixins: [mixin],
  data: () => ({
     value:'',
     barStyle:{
         'padding-left':'0'
     }
  }),
  created(){
   
  },
  methods: {
        wxcSearchbarInputOnFocus () {
          modal.toast({ 'message': 'onfocus', 'duration': 1 });
        },
        wxcSearchbarInputOnBlur () {
          modal.toast({ 'message': 'onbulr', 'duration': 1 });
        },
        wxcSearchbarCloseClicked () {
          modal.toast({ 'message': 'close.click', 'duration': 1 });
        },
        wxcSearchbarInputOnInput (e) {
          this.value = e.value;
        },
        wxcSearchbarCancelClicked () {
          modal.toast({ 'message': 'cancel.click', 'duration': 1 });
        },
        wxcSearchbarInputDisabledClicked () {
          modal.toast({ 'message': 'input.onclick', 'duration': 1 });
        },
        wxcSearchbarDepChooseClicked () {
          modal.toast({ 'message': 'dep.choose.click', 'duration': 1 });
        }
  }
};
</script>
<style>
.order-saerch{
    width:750px;
    background-color: #e8e8ed;
    padding-top:16px;
    padding-bottom:16px;
    padding-left:16px;
    padding-right:16px;
}



.wxc-demo {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #F6F9F8;
  }
  .scroller {
    flex: 1;
  }
  .wrapper {
    background-color: #FFFFFF;
  }
  .demo {
    height: 160px;
  }
  .demo1 {
    margin-top: 20px;
  }
  .value-text {
    margin: 24px;
    font-size: 30px;
    color: #333333;
  }
  .hint {
    margin-left: 24px;
    font-size: 30px;
    color: #333333;
  }
</style>