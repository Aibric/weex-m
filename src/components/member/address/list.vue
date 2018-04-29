<template>
    <scroller class="address-lists" :style="{height:scollerHeight+'px'}">
        <div v-for="item in addressList" :key="item.address_id" class="add-lists-panel">
            <div class="add-lp-top">
                <text class="address-lpt-name">{{item.consignee}}</text>
                <text class="address-lpt-phone">{{item.mobile}}</text>
            </div>
            <div class="add-lp-info">
                <text class="add-lp-infos">{{item.address}}</text>
            </div>
            <div class="add-lp-foot">
                <div class="add-lpf-def">
                    <div :class="['add-lpfd-circle',item.is_default === 1 ?  'add-lpfd-circle-active' : '']" 
                         @click="AddressDefault(item.address_id)">
                        <image :src="imgPath('/member/address/select.png')" 
                        class="add-lpfd-select" />
                    </div>
                    <text class="add-lpf-text">默认地址</text>
                </div>
                <div class="add-lpf-ope">
                    <div class="add-lpf-opeo" 
                         @click="jump('/member/addedit',{id:item.address_id,title:'编辑收货地址',path:'/member/address'})">
                        <image :src="imgPath('/common/edit.png')" class="add-lpf-btn" />
                        <text class="add-lpf-text">编辑</text>
                    </div>
                    <div class="add-lpf-opeo" 
                         v-id="item.is_default === 0"
                         @click="AddressDel(item.address_id)">
                        <image :src="imgPath('/common/del.png')" class="add-lpf-btn" />
                        <text class="add-lpf-text">删除</text>
                    </div>
                </div>
            </div>
        </div>
    </scroller>
</template>

<script>
import Vue from "vue";
import { Utils, WxcIcon } from "weex-ui";

import mixin from "@/mixins";

const modal = weex.requireModule("modal");

export default {
    mixins: [mixin],
    props: ["scollerHeight"],
    data: () => ({
        activeIndex: 1,
        addressList:[],
    }),
    created() {
        this.getAdress();
    },
    methods: {
      async  AddressDel(id) {
            let self = this;
            let {data: {payload},status,ok} = await self.stream("app.!address.delete", {query: {id}})
            if(payload.code === 200){
                this.getAdress();
            }
        },
        async AddressDefault(id) {
            let self = this;
            let {data: {payload},status,ok} = await self.stream("app.!address.update", {query: {id}, body: {
                is_default: 1
            }})
            if(payload.code === 200){
                this.getAdress();
            }
        },
        async  getAdress(){
            let self = this;
            let query = {
                'expand':'province,city,district',
                'fields':'address_id,address,mobile,consignee,is_default'
            }
            let {data: {payload},status,ok} = await self.stream("app.!address.list", {query})
            if (payload.code === 200 && payload.list) {
                 self.addressList = payload.list;
            }
        }
    }
};
</script>
<style>
.address-lists {
    width: 750px;
    background-color: #f0f2f5;
}
.add-lists-panel {
    padding-left: 30px;
    padding-top: 30px;
    padding-bottom: 20px;
    border-bottom-style: solid;
    border-bottom-color: #e7e7e7;
    border-bottom-width: 1px;
    margin-bottom: 30px;
    background-color: #ffffff;
}
.add-lp-top {
    flex-direction: row;
    padding-right: 60px;
}
.address-lpt-name {
    flex: 2;
    font-size: 34px;
    height: 34px;
    line-height: 34px;
    font-weight: 500;
    color: #26262a;
}
.address-lpt-phone {
    flex: 3;
    font-size: 34px;
    height: 34px;
    line-height: 34px;
    font-weight: 500;
    color: #26262a;
}
.add-lp-info {
    padding-right: 60px;
    padding-top: 30px;
    padding-bottom: 30px;
    border-bottom-style: solid;
    border-bottom-color: #e7e7e7;
    border-bottom-width: 1px;
}
.add-lp-infos {
    font-size: 30px;
    color: #858586;
}
.add-lp-foot {
    width: 720px;
    padding-top: 20px;
    padding-right: 20px;
    flex-direction: row;
}
.add-lpf-def {
    flex: 2;
    flex-direction: row;
    align-items: center;
}
.add-lpfd-circle {
    width: 50px;
    height: 50px;
    border-style: solid;
    border-color: #858586;
    border-width: 1px;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
}
.add-lpfd-circle-active {
    border-color: #d60008;
    background-color: #d60008;
}
.add-lpfd-select {
    margin-top: -2px;
    width: 50px;
    height: 50px;
}
figure.add-lpfd-select {
    margin-top: -2px;
    width: 50px;
    height: 50px;
}

.add-lpf-ope {
    flex: 2;
    flex-direction: row;
    justify-content: flex-end;
}
.add-lpf-text {
    font-size: 32px;
    color: #858586;
    margin-left: 20px;
}
p.add-lpf-text {
    font-size: 32px;
    color: #858586;
    margin-left: 20px;
}
.add-lpf-opeo {
    flex-direction: row;
    align-items: center;
}
.add-lpf-btn {
    width: 50px;
    height: 50px;
    margin-left: 30px;
}
figure.add-lpf-btn {
    width: 50px;
    height: 50px;
    margin-left: 30px;
}
</style>