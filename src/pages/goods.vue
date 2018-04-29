<template>
    <div class="goods">
        <top-pages  v-on:activeShortcut="activeShortcut" 
                    v-on:clickTop="activeTop" 
                    :activeTopIndex="activeTopIndex"></top-pages>
        <scroller class="goods-scoller"  
                  :style="maxHeight"  
                  v-if="activeTopIndex === 0">
            <slider-pages :sliderImg="sliderImg"></slider-pages>
            <info-pages :activeTopIndex="activeTopIndex" 
                        v-on:changeActive="activeTop"
                        v-on:choiceSelect="choiceSelect"
                        :goodsInfo="goodsInfo"
                        :goodsTotal="goodsTotal"
                        v-on:activeAddress="activeAddress"
                        v-on:collection="collection"
                        :addressStatus="addressStatus"
                        ></info-pages>
        </scroller>
        <scroller class="goods-scoller" 
                  :style="maxHeight"  
                  v-else-if="activeTopIndex === 1">
            <detail-top-pages :goodsAttr="goodsAttr"
                              :goodsDesc="goodsDesc"></detail-top-pages>
        </scroller>
        <footer-pages :goodsTotal="goodsTotal"
                      :goodsSelect="goodsSelect"
                      v-on:choiceSelect="choiceSelect"
                      v-on:putCarts="putCarts"
                      v-on:purchase="purchase"
                      :cartsCount="cartsCount"></footer-pages>
        <choice-pages   v-on:choiceActive="choiceActive"
                        v-on:addCarts="addCarts"
                        v-on:changeTotal="changeTotal"
                        v-on:purchaseFoot="purchaseFoot"
                        v-if="choiceStatus.choiceShow"
                        :choiceStatus="choiceStatus"
                        :goodsSku="goodsSku"
                        :goodsSelect="goodsSelect"
                       ></choice-pages>
        <shortcut-pages :shortcutShow="shortcutShow" 
                        v-on:activeShortcut="activeShortcut"
                        v-if="shortcutShow"></shortcut-pages>
        <wxc-popup  popup-color="rgb(255, 255,255)" 
                        :show="isBottomShow" 
                        @wxcPopupOverlayClicked="popupClick" 
                        pos="bottom" 
                        :height="oHeight">
                    <address-pages  v-on:addressSelect="addressSelect" 
                                    :addressStatus="addressStatus" 
                                    :addressList="addressList" ></address-pages>
        </wxc-popup>
         <wxc-loading :show="isShow"
                          type="default"></wxc-loading>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils,
         WxcPopup,
         WxcLoading } from "weex-ui";

import mixin from "~/mixins";

import topPages from "~/components/goods/top";
import footerPages from "~/components/goods/foot";
import sliderPages from "~/components/goods/commodity/slider";
import infoPages from "~/components/goods/commodity/info";
import detailTopPages from "~/components/goods/detail/top";
import addressPages from "~/components/goods/commodity/address";
import choicePages from "~/components/goods/commodity/choice";
import shortcutPages from "~/components/common/shortcut";
import CartStore from '~/store/module/cart'
import store from "~/store";

const dom = weex.requireModule("dom");
const modal = weex.requireModule("modal");

export default {
    components: { Utils, 
                topPages, 
                footerPages,
                sliderPages, 
                infoPages, 
                detailTopPages,
                addressPages,
                choicePages,
                shortcutPages,
                WxcPopup,
                WxcLoading },
    mixins: [mixin],
    computed: {
        cartStore () {
            return CartStore
        }
    },
    data: () => ({
        goodsId:'',
        activeTopIndex: 0,
        shortcutShow:false,//快速选择
        sliderImg:[],//商品轮播图
        goodsSku:[],//购买选择属性
        goodsInfo:{},
        goodsTotal:0,//选中的商品信息
        goodsSelect:null,
        choiceStatus:{
            choiceShow:false,
        },
        goodsAttr:[],
        goodsDesc:'',
        user:null,
        oHeight: Utils.env.getPageHeight()-200,
        isBottomShow:false,
        addressList:[],
        addressStatus:{
          activeAdressKey:-1,
          activeAdressInfo:'山东临沂兰山区',
        },
        cartsCount:0,//购物车商品数量
        isShow:false,//数据加载提示
    }),
    beforeCreate() {
    },
    async created() {
        const tabPageHeight = Utils.env.getPageHeight();
        this.maxHeight = { height: tabPageHeight -182 + "px" };
        this.goodsId = this.queryParames().id || 0;
        this.getGoodsList(this.goodsId);
        this.user = (await store.mapGetters(["user"])).user;
        if(this.user){
            this.getAdress();
            let { total:{count} } = await CartStore.mapGetters(['total']);
            this.cartsCount = count;
        }
    },
    mounted() {},
    methods: {
        addressSelect(val){
            this.popupClick();
            this.addressStatus = val;
        },
        activeAddress(){
            this.popupClick();
        },
        openAddress(){
            this.popupClick();
        },
        popupClick() {
            this.isBottomShow = !this.isBottomShow;
        },
        addressActive(val){
            this.addressStatus = val;
            this.popupClick();
        },
        changeTotal(val){
            this.goodsSelect = val.cartsData;
            this.goodsTotal = val.total;
        },
        activeTop(val) {
            this.activeTopIndex = val;
        },
        loadMore(event) {
            if (event.contentOffset.y < -150) {
              modal.toast({ message: "Loading", duration: 1 });
              this.loadinging = true;
              this.activeTopIndex = 1;
            }
        },
        collection(val){
            this.goodsInfo.is_collection = val
        },
        choiceActive(val){
            this.$set(this.choiceStatus,'choiceShow',val.Choice)
        },
        choiceSelect(val){//响应点击“加入购物车”
            this.$set(this.choiceStatus,'choiceShow',val)
        },
        activeShortcut(val){//响应快速选择工具点击事件
            this.shortcutShow = val
        },
        addCarts(val){//加入购物车
            this.goodsSelect = val.cartsData;
            this.goodsTotal = val.total;
            this.putCarts();
        },
      async putCarts(){
            let self = this;
            self.isShow = true;
            self.$set(self.choiceStatus,'choiceShow',false);
            let items = [];
            self.goodsSelect.map(function(ix,index){
                let item = {};
                item.gid = ix.goods_id;
                item.num = ix.number;
                self.$set(items,index,item)
            })
            let status =  await CartStore.dispatch('create',items)
            if(status.success){
                self.isShow = false;
                modal.toast({
                    message: '添加购物车成功~',
                    duration: 0.8
                })
                let { total:{count} } = await CartStore.mapGetters(['total']);
                self.cartsCount = count
            }
      },
      purchaseFoot(val){//立即购买
            this.goodsSelect = val.cartsData;
            this.goodsTotal = val.total;
            this.purchase();
      },
      async purchase(){
            let self = this;
            self.isShow = true;
            let items = [];
            self.$set(self.choiceStatus,'choiceShow',false);
            self.goodsSelect.map(function(ix,index){
                let item = {};
                item.gid = ix.goods_id;
                item.num = ix.number;
                self.$set(items,index,item)
            })
            let status =  await CartStore.dispatch('create',items,true)
            if(status.success){
                self.isShow = fasle;
                modal.toast({
                    message: '添加购物车成功~',
                    duration: 0.8
                })
                this.jump('/order-action')
            }
      },
      async getGoodsList(id) {
            let self = this;
            self.isShow = true;
            let {data:{payload:{code,info}}} = await self.stream("app.!good.view",{
                query:{id}
            });
            if(code === 200 && info){
                self.isShow = false;
                self.sliderImg = info.gallery;
                self.goodsInfo = info;
                self.goodsAttr = info.attr;
                self.goodsDesc = info.goods_desc;
                self.goodsSku = info.sku;
            }
      },
      async  getAdress(){
            let self = this;
            let query = {
                'expand':'province,city,district',
                'fields':'address_id,address,mobile,consignee,is_default'
            }
            let {data: {payload:{list,code}}} = await self.stream("app.!address.list", {query})
            if (code === 200 && list) {
                 self.addressList = list;
                 self.addressList.map(function(item){
                     if(item.is_default === 1){
                            self.$set(self.addressStatus,'activeAdressInfo',item.province.region_name+item.city.region_name+item.district.region_name+item.address);
                            self.$set(self.addressStatus,'activeAdressKey',item.address_id);
                     }
                 })
            }
       }
    }
};
</script>
<style>
.goods {
  width: 750px;
  background-color: #f0f2f5;
}

</style>