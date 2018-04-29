<template>
  <div class="order-top">
        <wxc-icon  name="back" 
                   class="order-minibar-icon"
                   @wxcIconClicked="back(topInfo.path)" ></wxc-icon>
        <div class="order-top-title">
            <text class="order-top-text">{{topInfo.title}}</text>
        </div>
        <div class="order-minibar-iconr">
            <image :src="imgPath('/common/shortcut/root.png')"
                        @click="jump('/')"
                        class="order-minibar-btn-home"/>
            <image  v-if="topInfo.rightIcon"
                    class="order-minibar-short"
                    :src="imgPath('/common/shortcut/short.png')" 
                    @click="activeClick"/>
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
    activeClick(){
        this.$emit('activeShortcut',true)
    },
    back(path){
        this.jump(path,{pages:'3'})
    }
  }
};
</script>
<style>
.order-top{
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    height:100px;
    line-height: 100px;
    background-color: #fff;
    border-bottom-style:solid;
    border-bottom-color:#e7e7e7;
    border-bottom-width:1px;
}
.order-minibar-icon{
    flex:1;
    align-items: center;
}
.order-minibar-iconr{
    flex:1;
    align-items: center;
    flex-direction: row;
}
.order-top-title{
    flex:8;
    align-items: center;
}
.order-top-text{
    font-size:40px;
}
.order-minibar-short{
    width:40px;
    height:40px;
}
figure.order-minibar-short{
    width:40px;
    height:40px;
}
.order-minibar-btn-home{
    width:35px;
    height:35px;
    margin-right:20px;
}
figure.order-minibar-btn-home{
    width:35px;
    height:35px;
    margin-right:20px;
}
</style>