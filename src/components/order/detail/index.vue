<template>
    <scroller class="order-details"
              :style="{height:maxHeight+'px'}">
        <status-pages :status="status"></status-pages>
        <track-pages :orderInfo="{id:info.order_id,sn:info.order_sn,name:info.shipping_name}"></track-pages>
        <receiver-pages :info="info"></receiver-pages>
        <goods-pages :goods="goods"
                     v-on:buyAgain="buyAgain"></goods-pages>
        <info-pages :info="info"></info-pages>
        <total-pages :info="info"></total-pages>
        <foot-pages :info="info"
                     v-on:buyAgain="buyAgain"
                    :operation="buttons"></foot-pages>
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

import statusPages from "./status";
import trackPages from "./track"
import receiverPages from "./receiver";
import goodsPages from "./goods";
import infoPages from "./info";
import totalPages from "./total";
import footPages from "./foot";

const dom = weex.requireModule("dom");
const modal = weex.requireModule("modal");

export default {
    components: {
        Utils,
        statusPages,
        trackPages,
        receiverPages,
        goodsPages,
        infoPages,
        totalPages,
        footPages,
        WxcLoading
    },
    props:['maxHeight'],
    mixins: [mixin],
    data: () => ({
        status:'',
        goods:[],
        info:{},
        buttons:[],
        isShow:false,
    }),
    created() {
         this.getOrderInfo(this.queryParames().id||0)
    },
    mounted() {},
    methods: {
        async buyAgain(detail, status = false){
            let self = this;
            self.isShow = true;
            let items = [];
            detail.map((item,index) => {
                let ix = {};
                ix.gid = item.goods_id;
                ix.num = item.goods_num;
                self.$set(items, index,ix)
            })
            let {payload: {message, code, info}} = await storeCart.dispatch('create', items)
            if(code === 200){
                self.isShow = false;
                modal.toast({
                    message: info,
                    duration: 0.8
                });
                status && this.jump('/', { pages: 2 })
            }
        },
        async getOrderInfo(id){
            let self = this;
            self.isShow = true;
            let query = {
                expand: 'detail.goods.spec.attr',
                id: id
            }
            let {data: {payload: {code, list}}} = await self.stream("app.!order.view", { 
                query: {
                    expand: 'detail.goods.spec.attr',
                    id: id
                }
            })
            if(code === 200){
                self.isShow = false;
                self.status = list[0].order_status;
                self.goods = list[0];
                self.info = list[0];
                self.buttons = list[0].buttons;
            }
        }
    }
};
</script>
<style scoped>
.order-details {
    width: 750px;
    background-color: #e8e8ed;
    padding-bottom:122px;
}

</style>