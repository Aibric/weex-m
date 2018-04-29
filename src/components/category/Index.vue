<template>
    <div class="category" :style="{height:maxHeight+'px'}">
        <top-page @activeShortcut="activeShortcut"></top-page>
        <div class="category_main" ref="categoryMain">
            <left-page :style="{height:contentHeight+'px'}" :leftNavs="navs" v-on:clickMenu="activeMenu"></left-page>
            <right-page :style="{height:contentHeight+'px'}" 
                :menus="menus"
                :menusParent="menusParent"></right-page>
        </div>
        <shortcut-pages :shortcutShow="shortcutShow"
            position="absolute"
            v-on:activeShortcut="activeShortcut" 
            v-if="shortcutShow"></shortcut-pages>
         <wxc-loading :show="isShow"
                          type="default"></wxc-loading>
    </div>
</template>
<script>
import Vue from "vue";
import { Utils,
         WxcLoading } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import shortcutPages from "~/components/common/shortcut";
import TopPage from "./Top";
import LeftPage from "./Left";
import RightPage from "./Right";

const dom = weex.requireModule("dom");

export default {
    components: {
        shortcutPages,
        TopPage,
        LeftPage,
        RightPage,
        WxcLoading
    },
    props: ["maxHeight"],
    mixins: [mixin],
    data: () => ({
        navs: [],
        menus: [],
        menusParent:'',
        contentHeight: 0,
        shortcutShow: false,
        isShow:false,//数据加载提示
    }),
    computed: {
        normalizedSize: function() {
            return this.maxHeight;
        }
    },
    mounted() {
        this.contentHeight = this.normalizedSize - 100;
    },
    async created() {
        let self = this;
        self.isShow = true;
        let {data:{payload:{code,list}}} = await  self.stream("app.!category.list");
        if(code === 200 && list){
            self.isShow = false;
            let index = 0;
            for (let { id, name, child } of list) {
                index++;
                self.navs.push({ id: id, name: name });
                if (index === 1) {
                    this.menus = child;
                    this.menusParent = id;
                }
            }
        }
    },
    methods: {
        activeMenu(val) {
            this.getCategory(val)
        },
        async getCategory(val) {
            let self = this;
            self.isShow = true;
            let query = {
                pid:val
            }
            let {data:{payload:{code,list}}} = await self.stream("app.!category.list", {query});
            if(code === 200 && list){
                self.isShow = false;
                this.menus = list
            }
        },
        activeShortcut(val) {
            //响应快速选择工具点击事件
            this.shortcutShow = val;
        }
    }
};
</script>
<style>
.category {
    width: 750px;
    align-items: flex-start;
}
.category_main {
    flex-direction: row;
    justify-content: space-between;
}
</style>