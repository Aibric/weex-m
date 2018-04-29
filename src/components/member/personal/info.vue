<template>
  <list class="person-info">
        <cell>
            <div class="person-info-panel">
               <text class="person-info-label">头像</text>
               <div class="person-info-r">
                   <image :src="imgPath('/member/avatar.png')"
                          class="person-info-logo"/>
                    <wxc-icon name="more" class="person-info-more"></wxc-icon>
               </div>
            </div>
        </cell>
         <cell>
            <div class="person-info-panel">
               <text class="person-info-label">登录名</text>
               <div class="person-info-r">
                  <text class="person-info-grey" style="padding-right:42px;">{{userInfo.username}}</text>
               </div>
            </div>
        </cell>
        <cell @click="editInfo(userInfo.name,'name')">
            <div class="person-info-panel">
               <text class="person-info-label">姓名</text>
               <div class="person-info-r">
                   <text class="person-info-grey">{{userInfo.name}}</text>
                    <wxc-icon name="more" class="person-info-more"></wxc-icon>
               </div>
            </div>
        </cell>
        <cell @click="editInfo(userInfo.sex,'sex')">
            <div class="person-info-panel">
               <text class="person-info-label">性别</text>
               <div class="person-info-r">
                   <text class="person-info-grey">{{userInfo.sex}}</text>
                    <wxc-icon name="more" class="person-info-more"></wxc-icon>
               </div>
            </div>
        </cell>
        <cell @click="pickDate">
            <div class="person-info-panel">
               <text class="person-info-label">出生日期</text>
               <div class="person-info-r">
                    <text class="person-info-grey">{{userInfo.birthday}}</text>
                    <wxc-icon name="more" class="person-info-more"></wxc-icon>
               </div>
            </div>
        </cell>
  </list>
</template>

<script>
import Vue from "vue";
import {    Utils,WxcIcon
        } from "weex-ui";

import mixin from "@/mixins";

import store from "~/store";

const modal = weex.requireModule("modal");
const picker = weex.requireModule('picker')

export default {
  props:['topInfo'],
  components: { WxcIcon },
  mixins: [mixin],
  data: () => ({
     birthday:'2017年4月13日',
     value:'2017-04-13',
     userInfo:{},
  }),
  async created(){
    this.userInfo = (await store.mapGetters(['user'])).user.user_info;
  },
  methods: {
    editInfo(val,card){
        this.jump('/member/edit', {'edit':card, 'value':val})
    },
    async pickDate () {
        picker.pickDate({
          value: this.value
        }, event => {
          if (event.result === 'success') {
            this.value = event.data;
            let dateYMD = event.data;
            dateYMD = dateYMD.split("-");
            this.birthday = dateYMD[0]+"年"+dateYMD[1]+"月"+dateYMD[2]+'日';

            let Birthday =  dateYMD[0]+"-"+dateYMD[1]+"-"+dateYMD[2];


            this.setBirthday(Birthday);
           
          }
        })
    },
    async setBirthday(birthday){
            let {data: {payload},status,ok} = await this.stream("app.!member.update", {
                    body:{
                        C_birthday: birthday
                    }
            })
            if (payload.code === 200) {
                store.commit('SET_USER_BIRTHDAY',birthday)
            }
    }
  }
};
</script>
<style>
.person-info{
    background-color: #FEFEFE;
   
}
.person-info-panel{
    padding-left:30px;
    padding-right:30px;
    padding-top:30px;
    padding-bottom:30px;
    border-bottom-style:solid;
    border-bottom-color:#e7e7e7;
    border-bottom-width:1px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.person-info-label{
    font-size:30px;
}
.person-info-r{
    flex-direction: row;
    align-items: center;
}
.person-info-logo{
    width:100px;
    height:100px;
}
.person-info-more{
    color: #81838e;
    font-size: 30px;
    height:30px;
    line-height:30px;
    margin-left: 15px;
}
.person-info-grey{
    color: #81838e;
    font-size:30px;
    height:30px;
    line-height:30px;
}


</style>