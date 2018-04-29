<template>
<scroller  :style="{height:maxHeight+'px'}"
           ref="orderLists"
           class="order-lists"
           @scroll="scroll">
    <div   class="order-lists-cell" 
            :ref="'item'+index"
           v-for="(item,index) in orderList" 
           :key="item.order_id"
           @click="jump('/order/detail',{id:item.order_id})">
        <div class="order-lists-panel">
                <div class="order-lists-top order-lists-row">
                    <div class="order-lists-row">
                        <text class="order-lists-top-text order-lists-colorg">订单号：</text>
                        <text class="order-lists-top-text">{{item.order_sn}}</text></div>
                    <image  :src="imgPath('/common/del.png')"
                            class="order-del"
                            v-for="(ix,index) in item.buttons"
                            :key="index"
                            v-if="ix.k === 'delete'"/>
                    <text class="order-lists-top-text order-lists-colorg"
                          v-else>{{item.order_status.name}}</text>
                </div>
                <div class="order-lists-goods order-lists-row yanqi" 
                     v-if=" item.detail.length === 1">
                     <div   class="order-lists-gnbox"
                            v-for="(node,index) in item.detail"
                            :key="index"
                            @click="jump('/goods',{id:node.goods_id,path:'/order/index'})">
                        <div class="order-lists-imgBox">
                            <image :src="node.gallery"
                                   class="order-lists-imgGoods"/>
                        </div>
                        <div class="order-lists-nameBox">
                            <text class="order-lists-nameGoods">{{node.goods_name}}</text>
                        </div>
                     </div>
                    
                </div>
                <div class="order-lists-goods order-lists-row" v-else>
                     <div class="order-lists-imgBox"
                          v-for="(node,index) in item.detail"
                          :key="index"
                          @click="jump('/goods',{id:node.goods_id,path:'/order/index'})">
                         <image :src="node.gallery"
                                class="order-lists-imgGoods"/>
                    </div>
                </div>
                <div class="order-lists-number order-lists-row">
                    <text class="order-lists-number-text">共{{item.goods_num_amount}}件商品</text>
                    <text class="order-lists-number-text order-lists-lr">实付款</text>
                    <text class="order-lists-number-price">￥{{item.order_amount}}</text>
                </div>
                <div class="order-lists-footer">
                    <text class="order-lists-fbtn order-lists-eval"
                          @click="operation(item.detail.order_id,ix.k)"
                          v-for="(ix,index) in item.buttons"
                          :key="index"
                          v-if="ix.k !== 'buyAgain' && ix.k !== 'payNow'">{{ix.v}}</text>
                    <text class="order-lists-fbtn order-lists-buy"
                          @click="pay()"
                          v-for="(ix,index) in item.buttons"
                          :key="index"
                          v-else-if="ix.k === 'payNow'">{{ix.v}}</text>
                    <text class="order-lists-fbtn order-lists-buy"
                          @click="buyAgain(item.detail)"
                          v-for="(ix,index) in item.buttons"
                          :key="index"
                          v-if="ix.k === 'buyAgain'">{{ix.v}}</text>
                </div>
        </div>
    </div>
    <text  v-if="finish"
           class="order-lists-null">抱歉，没有更多数据了...</text>
    <loading class="loading" @loading="onloading">
      
   </loading>
    <wxc-loading :show="isShow"
                          type="default"></wxc-loading>
</scroller>
</template>
<script>
import Vue from "vue";

import { Utils,WxcLoading } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import storeCart from '~/store/module/cart'

const dom = weex.requireModule("dom");
const modal = weex.requireModule("modal");

export default {
    props:['orderList','finish'],
    components: { Utils,WxcLoading },
    mixins: [mixin],
    data: () => ({
         maxHeight: Utils.env.getPageHeight()-182,
         isShow:false,//数据加载提示
    }),
    methods: {
        onloading (event) {//下拉加载更多数据
            if(!this.moreFinish){
                this.$emit("moreData",true);
            }
        },
        async buyAgain(detail){//再次购买
            let self = this;
            self.isShow = true;
            let items = [];
            detail.map((item,index) => {
                let ix = {};
                ix.gid = item.goods_id;
                ix.num = item.goods_num;
                self.$set(items,index,ix)
            })
            let {payload: {message, code, info}} = await storeCart.dispatch('create', items)
            if(code === 200){
                  self.isShow = false;
                  modal.toast({
                    message: info,
                    duration: 0.8
                });
                self.jump('/', { pages: 2 })
            }
        },
        async operation(id,name){
            let self = this;
            self.isShow = true;
            let {data: {payload: {message,code,info}}} = await self.stream(`app.!order[${name}]`,{query:{id}});
            if(code === 200){
                 self.isShow = false;
                  modal.toast({
                    message: info,
                    duration: 0.8
                });  
                self.$emit('getOrder')
            }
        },
        pay(){
            this.alert("支付未实现！！")
        },
        scroll(event){
            let self = this;
            if(event.contentOffset.y < -10){
                self.$emit("scrollTop",true)
            }else{
                self.$emit("scrollTop",false)
            }
        },
        goTop(){
            let self = this;
            let elements = self.$refs.item0[0];
            dom.scrollToElement(elements,{})
        }
    }
};
</script>
<style scoped>
.order-lists {
    width: 750px;
    background-color:#E8E8ED;
    padding-bottom:30px;
}
.order-lists-panel{
    padding-top:30px;
    padding-bottom:15px;
    margin-top:20px;
    background-color:#fff;
    border-bottom-style: solid;
    border-bottom-color: #f9f5f5;
    border-bottom-width: 1px;
}
.order-lists-row{
    flex-direction: row;
}
.order-lists-top-text{
    font-size: 26px;
    height: 40px;
    line-height: 40px;
}
.order-lists-colorg{
     color: #81838e;
}
.order-lists-top{
    flex: 1;
    justify-content: space-between;
    align-items: center;
    padding-left:30px;
    padding-right:30px;
    padding-bottom:15px;
    margin-bottom:15px;
    border-bottom-style: solid;
    border-bottom-color: #f9f5f5;
    border-bottom-width: 1px;
}
.order-del{
    width:25px;
    height:25px;
}
.order-lists-goods{
    background-color:#F7F8F8;
    padding-top:15px;
    padding-bottom:15px;
    padding-left:30px;
    padding-right:30px;
}
.order-lists-imgBox{
    padding-top:5px;
    padding-bottom:5px;
    padding-left:5px;
    padding-right:5px;
    margin-right: 15px;
    border-style: solid;
    border-color: #f9f5f5;
    border-width: 1px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.order-lists-gnbox{
    flex: 1;
    flex-direction: row
}
.order-lists-imgGoods{
    width:128px;
    height:128px;
}
.order-lists-nameBox{
    flex:1;
    padding-left:15px;
}
.order-lists-nameGoods{
    lines: 3;
    font-size:32px;
    text-overflow: ellipsis;
    color: #666666;
}
.order-lists-number{
    padding-left:30px;
    padding-right:30px;
    padding-bottom:30px;
    padding-top:30px;
    border-bottom-style: solid;
    border-bottom-color: #f9f5f5;
    border-bottom-width: 1px;
    justify-content: flex-end;
}
.order-lists-number-text{
    font-size:32px;
    height: 40px;
    line-height: 40px;
}
.order-lists-lr{
    padding-left:20px;
    padding-right:20px;
}
.order-lists-number-price{
    font-size:40px;
    height: 40px;
    line-height: 40px;
}
.order-lists-footer{
    padding-top:15px;
    padding-left:30px;
    padding-right:30px;
    justify-content: flex-end;
    align-items: flex-end;
    flex-direction:row;
}
.order-lists-fbtn{
    font-size:32px;
    padding-top:8px;
    padding-bottom:8px;
    padding-left:16px;
    padding-right:16px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-style:solid;
    border-width:1px;
    margin-right: 5px;
}
.order-lists-buy{
    border-color:#D60008;
    color:#D60008;
}
.order-lists-eval{
    border-color:#666666;
    color:#666666;
}

.order-lists-null{
    font-size:32px;
    color: #81838e;
    text-align: center;
    margin-top:20px;
    margin-bottom:20px;
}
</style>