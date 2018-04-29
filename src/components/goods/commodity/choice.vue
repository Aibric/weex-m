<template>
        <wxc-popup popup-color="rgb(255, 255, 255)"
                   :show="choiceStatus.choiceShow"
                   @wxcPopupOverlayClicked="popupOverlayChoiceClick"
                   pos="bottom"
                   width="750"
                   height="800">
            <div class="goods-choice">
                
                <scroller style="height:570px;margin-bottom:20px;;">
                    <list>
                        <cell><text class="goodes-choice-total goods-choice-total-s">请选择商品：</text></cell>
                        <cell class="goodes-choice-row goodes-choice-outer goods-choice-pd-tb goods-choice-border-b">
                            <text class="goods-choice-size">价格</text>
                            <text class="goods-choice-number">数量</text>
                            <div class="goods-choice-attr"
                                 v-for="(item,index) in goodsSku" 
                                 :key="item.goods_id"
                                 v-if=" index === 0 && item.spec.length > 0">
                                <text class="goods-choice-size" v-for="(spes,index) in item.spec" :key="index">{{spes.k}}</text>
                            </div>
                           
                        </cell>
                        <cell v-for="(item,index) in goodsSku" :key="item.goods_id">
                            <div class="goodes-choice-row goodes-choice-outer goods-choice-pd-tb goods-choice-border-b">
                                <text class="goods-choice-size">￥{{item.price}}</text>
                               
                                <div class="goods-choice-number goodes-choice-row">
                                        <text class="goods-choice-op" @click="minus(index)">-</text>
                                        <input  @input="getNumber(index,$event)" 
                                               :value="numbers[index]" 
                                               type="number" 
                                               min="0" 
                                               class="goods-choice-input"/>
                                        <text class="goods-choice-op" @click="add(index)">+</text>
                                </div>
                                <text class="goods-choice-size" 
                                      v-for="(spes,index) in item.spec" 
                                      :key="index">{{spes.v}}</text>
                                
                            </div>
                        </cell>
                    </list>   
                </scroller>
                <div class="goodes-choice-total goodes-choice-row" v-if="total.number > 0">
                    <text class="goods-choice-total-s">已选清单：</text>
                    <text class="goods-choice-total-s">数量：</text>
                    <text class="goods-choice-total-r">{{total.number}}</text>
                    <text class="goods-choice-total-s">总价：￥</text>
                    <text class="goods-choice-total-r">{{total.money}}</text>
                </div>
                <div class="goods-choice-btns">
                    <text class="goods-choice-btn goods-choice-btn-cart"
                          @click="getPushData('purchaseFoot')">立即购买</text>
                    <text class="goods-choice-btn"
                          @click="getPushData('addCarts')">加入购物车</text>
                </div>
            </div>
         
        </wxc-popup>
</template>
<script>
import Vue from "vue";

import { Utils, WxcIcon, WxcPopup, WxcStepper } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";
import detailVue from '../../../pages/category/detail.vue';

const dom = weex.requireModule("dom");
const modal = weex.requireModule("modal");


export default {
  components: { Utils, WxcIcon, WxcPopup, WxcStepper },
  mixins: [mixin],
  props: ['choiceStatus','goodsSku','goodsSelect'],
  data: () => ({
    height: 400,
    total: {
      money: 0,
      number: 0
    },
    numbers:[],
    prices:[],
    selectData:{
        total:0,
        cartsData:[],
    }
  }),
  created() {
    let self = this;
    const tabPageHeight = Utils.env.getPageHeight();
    this.maxHeight = { height: tabPageHeight + "px" };
    self.goodsSku.map(function(item,index) {
        self.numbers.push(0);
        if(item.price.indexOf(",") === -1){
            self.prices.push(item.price);
        }else{
            self.prices.push(self.comma(item.price));
        }
       
    })
    let totalNumber = 0;
    let totalMoney = 0;
    if(self.goodsSelect){
        self.goodsSku.map(function(item,index){
            self.goodsSelect.map(function(goods){
                if(goods.goods_id === item.goods_id){
                    self.$set(self.numbers,index,goods.number);
                    totalNumber = totalNumber + goods.number;
                    totalMoney = totalMoney + goods.number * item.price;
                }
            })
        }) 
    }
    this.$set(this.total,'number',totalNumber);
    this.$set(this.total,'money',totalMoney);
  },
  methods: {
    comma(val){
        let pricesArray = val.split(',');
        let prices = '';
        pricesArray.map(function(item){
            prices = prices + item;
        })
        return prices
    },
    getNumber(index,event) {
        if(event.value){
            this.$set(this.numbers,index,parseInt(event.value))
        }else{
            this.$set(this.numbers,index,0)
        }
        this.getTotal()
    },
    add(index){
        this.$set(this.numbers,index,parseInt(this.numbers[index]+1));
        this.getTotal();
    },
    minus(index){
        if(this.numbers[index] < 1){
            this.$set(this.numbers,index,0)
        }else{
            this.$set(this.numbers,index,parseInt(this.numbers[index]-1))
        }
        this.getTotal();
    },
    getTotal(){
        let self = this;
        let num = 0;
        self.numbers.map(function(i){
            num = num + i
            return num
        })
        let money = 0;
        self.prices.map(function(i,index){
            money = (money + i*100 * self.numbers[index]);
        })
        money = money.toString().substr(0, (money.toString().length -2))  +"."+ money.toString().substr(-2, 2);
        self.$set(self.total,'number',num);
        self.$set(self.total,'money',money);

        self.numbers.map(function(item,ix){
            let goods = {
                goods_id:null,
                goods_sn:null,
                number:0,
            }
            goods.goods_id =  self.goodsSku[ix].goods_id;
            goods.goods_sn =  self.goodsSku[ix].goods_sn
            goods.number =  item;
            self.$set(self.selectData.cartsData,ix,goods)
        })
        self.selectData.cartsData = self.selectData.cartsData.filter(function(i){ return i.number })
        self.selectData.total =  num
        self.$emit('changeTotal',self.selectData)
    },
    popupOverlayChoiceClick() {
      this.$set(this.choiceStatus, "choiceShow", false);
      this.$emit("choiceActive", this.choiceStatus);
    },
    getPushData(val){
        let self = this;
        if(self.total.number > 0){
            let total = 0;
            self.numbers.map(function(item,ix){
                let goods = {
                    goods_id:null,
                    goods_sn:null,
                    number:0,
                }
                total = total + item;
                goods.goods_id =  self.goodsSku[ix].goods_id;
                goods.goods_sn =  self.goodsSku[ix].goods_sn
                goods.number =  item;
                self.$set(self.selectData.cartsData,ix,goods)
            })
            self.selectData.cartsData = self.selectData.cartsData.filter(function(i){ return i.number })
            self.selectData.total =  total;
            self.$emit(val,self.selectData)
        }else{
            modal.toast({
                message: '您还未选中任何商品',
                duration: 0.8
            })
        }
        
    },
  }
};
</script>
<style  scoped>
.goods-choice {
  width: 750px;
  height:800px;
  position: relative;
  position: relative;
}
.goodes-choice-row {
  flex-direction: row;
  align-items: center;
}
.goods-choice-pd-tb {
  padding-top: 10px;
  padding-bottom: 10px;
}
.goods-choice-border-b {
  border-bottom-style: solid;
  border-bottom-color: #e5e5e5;
  border-bottom-width: 1px;
}
.goodes-choice-outer {
  width: 750px;
  padding-left:50px;
  padding-right:50px;
}
.goods-choice-attr{
    flex: 1;
    flex-direction: row;
}
.goods-choice-size {
  flex: 1;
  font-size: 28px;
  text-align: center;
}
.goods-choice-number {
  flex: 2;
  font-size: 28px;
  justify-content: center;
  text-align: center;
}
.goods-choice-op {
  width: 55px;
  height: 55px;
  font-size: 40px;
  color: rgb(102, 102, 102);
  line-height: 55px;
  text-align: center;
  background-color: rgb(237, 237, 237);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.goods-choice-input {
  width: 120px;
  margin-left: 10px;
  margin-right: 10px;

  text-align: center;
}
.goodes-choice-total{
    background-color: #f3f5f7;
    padding-top:15px;
    padding-bottom:15px;
    padding-left:15px;
}
.goods-choice-total-s{
    font-size: 28px;
    color:#666666;
}
.goods-choice-total-r{
    color:#f23030;
    font-size:35px;
    padding-top:4px;
    margin-right: 15px;
}
.goods-choice-btns {
  width: 750px;
  flex-direction: row;
  position: absolute;
  bottom:0;
  left:0;
}
.goods-choice-btn {
  flex: 1;
  color: #ffffff;
  font-size: 32px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: #f23030;
}
.goods-choice-btn-cart {
  background-color: #ffb03f;
}

</style>