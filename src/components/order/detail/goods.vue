<template>
    <div class="order-detail-goods">
        <div class="order-detail-goodsBox" 
             v-for="item in goods.detail"
             :key="item.goods_id"
              @click="jump('/goods',{id:item.goods_id,path:'/order/detail?id='+goods.order_id})">
            <image :src="item.gallery"
                class="order-dg-img"/>
            <div class="order-dg-info">
                <div class="order-dg-names">
                    <text class="order-dg-name">{{item.goods_name}}</text>
                </div>
                <div class="order-dg-sizes">
                    <text class="order-dg-size">数量：{{item.goods_num}}</text>
                    <div v-for="(ix,index) in item.spec"
                         v-if="index+1 <= 2"
                         :key="index"
                         :class="[index+1 === 2 ?'lines' :'']">
                        <text :class="[index+1 === item.spec.length ?'liness' :'','order-dg-size']">{{ix.k}}：{{ix.v}}</text>
                    </div>
                </div>
                <div class="order-dg-foot">
                    <text class="order-dg-price">￥{{item.goods_price}}</text>
                    <text class="order-dg-cart" @click="addCart(item)">加购物车</text>
                </div>
            </div>    
        </div>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils, } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";



const dom = weex.requireModule("dom");
const modal = weex.requireModule("modal");

export default {
  props:['goods'],
  components: { Utils },
  mixins: [mixin],
  data: () => ({
     
  }),
  created() {
   
  },
  mounted(){
     
  },
  methods: {
        addCart(item){//加入购物车--跳转到购物车页面
            let detail = [item];
            this.$emit('buyAgain',detail)
        },
  }
};
</script>
<style scoped>
.order-detail-goods{
    width:750px;
    margin-top:20px;
    padding-left:30px;
    padding-right:30px;
    background-color: #fff;
}
.order-detail-goodsBox{
    flex:1;
    flex-direction: row;
    align-items: flex-start;
    flex-direction: row;
    padding-top:30px;
    padding-bottom:30px;
    border-bottom-style: solid;
    border-bottom-color: #f9f5f5;
    border-bottom-width: 1px;
}
.order-dg-img{
    width:200px;
    height:200px;
    border-style: solid;
    border-color: #f9f5f5;
    border-width: 1px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.order-dg-info{
    flex: 1;
    padding-left:20px;
}
.order-dg-names{
    flex:1;
    justify-content: flex-start;
    align-items: flex-start;
}
.order-dg-name{
    lines: 1;
    font-size:34px;
    text-overflow: ellipsis;
    color: #26262A;
}
.order-dg-sizes{
    flex:1;
    height:94px;
    line-height:94px;
    padding-top:10px;
    justify-content: flex-start;
    align-items: flex-start;    
    flex-direction: row;
}
p.order-dg-sizes{
    padding-top:5px;
}
.order-dg-size{
    font-size: 26px;
    color: #858586;
    padding-right:10px;
}
.order-dg-foot{
    flex:1;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: row;
}
.order-dg-price{
    font-size:36px;
    color: #26262A;
}
.order-dg-cart{
    font-size: 32px;
    color: #26262A;
    padding-top:5px;
    padding-bottom:5px;
    padding-left:15px;
    padding-right:15px;
    border-color:#B3B4B6;
    border-style:solid;
    border-width:1px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.lines{
    flex:1;
}
.liness{
    lines: 1;
    font-size:26px;
    text-overflow: ellipsis;
    color: #858586;
}
</style>