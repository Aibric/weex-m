<template>
    <div class="member-lists">
        <div class="member-lists-outer">
            <div class="member-lists-top member-lists-borderb" 
                 @click="pageJump('/order/index')">
                <div class="member-lists-title">
                    <image class="member-lists-img" :src="imgPath('/member/lists/mc_01.png')" />
                    <text class="member-lists-textb">我的订单</text>
                </div>
                <div class="member-lists-title">
                    <text class="member-lists-texts">查看全部订单</text>
                    <wxc-icon name="more" class="member-lists-more"></wxc-icon>
                </div>
            </div>
            <div class="member-lists-foot">
                <div v-for="(item,index) in orders" :key="index" class="member-lists-cell" @click="pageJump(item.url)">
                    <image class="member-list-icon" :src="imgPath(item.src)" />
                    <text></text>
                    <text class="member-lists-texts">{{item.text}}</text>
                </div>
            </div>
        </div>
        <div class="member-lists-outer">
            <div class="member-lists-top member-lists-borderb">
                <div class="member-lists-title">
                    <image class="member-lists-img" :src="imgPath('/member/lists/mc_02.png')" />
                    <text class="member-lists-textb">我的财产</text>
                </div>
            </div>
            <div class="member-lists-foot">
                <div v-for="(item,index) in property" :key="index" class="member-lists-cell">
                    <text v-if="index === 0 && propertyNum" class="member-list-num">{{propertyNum.financial}}</text>
                    <text v-if="index === 1 && propertyNum" class="member-list-num">{{propertyNum.coupons}}</text>
                    <text v-if="index === 2 && propertyNum" class="member-list-num">{{propertyNum.actives}}</text>
                    <text v-if="index === 3 && propertyNum" class="member-list-num">{{propertyNum.points}}</text>
                    <image v-if="!propertyNum" class="member-list-icon" :src="imgPath(item.src)" />
                    <text class="member-lists-texts">{{item.text}}</text>
                </div>
            </div>
        </div>
         <div class="member-lists-outer"  @click="pageJump('/member/address')">
            <div class="member-lists-top">
                <div class="member-lists-title">
                    <image class="member-lists-img" :src="imgPath('/member/lists/mc_03.png')" />
                    <text class="member-lists-textb">收货地址</text>
                </div>
                <div class="member-lists-title">
                    <wxc-icon name="more" class="member-lists-more"></wxc-icon>
                </div>
            </div>
        </div>
        <div class="member-lists-outer" @click="pageJump('/member/personal')">
            <div class="member-lists-top">
                <div class="member-lists-title">
                    <image class="member-lists-img" :src="imgPath('/member/lists/mc_04.png')" />
                    <text class="member-lists-textb">个人信息</text>
                </div>
                <div class="member-lists-title">
                    <wxc-icon name="more" class="member-lists-more"></wxc-icon>
                </div>
            </div>
        </div>
        <div class="member-lists-outer">
            <div class="member-lists-top">
                <div class="member-lists-title">
                    <image class="member-lists-img" :src="imgPath('/member/lists/mc_05.png')" />
                    <text class="member-lists-textb">发票管理</text>
                </div>
                <div class="member-lists-title">
                    <wxc-icon name="more" class="member-lists-more"></wxc-icon>
                </div>
            </div>
        </div>
         <div class="member-lists-outer" 
              v-if="user"
              @click="exit">
            <div class="member-lists-top">
                <div class="member-lists-title">
                    <image class="member-lists-img" :src="imgPath('/member/lists/exit.png')" />
                    <text class="member-lists-textb">用户退出</text>
                </div>
                <div class="member-lists-title">
                    <wxc-icon name="more" class="member-lists-more"></wxc-icon>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils, WxcIcon } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import store from "~/store";

const dom = weex.requireModule("dom");

export default {
    props: ['user'],
    components: {
        Utils,
        WxcIcon
    },
    mixins: [mixin],
    data: () => ({
        orders: [
            {
                text: "待付款",
                src: "member/lists/mcc_01.png",
                url: "/"
            },
            {
                text: "待收货",
                src: "member/lists/mcc_02.png",
                url: "/"
            },
            {
                text: "待评价",
                src: "member/lists/mcc_04.png",
                url: "/"
            },
            {
                text: "退款/退货",
                src: "member/lists/mcc_05.png",
                url: "/"
            }
        ],
        property: [
            {
                text: "应付金额",
                src: "/member/lists/mcc_06.png",
                url: "/"
            },
            {
                text: "优惠券",
                src: "/member/lists/mcc_08.png",
                url: "/"
            },
            {
                text: "我的活跃值",
                src: "/member/lists/mcc_09.png",
                url: "/"
            },
            {
                text: "积分",
                src: "/member/lists/mcc_10.png",
                url: "/"
            }
        ],
        propertyNum:{}

    }),
    async created() {
        if(this.user){
            let {data: {payload:{code,info}}} = await this.stream("app.!money.account",{});
            if(code === 200){
                this.propertyNum = info;
            }
        }
    },
    mounted() {},
    methods: {
        pageJump(url){
            if(this.user){
                this.jump(url)
            }else{
                this.jump('/login')
            }
        },
        exit(){
            store.dispatch('logout')
            this.$emit('update:user', null)
        }
    }
};
</script>
<style scoped>
.member-lists {
    width: 750px;
}
.member-lists-outer {
    margin-top: 30px;
    width: 750px;
    padding-bottom: 20px;
    background-color: #fff;
}
.member-lists-top {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 30px;
    padding-right: 30px;
}
.member-lists-title {
    align-items: center;
    flex-direction: row;
}
.member-lists-img{
    margin-top: 20px;
    width:35px;
    height:35px;
}
.member-lists-textb {
    padding-top: 20px;
    color: #111;
    font-size: 28px;
    margin-left: 15px;
}
.member-lists-texts {
    color: #888;
    padding-top: 20px;
    font-size: 24px;
}
.member-lists-more {
    color: #888;
    padding-top: 20px;
    font-size: 16px;
    margin-left: 15px;
}
p.member-lists-more {
    color: #888;
    padding-top: 20px;
    font-size: 16px;
    margin-left: 15px;
}
.member-lists-borderb {
    padding-bottom:15px;
    border-bottom-style: solid;
    border-bottom-color: #eee;
    border-bottom-width: 1px;
}
.member-lists-foot{
    width:750px;
    flex-direction: row;
}
.member-lists-cell{
    flex:1;
    justify-content: flex-start;
    align-items: center;
}
.member-list-icon {
    width: 44px;
    height: 44px;
    opacity: 0.5;
    margin-top: 35px;
}
figure.member-list-icon {
    width: 44px;
    height: 44px;
}
.member-list-num{
    width: 44px;
    height: 44px;
    line-height: 44px;
    font-size:36px;
    margin-top: 35px;
    color:#d60008;
    font-weight: 500;
}
p.member-list-num{
    width: 44px;
    height: 44px;
    line-height: 44px;
    font-size:36px;
    margin-top: 35px;
    color:#d60008;
    font-weight: 500;
}
</style>