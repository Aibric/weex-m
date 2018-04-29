<template>
  <div class="person-top">
        <wxc-icon name="back" 
                  class="person-minibar-icon"
                  @wxcIconClicked="backPage(topInfo.back)" ></wxc-icon>
        <div class="person-top-title">
            <text class="person-top-text">{{topInfo.title}}</text>
        </div>
        <div class="person-minibar-right">
           <text class="person-minibar-sure" 
                 v-if="topInfo.icon.show"
                 @click="editName"> 确定</text>
        </div>
  </div>
</template>

<script>
import Vue from "vue";
import {    Utils,WxcIcon
        } from "weex-ui";

import mixin from "@/mixins";
import store from '~/store'

const modal = weex.requireModule("modal");

export default {
  props:['topInfo','newName'],
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
    async editName(){
        //编辑姓名
        let {data: {payload},status,ok} = await this.stream("app.!member.update", {body:{
            C_name:this.newName
        }})
        if (payload.code === 200) {
            store.commit('SET_USER_NAME',this.newName)
            modal.toast({
                    message: payload.message,
                    duration: 0.8
            });
            this.jump('/member/personal'); 
        }
    }
  }
};
</script>
<style>
.person-top{
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
.person-minibar-icon{
    flex:1;
    align-items: center;
}
.person-top-title{
    flex:6;
    align-items: center;
}
.person-top-text{
    font-size:38px;
}
.person-minibar-short{
    width:40px;
    height:40px;
}
figure.person-minibar-short{
    width:40px;
    height:40px;
}
.person-minibar-right{
    flex:1;
    align-items: center;
    text-align: center;
}
.person-minibar-sure{
    font-size:34px;
    color:#85878A;
}
</style>