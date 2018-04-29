<template>
    <div class="order-tab" ref="topTab">
        <text v-for="(item,index) in tabTitle" 
              @click="activeTab(index,item.value)" 
              :class="['order-tab-title',activeTabTile === index ? 'order-tab-active' : '']" 
              :key="index">{{item.name}}</text>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils, } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";



const dom = weex.requireModule("dom");

export default {
  components: { Utils },
  mixins: [mixin],
  data: () => ({
        tabTitle:[
            {name:'全部',value:'all'},
            {name:'待付款',value:'unpay'},
            {name:'待发货',value:'unsent'},
            {name:'已发货',value:'sent'}],
        activeTabTile:0,
  }),
  created() {
   
  },
  mounted(){
     
  },
  methods: {
      activeTab(index,value){
          let self = this;
          self.activeTabTile = index;
          self.$emit('searchKey',value);
      }
  }
};
</script>
<style scoped>
.order-tab{
    width:750px;
    height:82px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    border-bottom-style: solid;
    border-bottom-color: #f9f5f5;
    border-bottom-width: 1px;
}
.order-tab-title{
    flex:1;
    margin-left:50px;
    margin-right:50px;
    text-align: center;
    height:80px;
    line-height: 80px;
    font-size:28px;
    color: #222;
}
.order-tab-active{
    color:#D60008;
    border-bottom-style: solid;
    border-bottom-color: #D60008;
    border-bottom-width: 1px;
}
</style>