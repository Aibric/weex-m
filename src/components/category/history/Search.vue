<template>
    <div class="category-minibar">
          <wxc-icon name="back" 
                    class="category-minibar-btn" 
                    @wxcIconClicked="back"></wxc-icon>
          <div class="category-minibar-s">
              <input type="text"  placeholder="3M 安全帽" class="category-minibar-input"  value="" :autofocus=true @input="oninput"/>
              <wxc-icon name="search"  class="category-minibar-search" style="fontSize:30px;position: absolute;top: 14px;left: 20px;"></wxc-icon>
          </div>
          <wxc-button text="搜索"
                    class="category-minibar-searchBtn"
                    :btn-style="btnStyle"
                    :text-style="textStyle"
                    @wxcButtonClicked="searchClick"></wxc-button>
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
const stream = weex.requireModule('stream');
const modal = weex.requireModule('modal');

export default {
  components: { WxcIcon, WxcButton},
  mixins: [mixin],
  data: () => ({
    value: "",
    result:{
        status:true,
        list:[]
    },
    timeOut: null
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
    oninput(event) {
        clearTimeout(this.timeOut)
        let self = this;
        self.value = event.value;
        let key = {keyword:self.value}
        this.timeOut = setTimeout(function(){
            self.getResult(key);
        }, 800)
    },
    getResult(key){
      let self = this;
      stream.fetch({
        method: 'POST',
        url: 'http://www.xinminghui.com/search/smart',
        type:'json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:  self.setParames(key, '', '')
      }, function(ret) {
        if(!ret.ok){
          console.log("request failed");
        }else{
          self.$set(self.result,'status',true);
          self.$set(self.result,'list',ret.data.result);
          self.$emit("searchResult",self.result)
        }
      },function(response){
        
            
      });
    },
    back(){
        if(this.queryParames().pages){
            this.jump('/',{pages:this.queryParames().pages});
        }else if(this.queryParames().path){
             this.jump(this.queryParames().path);
        }
    },
    searchClick(){
        let self = this;
        if(self.value){
            self.jump('/category/detail',{id:'',searchKey:self.value})
        }else{
            modal.toast({
                message: '请输入搜索名称',
                duration: 0.8
            })
        }

        
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
.category-minibar-input {
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


</style>