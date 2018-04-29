<template>
        <div class="goods-foot">
            <div class="goods-foot-cart" 
                 @click="jump('/',{pages:2})">
                <image class="goods-foot-cart-img" :src="imgPath('/goods/cart.png')"/>
                <text  class="goods-foot-cart-text">购物车</text>
                <div class="goods-foot-cart-tip"><text class="goods-foot-cart-tipt">{{cartsCount}}</text></div>
            </div>
            <text class="goods-foot-btn goods-foot-btn0" @click="addCarts('putCarts')">加入购物车</text>
            <text class="goods-foot-btn goods-foot-btn1" @click="getPushData('purchase')">立即购买</text>
           
        </div>
</template>
<script>
import Vue from "vue";

import { Utils,
         WxcIcon,
         wxcMinibar } from "weex-ui";

import mixin from "~/mixins";

import CartStore from '~/store/module/cart'
import store from "~/store";

const dom = weex.requireModule("dom");
const modal = weex.requireModule('modal')
export default {
    props:['goodsTotal','goodsSelect','cartsCount','goodsId'],
    components: { Utils, WxcIcon, wxcMinibar },
    mixins: [mixin],
    computed: {
        cartStore () {
            return CartStore
        }
    },
    data: () => ({
        countNum: 0,
        user:null
    }),
    async created() {
        this.user = (await store.mapGetters(['user'])).user
        this.countNum = await CartStore.states('countNum')
    },
    methods: {
        getPushData(val){
            if(this.user){
                 if(this.goodsTotal < 1){
                     this.$emit("choiceSelect",true)
                 }else{
                     this.$emit(val,this.goodsSelect)
                 }
            }else{
                this.jump("/login")
            }
        },
        addCarts(val){
            if(this.user){
                     this.$emit("choiceSelect",true)
            }else{
                this.jump("/login")
            }
        }
    }
};
</script>
<style scoped>
.goods-foot{
    width:750px;
    flex-direction: row;
    align-items: flex-start;
    position: fixed;
    bottom:0;
    left:0;
}
.goods-foot-cart{
    flex:2;
    height: 100px;
    line-height: 100px;
    padding-top:10px;
    position: relative;  
    align-items: center;
    background-color: rgba(255,255,255,0.95)
}
.goods-foot-cart-tip{
    position: absolute;
    top:0px;
    right:10px;
    padding-left:5px;
    padding-right:5px;
    background-color: #f23030;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}
.goods-foot-cart-tipt{
    color:#fff;
    font-size: 20px;
}
.goods-foot-cart-img{
    width:50px;
    height:50px;
}
.goods-foot-cart-text{
    font-size: 24px;
    padding-top:5px;
     color:#232326;
}
.goods-foot-btn{
    flex:4;
    color: #ffffff;
    font-size: 32px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}
.goods-foot-btn0{
  background-color: #f23030;
}
.goods-foot-btn1{
  background-color: #ffb03f;
}
</style>