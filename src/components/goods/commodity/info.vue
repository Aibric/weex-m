<template>
        <div class="goods-info">
            <div class="goods-info-space">
                <div class="goods-info-row goods-info-np">
                    <div class="goods-info-row goods-info-spaceBetween">
                        <div class="goods-info-row goods-info-algincenter">
                             <text class="goods-info-doller">￥</text>
                            <text class="goods-info-price"
                                  v-if="[goodsInfo.goods_price].toString().indexOf('.') !== -1">{{[goodsInfo.goods_price].toString().split('.')[0]}}</text>
                            <text class="goods-info-doller"
                                  v-if="[goodsInfo.goods_price].toString().indexOf('.') !== -1">.{{[goodsInfo.goods_price].toString().split('.')[1]}}</text>
                            <text class="goods-info-price"
                                 v-if="[goodsInfo.goods_price].toString().indexOf('.') === -1">{{goodsInfo.goods_price}}</text>
                        </div>
                    </div>
                    <div class="goods-info-goods-care"
                         v-if="goodsInfo.is_collection === 0"
                         @click="collection(goodsInfo.goods_id,1)">
                        <image style="width:48px;height:48px;" :src="imgPath('/goods/care.png')"/>
                        <text class="goods-info-goods-care-text">关注</text>
                    </div>
                    <div class="goods-info-goods-care"
                         v-if="goodsInfo.is_collection === 1"
                         @click="collection(goodsInfo.goods_id,0)">
                        <image style="width:48px;height:48px;" :src="imgPath('/goods/love.png')"/>
                        <text class="goods-info-goods-care-text">已关注</text>
                    </div>
                </div>
                <div class="goods-info-goods-name">
                    <text class="goods-info-text-black goods-info-goods-name-text">{{goodsInfo.goods_name}}</text>
                </div>
                <text class="goods-info-brand">{{goodsInfo.brand_name}}</text>
            </div>
            

            <div class="goods-info-space goods-info-select" @click="openChoice">
                <div class="goods-info-label"><text class="goods-info-text-s goods-info-space-pdr">已选</text></div>
                <text class="goods-info-text-s goods-infospace-pdr goods-info-text-red">{{goodsTotal}}{{goodsInfo.goods_unit}}</text>
            </div>

            <div class="goods-info-space goods-info-space-pd goods-info-space-mt">
                <div class="goods-info-row" @click="openAddress" style="flex: 1;">
                    <div class="goods-info-label"><text  class="goods-info-text-s goods-info-space-pdr">送至</text></div>
                    <div>
                        <div class="goods-info-row goods-info-space-mb goods-info-algincenter">
                            <text class="goods-info-space-pdrname" lines="1">{{addressStatus.activeAdressInfo}}</text>
                            <image :src="imgPath('/goods/pos.png')" style="width:32px;height:32px;"/>
                        </div>
                        <text class="goods-info-text-s goods-info-text-red">由新明辉发货，并提供售后服务</text>
                    </div>
                </div>
                
                <div class="goods-info-row goods-info-algincenter">
                    <div class="goods-info-label"><text class="goods-info-text-s goods-info-space-pdr">重量</text></div>
                    <div><text class="goods-info-text-s" style="padding-top: 4px;">{{goodsInfo.weight}}kg</text></div>
                </div>
            </div>
            <wxc-loading :show="isShow"
                          type="default"></wxc-loading>
        </div>
</template>
<script>
import Vue from "vue";

import { Utils, WxcIcon, wxcMinibar, WxcPopup,WxcLoading,} from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";
import addressPages from "~/components/goods/commodity/address";

import store from "~/store";

const dom = weex.requireModule("dom");
const modal = weex.requireModule('modal');

export default {
  props:['goodsInfo','goodsTotal','addressStatus','addressList'],
  components: { Utils, WxcIcon, wxcMinibar, addressPages,WxcPopup,WxcLoading,},
  mixins: [mixin],
  data: () => ({
        loadinging: false,
        user:null,
        isShow:false,
    }),
  async created() {
        this.user = (await store.mapGetters(['user'])).user
  },
  methods: {
    openAddress(){
        if(this.user){
            this.$emit("activeAddress");
        }else{
            this.jump("/login")
        }
    },
    openChoice(){//打开商品属性选择
        if(this.user){
            this.$emit("choiceSelect",true);
         }else{
            this.jump("/login")
        }
    },
    async collection(id,val) {
        let self = this;
        self.isShow = true;
        let {data:{payload:{code,info}}} = await self.stream("app.!good.collection",{
            query:{id}
        });
        if(code === 200){
            self.isShow = false;
           self.$emit("collection",val);
            modal.toast({
                message: info,
                duration: 0.8
            })
        }
    },
  }
};
</script>
<style  scoped>
.goods-info {
  width: 750px;
  border-top-style: solid;
  border-top-color: #e5e5e5;
  border-top-width: 1px;
}
.goods-info-row {
  flex-direction: row;
}
.goods-info-spaceBetween {
  justify-content: space-between;
}

.goods-info-space{
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 25px;
    padding-bottom: 25px;
    margin-top: 30px;
    background-color: #fff;
}
.goods-info-np{
    flex: 1;
    justify-content: space-between;
    align-items: center;
}
.goods-info-brand{
    background-color: #fff;
    flex: 1;
    color: #81838e;
    font-size: 26px;
}
.goods-info-select{
    margin-top: 30px;
    background-color: #fff;
    flex: 1;
    flex-direction: row;
}
.goods-info-algincenter {
  align-items: center;
}
.goods-info-text-black {
  color: #232326;
}
.goods-info-text-grey {
  color: #81838e;
}
.goods-info-text-red {
  color: #e9321f;
}
.goods-info-text-b {
  font-size: 36px;
}
.goods-info-text-m {
  font-size: 28px;
}
.goods-info-text-s {
  font-size: 26px;
}
.goods-info-space-pdr {
  margin-right: 15px;
}
.goods-info-space-pdrname{
    flex:1;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 15px;
}
.goods-info-space-mb {
  margin-bottom: 9px;
}
.goods-info-space-mt {
  margin-top: 30px;
}
.goods-info-doller{
    color: #d60008;
    font-size: 26px;
    height:40px;
    line-height:40px;
}
.goods-info-price{
    color: #d60008;
    font-weight: 700;
    height:40px;
    line-height:40px;
    font-size: 36px;
}
.goods-info-goods-name {
  flex:1;
  padding-top:15px;
  padding-bottom:15px;
  justify-content: center;
}
.goods-info-goods-name-text {
  color: #232326;
  line-height: 40px;
  font-size: 32px;
}
.goods-info-goods-care {
  width: 96px;
  align-items: center;
}
.goods-info-goods-care-text {
  font-size: 24px;
}
.goods-info-price-number {
  font-weight: 700;
}
.goods-info-price-down {
  border-left-style: solid;
  border-left-width: 1px;
  border-left-color: #e5e5e5;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #e5e5e5;
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #e5e5e5;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
}
.goods-load{
    align-items: center;
    margin-top: 150px;
    padding-bottom: 50px;
}
</style>