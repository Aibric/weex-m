<template>
        <scroller :style="{height:maxHeight+'px'}"
                  class="category-detail-list" 
                  ref="scroller-lists"
                   @scroll="scroll">
            <div  v-if="square">
                <div  v-for="(item,index) in goodsList" 
                     :key="item.goods_id" 
                     class="category-dl-menu" 
                     :ref="'item'+index"
                     @click="jump('/goods',{id:item.goods_id,path:'/category/detail?id='+parentGoodsId})">
                    <image class="category-dl-img"
                           :src="item.gallery"/>
                    <div class="category-dl-info">
                        <div class="category-dl-name">
                            <text class="category-dl-names" lines="2">{{item.goods_name}}</text>
                        </div>
                        <div class="category-dl-bottom">
                            <text class="category-dl-doller">￥</text>
                            <text class="category-dl-int"
                                  v-if="[item.price].toString().indexOf('.') !== -1 ">{{[item.price].toString().split('.')[0]}}</text>
                            <text class="category-dl-score"
                                  v-if="[item.price].toString().indexOf('.') !== -1 ">.{{[item.price].toString().split('.')[1]}}</text>
                             <text class="category-dl-score"
                                  v-if="[item.price].toString().indexOf('.') === -1">{{item.price}}</text>
                        </div>
                    </div>
                </div>
            </div>
            <div class="category-dl-menu category-dl-menu-row" v-else >
                <div style="flex:1">
                    <div v-for="(item,index) in goodsList" 
                         :key="item.goods_id" 
                         v-if=" index%2 === 0"  
                         @click="jump('/goods',{id:item.goods_id,path:'/category/detail?id='+parentGoodsId})"
                         :ref="'item'+index" 
                         class="category-dl-menu-rows category-dl-menu-rows-br">
                        <image style="width:200px;height:200px" 
                                :src="item.gallery"/>
                        <div class="category-dl-info category-dl-rinfo">
                            <div class="category-dl-rname">
                                <text class="category-dl-rnames" lines="1">{{item.goods_name}}</text>
                            </div>
                            <div class="category-dl-bottom category-dl-rbottom">
                                <text class="category-dl-doller">￥</text>
                                 <text class="category-dl-int"
                                       v-if="[item.price].toString().indexOf('.') !== -1 ">{{[item.price].toString().split('.')[0]}}</text>
                                 <text class="category-dl-score"
                                       v-if="[item.price].toString().indexOf('.') !== -1 ">.{{[item.price].toString().split('.')[1]}}</text>
                                 <text class="category-dl-score"
                                       v-if="[item.price].toString().indexOf('.') === -1">{{item.price}}</text>
                            </div>
                        </div>
                    </div>
                </div>
                <div  style="flex:1">
                    <div v-for="(item,index) in goodsList" 
                         :key="item.goods_id" 
                         v-if=" index%2 === 1"  
                         @click="jump('/goods',{id:item.goods_id,path:'/category/detail?id='+parentGoodsId})"
                         :ref="'item'+index" 
                         class="category-dl-menu-rows">
                       <image style="width:200px;height:200px" 
                              :src="item.gallery"/>
                       <div class="category-dl-info category-dl-rinfo">
                          <div class="category-dl-rname">
                              <text class="category-dl-rnames" lines="1">{{item.goods_name}}</text>
                          </div>
                          <div class="category-dl-bottom category-dl-rbottom">
                               <text class="category-dl-doller">￥</text>
                                <text class="category-dl-int"
                                       v-if="[item.price].toString().indexOf('.') !== -1 ">{{[item.price].toString().split('.')[0]}}</text>
                                <text class="category-dl-score"
                                       v-if="[item.price].toString().indexOf('.') !== -1 ">.{{[item.price].toString().split('.')[1]}}</text>
                                <text class="category-dl-score"
                                       v-if="[item.price].toString().indexOf('.') === -1">{{item.price}}</text>
                          </div>
                       </div>
                    </div>
                </div>
           </div>
            <div v-if="finish"
                  class="category-finish"><text>抱歉，没有更多数据了...</text></div>
            <loading class="loading" @loading="onloading">
            </loading>
        </scroller>
</template>
<script>
import Vue from "vue";
import { WxcIcon, Utils } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";
import { demo1 } from '../../../filters/index';

const dom = weex.requireModule("dom");
const modal = weex.requireModule('modal')

export default {
  components: { WxcIcon },
  mixins: [mixin],
  props:['square','goodsList','finish'],
  data: () => ({
    maxHeight: Utils.env.getPageHeight()-180,
    parentGoodsId:'',
  }),
  created() {
       this.parentGoodsId = this.queryParames().id || 0;
  },
  mounted(){
    
  },
  methods: {
    scroll(event){
        let self = this;
        if(event.contentOffset.y < -10){
            self.$emit("topBtn",true)
        }else{
            self.$emit("topBtn",false)
        }
    },
    goTop(){//返回顶部
        let elements = this.$refs.item0[0];
        dom.scrollToElement(elements,{})
    },
    onloading (event) {//下拉加载更多数据
        if(!this.moreFinish){
            this.$emit("moreData",true);
        }
      
    },
  }
};
</script>
<style scoped>
.category-detail-list {
  width: 750px;
  align-items: flex-start;
  background-color: #ffffff;
  padding-bottom:20px;
}
.category-dl-menu {
  width: 750px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
  padding-right: 15px;
}
.category-dl-img{
    width:260px;
    height:260px;
}
.category-dl-info {
  flex:1;
  padding-left: 15px;
  padding-right: 25px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #f7f7f7;
}
.category-dl-menu-rows-br {
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #f7f7f7;
}
.category-dl-name {
  flex:1;
  padding-bottom: 110px;
}
.category-dl-names {
  lines: 2;
  text-overflow: ellipsis;
  color: #666666;
  font-size: 32px;
  line-height: 40px;
}
.category-dl-bottom {
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
}
.category-dl-bottom-p {
  padding-bottom: 5px;
}
p.category-dl-bottom-r {
  margin-right: 25px;
}
.category-dl-bottom-r {
  margin-right: 25px;
}
.category-dl-menu-row {
  width: 750px;
  flex-direction: row;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
}
.category-dl-menu-rows {
  align-items: center;
  padding-top: 15px;
  padding-bottom: 10px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #f7f7f7;
}
.category-dl-rinfo {
  width: 345px;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
  padding-right: 15px;
  justify-content: flex-start;
  border-bottom-width: 0px;
}
.category-dl-rname {
  width: 350px;
  padding-right:15px;
  padding-bottom: 15px;
}
p.category-dl-rnames {
  lines: 1;
  text-overflow: ellipsis;
  color: #666666;
  font-size: 32px;
  height:40px;
  line-height: 40px;
}
.category-dl-rnames {
  lines: 1;
  text-overflow: ellipsis;
  color: #666666;
  font-size: 32px;
  height:40px;
  line-height: 40px;
}
.category-dl-doller{
    font-size: 26px;
    color: #d60008;
    height: 34px;
    line-height: 34px;
}
.category-dl-int{
    font-size: 34px;
    color: #d60008;
    height: 34px;
    line-height: 34px;
}
.category-dl-score{
    font-size: 28px;
    color: #d60008;
    height: 34px;
    line-height: 34px;
}
.category-finish{
    color: #81838e;
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 32px;
    width:750px;
    align-items: center;
}
p.category-finish{
    color: #81838e;
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 32px;
    width:750px;
    align-items: center;
}
</style>