<template>
          <div class="goods-goods-addressOut"
                :style="{height:outHeight+'px'}">
                <div class="goods-address-pd-left goods-address-top goods-address-flex-row-bet goods-address-pd-tb">
                  <wxc-icon name="back"></wxc-icon>
                  <text class="goods-address-text-b">配送至</text>
                </div>
                <scroller class="goods-goods-address"
                        :style="{height:maxHeight+'px'}">
                    <text class="goods-address-pd-left goods-address-pd-tb goods-address-text-s goods-address-text-bg">常用地址</text>
                    <list>
                        <cell v-for="item in addressList" 
                              :key="item.address_id"
                              class="goods-address-pd-tb goods-address-border-t goods-address-pd-left">
                            <div class="goods-address-flex-row-bet" @click="activeAress(item)">
                                <div class="goods-address-left-w">
                                    <text lines="1" class="goods-address-text-m goods-address-left-text">{{item.province.region_name}}{{item.city.region_name}}{{item.district.region_name}}{{item.address}}</text>
                                </div>
                                <text v-if=" addressStatus.activeAdressKey === item.address_id" 
                                      class="goods-address-right-w goods-address-text-s goods-address-text-red">&radic;</text>
                            </div>
                        </cell>
                    </list>
                </scroller>
                <text class="goods-goods-addressQ">选择其他地址</text>
          </div>
</template>
<script>
import Vue from "vue";

import { Utils, WxcIcon, WxcPopup } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

const dom = weex.requireModule("dom");

export default {
  components: { Utils, WxcIcon, WxcPopup },
  mixins: [mixin],
  props:['addressList','addressStatus'],
  data: () => ({
      outHeight:Utils.env.getPageHeight()-200,
      maxHeight:Utils.env.getPageHeight()-282,
  }),
  created() {
       const tabPageHeight = Utils.env.getPageHeight();
       this.maxHeight = {'height':tabPageHeight+'px'};
  },
  methods: {
      popupOverlayAddressClick () {
         this.$emit('addressSelect',this.addressStatus)
      },
      activeAress(item){
          this.$set(this.addressStatus,'activeAdressKey',item.address_id)
          this.$set(this.addressStatus,'activeAdressInfo',item.province.region_name+item.city.region_name+item.district.region_name+item.address)
          this.popupOverlayAddressClick();
      },
     
  }
};
</script>
<style  scoped>
.goods-address {
  width: 650px;
  background-color: #ffffff;
  border-top-style: solid;
  border-top-color: #e5e5e5;
  border-top-width: 1px;
  border-right-style: solid;
  border-right-color: #e5e5e5;
  border-right-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #e5e5e5;
  border-bottom-width: 1px;
}
.goods-address-border-t{
  border-top-style: solid;
  border-top-color: #e5e5e5;
  border-top-width: 1px;
}
.goods-address-text-b{
    font-size:32px;
}
.goods-address-text-m{
    font-size: 28px;
}
.goods-address-text-s{
    font-size: 24px;
}
.goods-address-text-bg{
    background-color: #f3f5f7;
}
.goods-address-text-red{
     color:#f23030;
}
.goods-address-pd-left{
    padding-left: 30px;
}
.goods-address-pd-tb{
    padding-top:15px;
    padding-bottom:15px;
}
.goods-address-flex-row-bet{
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.goods-address-top{
    width:500px;
    height:82px;
    padding-right: 100px;
}
.goods-address-left-w{
    flex:1;
}
.goods-address-left-text{
  lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666666;
}
.goods-address-right-w{
    width:40px;
    align-items: flex-start;
}
.goods-goods-address{
    padding-bottom:82px;
}
.goods-goods-addressOut{
    position: relative;
}
.goods-goods-addressQ{
    width:750px;
    height:82px;
    line-height: 82px;
    text-align: center;
    background-color: #d60008;
    color:#fff;
    font-size: 32px;
    position: absolute;
    bottom:0px;
    left:0px;
}
p.goods-goods-addressQ{
    width:750px;
    height:82px;
    line-height: 82px;
    text-align: center;
    background-color: #d60008;
    color:#fff;
    font-size: 32px;
    position: absolute;
    bottom:0px;
    left:0px;
}

</style>