<template>
  <div class="shortcut" 
        @click="hideShortcut"
       :style="{
           height:`${maxHeight}px`, 
           position: position,
           top: top,
           left: left,
           bottom: bottom,
           right: right
        }">
     <list class="shortcut-list">
        <cell class="shortcut-triangle">
            <image :src="imgPath('/common/shortcut/up.png')" 
                    class="shortcut-triangle-up"/>
        </cell>
        <cell v-for="(item,index) in paths" 
                :key="index" 
                @click="jump(item.path,{pages:item.pages})" 
                :class="[index === 0 
                    ? 'shortcut-list-top'
                    : '',
                    index >= paths.length - 1 
                        ? 'shortcut-list-last'
                        : '',
                    'shortcut-list-cell']">
            <image :class="[index === 0 ? 'shortcut-icon0' : 'shortcut-icon']"
                   :src="imgPath(item.url)"/>
            <text class="shortcut-text">{{item.text}}</text>
        </cell>
     </list>
  </div>
</template>

<script>
import Vue from "vue";
import {    Utils,
        } from "weex-ui";

import mixin from "@/mixins";

const modal = weex.requireModule("modal");

export default {
  components: { },
  mixins: [mixin],
  props:{
      shortcutShow: Boolean,
      position: {
          type: String,
          default: 'fixed'
      },
      top: {
          type: [Number, String],
          default: 0
      },
      left: {
          type: [Number, String],
          default: 0
      },
      bottom: [Number, String],
      right: [Number, String]
  },
  data: () => ({
      paths:[
          {
              url:'common/shortcut/home.png',
              text:'首页',
              path:'/',
              pages:'0'
          },
           {
              url:'common/shortcut/search.png',
              text:'分类搜索',
              path:'/',
              pages:'1'
          },
           {
              url:'common/shortcut/cart.png',
              text:'购物车',
              path:'/',
              pages:'2'
          },
           {
              url:'common/shortcut/user.png',
              text:'我的新明辉',
              path:'/',
              pages:'3'
          },
        //    {
        //       url:'common/shortcut/foot.png',
        //       text:'浏览记录',
        //       path:'/'
        //   },
        //    {
        //       url:'common/shortcut/love.png',
        //       text:'我的关注',
        //       path:'/'
        //   }
      ],
  }),
  created(){
    this.maxHeight = Utils.env.getPageHeight();
  },
  methods: {
   hideShortcut(){
       this.$emit('activeShortcut',false)
   }
  }
};
</script>
<style>
.shortcut{
    position: absolute;
    top:0;
    left:0;
    width:750px;
    align-items: flex-end;
    padding-right: 30px;
    padding-top: 70px;
}
.shortcut-list{
    width:240px;
    height:440px;
    align-items: flex-start;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius:10px;
}
.shortcut-list-top{
    border-top-left-radius: 10px;
    border-top-right-radius:10px;
}
.shortcut-list-last{
    border-bottom-left-radius: 10px;
    border-bottom-right-radius:10px;
}
.shortcut-triangle{
     width:240px;
     align-items: flex-end;
     padding-right:20px;
     height:16px;
}
.shortcut-triangle-up{
    width: 30px; 
    height: 30px; 
    margin-top: 35px;
}
.shortcut-list-cell{
    width:240px;
    align-items: center;
    background-color: rgba(0,0,0,.9);
    padding-top:15px;
    padding-bottom:15px;
    padding-left:10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom-style: solid;
    border-bottom-color: rgba(255,255,255,.2);
    border-bottom-width: 1px;
}
.shortcut-icon{
    width:35px;
    height:35px;
    margin-right:15px;
}
.shortcut-icon0{
    width:30px;
    height:30px;
    margin-right:15px;
}
figure.shortcut-icon{
    width:35px;
    height:35px;
    margin-right:25px;
}
figure.shortcut-icon0{
    width:30px;
    height:30px;
    margin-right:30px;
}
.shortcut-text{
    color:#ffffff;
    font-size:28px;
}
</style>