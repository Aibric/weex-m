<template>
    <div class="category-minibar">
          <wxc-icon name="back" 
                    class="category-minibar-btn" 
                    @wxcIconClicked="jump('/',{pages:'1',backId:backId})"></wxc-icon>
           <div class="category-minibar-s" @click="jump('/category/history',{path:'/category/detail'})">
              <text  class="category-minibar-input">{{goodsName || defaultName }}</text>
              <wxc-icon name="search"  class="category-minibar-search" style="fontSize:30px;position: absolute;top: 14px;left: 20px;"></wxc-icon>
          </div>
          <wxc-button text="搜索"
                    class="category-minibar-searchBtn"
                    :btn-style="btnStyle"
                    :text-style="textStyle"
                    @wxcButtonClicked="jump('/category/history',{path:'/category/detail'})"
                   ></wxc-button>
    </div>
</template>
<script>
import Vue from "vue";
import {
  WxcIcon,
  WxcButton
} from "weex-ui";

import mixin from "~/mixins";

const dom = weex.requireModule("dom");

export default {
  props:['backId','goodsName'],
  components: { WxcIcon, WxcButton},
  mixins: [mixin],
  data: () => ({
    defaultName:'3M 00安全帽',
    value: "",
    result:{
        status:true,
        list:[]
    }
  }),
  created() {
    this.btnStyle = {
      "background-color": "#E93B3D",
      "width": 76 + "px",
      "height": 48 + "px",
      "margin-right": 15 + "px"
    };
    this.textStyle = {
      "font-size": 24 + "px"
    };
  },
  methods: {
  }
};
</script>
<style>
.category-minibar {
  width: 750px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
  height: 100px;
  background-color: #fff;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.category-minibar-btn {
  flex: 1;
}
.category-minibar-s {
  flex: 8;
  flex-direction: row;
  align-items: center;
  position: relative;
}
.category-minibar-input {
  width: 550px;
  padding-top: 15px;
  padding-right: 20px;
  padding-bottom: 15px;
  padding-left: 60px;
  border-radius: 5px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  border-style: solid;
  border-width: 1px;
  border-color: #f7f7f7;
  background-color: #f7f7f7;
}
p.category-minibar-input {
  width: 550px;
  padding-top: 7px;
  padding-right: 20px;
  padding-bottom: 7px;
  padding-left: 60px;
  border-radius: 5px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  border-style: solid;
  border-width: 1px;
  border-color: #f7f7f7;
  background-color: #f7f7f7;
}
</style>