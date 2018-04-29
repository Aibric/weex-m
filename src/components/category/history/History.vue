<template>
    <scroller class="category-history"
              :style="{height:maxHeight+'px'}">
        <!-- <text class="category-history-title">在新明辉商城下搜索</text> -->
        <div class="category-history">
            <div class="category-history-cell" 
                 v-for="item in resultLists"
                 :key="item.goods_id"
                  @click="jump('/goods',{id:item.goods_id,path:'/?pages='+1})">
                <div class="category-history-panel">
                    <text class="category-history-text">{{item.goods_name}}</text>
                </div>
            </div>
        </div>
        <!-- <text class="category-history-title">历史搜索</text>
        <div class="category-history">
            <div class="category-history-cell" v-for="i in 50" :key="i">
                <div class="category-history-panel">
                    <text class="category-history-text">商品名称吧{{i}}</text>
                    <div class="category-history-name">
                        <div class="category-history-o">
                            <text class="category-history-s">测数据</text>
                        </div>
                        <div class="category-history-o">
                            <text class="category-history-s">测试</text>
                        </div>
                        <div class="category-history-o">
                            <text class="category-history-s">测试数据</text>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- <div class="category-history-del">
            <div class="category-history-del-btn">
                <wxc-icon name="delete" style="fontSize:30px"></wxc-icon>
                <text class="category-history-del-text">清空搜索历史</text>
            </div>
        </div> -->
    </scroller>
</template>
<script>
import Vue from "vue";
import { WxcIcon, Utils } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";
import helper from "@/utils/helper";

const dom = weex.requireModule("dom");

export default {
    props:['resultLists'],
    components: { WxcIcon },
    mixins: [mixin],
    data: () => ({
        maxHeight:Utils.env.getPageHeight()-100,
    }),
    created() {},
    methods: {}
};
</script>
<style>
.category-history {
    width: 750px;
    margin-top: 10px;
    justify-content: flex-start;
    background-color: #fff;
    padding-top: 15px;
    padding-bottom: 75px;
}
p.category-history-title {
    font-size: 32px;
    padding-left: 10px;
    padding-bottom: 10px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #e5e5e5;
}
.category-history-title {
    font-size: 32px;
    padding-left: 10px;
    padding-bottom: 10px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #e5e5e5;
}
.category-history-cell {
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #e5e5e5;
}
.category-history-panel {
    padding-left: 10px;
    padding-right: 10px;
    flex-direction: row;
    justify-content: space-between;
}
.category-history-text {
    font-size: 28px;
}
.category-history-name {
    flex-direction: row;
    justify-content: space-between;
}
.category-history-o {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: #eff3f6;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    margin-right: 10px;
}
.category-history-s {
    font-size: 24px;
}
.category-history-del {
    align-items: center;
    justify-content: center;
    padding-top: 50px;
    padding-bottom: 85px;
}
.category-history-del-btn {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-width: 1px;
    border-style: solid;
    border-color: #666666;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 50px;
    padding-right: 50px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}
.category-history-del-text {
    margin-left: 15px;
    font-size: 32px;
    color: #666666;
}
</style>