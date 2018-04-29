<template>
  <div class="category_his">
    <search-page></search-page>
    <history-page :style="maxHeight"></history-page>
  </div>
</template>
<script>
import Vue from "vue";
import { Utils } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import SearchPage from "~/components/category/history/Search";
import historyPage from "~/components/category/history/History";

const dom = weex.requireModule("dom");

export default {
    components: {
        SearchPage,
        historyPage
    },
    mixins: [mixin],
    data: () => ({
        searchS: false, //搜索历史、商品分类页面活动状态
        tabStyles: Config.tabStyles
    }),
    created() {
        const tabPageHeight = Utils.env.getPageHeight();
        const { tabStyles } = this;
        this.contentStyle = { height: tabPageHeight - tabStyles.height + "px" };
        this.maxHeight = {
            height: tabPageHeight - tabStyles.height - 50 + "px"
        };
    },
    methods: {}
};
</script>
<style>
.category_his {
    width: 750px;
}
</style>