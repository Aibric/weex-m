<template>
        <div class="goods-flex-row goods-minbar">
            <wxc-icon name="back"  
                      @wxcIconClicked="back" 
                      class="goods-minbar-btn"></wxc-icon>
            <div class="goods-flex-row goods-minbar-tab-title">
                <text v-for="(item,index) in tabTitle" 
                      @click="tabActive(index)" 
                      :class="[ activeTopIndex === index ? 'goods-minbar-tab-title-active' : '','goods-minbar-tab-title-size']" 
                      :key="index">{{item}}</text>
            </div>
            <div class="goods-minbar-btn-right">
                <image :src="imgPath('/common/shortcut/root.png')"
                        @click="jump('/')"
                        class="goods-minbar-btn-home"/>
                <image  class="goods-minibar-short"
                        :src="imgPath('/common/shortcut/short.png')" 
                        @click="activeClick"/>
            </div>
           
        </div>
</template>
<script>
import Vue from "vue";

import { Utils,
         WxcIcon,
         wxcMinibar } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

const dom = weex.requireModule("dom");

export default {
  components: { Utils, WxcIcon, wxcMinibar },
  mixins: [mixin],
  props:['activeTopIndex'],
  data: () => ({
      tabTitle:['商品','详情'],
      backId:'',
  }),
  created() {
     this.backId = this.queryParames().backId || 0;
  },
  methods: {
    tabActive(val){
      this.$emit('clickTop',val)
    },
    activeClick(){
        this.$emit('activeShortcut',true)
    },
    back(){
       if(this.queryParames().pages){
           this.jump('/',{pages:this.queryParames().pages});
       }else if(this.queryParames().path){
            this.jump(this.queryParames().path);
       }
    },
   
  }
};
</script>
<style scoped>
.goods-flex-row{
    flex-direction: row;
}
.goods-minbar{
    width:750px;
    height:80px;
    border-bottom-style:solid;
    border-bottom-color:#e5e5e5;
    border-bottom-width:1px;
    background-color:#fff;
}
.goods-minbar-btn{
    flex:1;
    height:80px;
    line-height: 80px;
    align-items: center;
    text-align: center;
}
.goods-minbar-btn-right{
    flex:2;
    height:80px;
    line-height: 80px;
    align-items: center;
    text-align: center;
    flex-direction: row;
    padding-right:10px;
}
.goods-minbar-tab-title{
    flex:8;
    justify-content: space-around;
    align-items: center;
}
.goods-minbar-tab-title-size{
    height:80px;
    line-height: 80px;
    font-size:34px;
    color: #222;
}
.goods-minbar-tab-title-active{
    border-bottom-style:solid;
    border-bottom-color:red;
    border-bottom-width:2px;
}
.goods-minibar-short{
    width:40px;
    height:40px;
    margin-right:20px;
}
figure.goods-minibar-short{
    width:40px;
    height:40px;
    margin-right:20px;
}
.goods-minbar-btn-home{
    width:35px;
    height:35px;
    margin-right:20px;
}
</style>