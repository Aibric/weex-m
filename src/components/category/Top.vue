<template>
    <div class="category-minibar">
          <wxc-icon  name="back" class="category-minibar-btn" @click="jump('/category/history',{pages:1})" ></wxc-icon>
          <div class="category-minibar-s" @click="jump('/category/history',{pages:1})">
              <text  class="category-minibar-input">3M 00安全帽</text>
              <wxc-icon name="search"  class="category-minibar-search" style="fontSize:30px"></wxc-icon>
          </div>
          <image class="category-minibar-short"
                 :src="imgPath('/common/shortcut/short.png')" 
                 @click="activeClick"/>
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
  mixins: [mixin],
  name:'CategoryTop',
  components: { WxcIcon, 
                WxcButton,
              },
  data: () => ({
    value: "",
    searchBtn: false,
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
      activeClick(){
          this.$emit('activeShortcut',true)
      }
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
p.category-minibar-input {
  width: 550px;
  padding-top: 14px;
  padding-right: 20px;
  padding-bottom: 14px;
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
.category-minibar-input {
  width: 550px;
  font-size:24px;
  padding-top: 14px;
  padding-right: 20px;
  padding-bottom: 14px;
  padding-left: 60px;
  border-radius: 5px;
  border-bottom-left-radius: 550px;
  border-bottom-right-radius: 550px;
  border-top-left-radius: 550px;
  border-top-right-radius: 550px;
  border-style: solid;
  border-width: 1px;
  color:#666666;
  border-color: #f7f7f7;
  background-color: #f7f7f7;
}
.category-minibar-search {
  position: absolute;
  left: 20px;
  top: 15px;
}
p.category-minibar-search {
  top: 20px;
}
.category-minibar-short{
    width:40px;
    height:40px;
    margin-right:20px;
}
figure.category-minibar-short{
    width:40px;
    height:40px;
    margin-right:20px;
}
</style>