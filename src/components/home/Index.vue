<template>
    <scroller :class="['container', 'home-body']"
        :loadmoreoffset="300"
        :style="{height: maxHeight + 'px'}"
        @scroll="scroll"
        @loadmore="loadmore">
        <!-- <h-banner :value="banners"></h-banner> -->
        <div :style="{
            height: `500px`,
            backgroundColor: `#f34eab`
        }"></div>
        <search-main :user="user"
            :search="search"></search-main>
        <quick-nav v-if="quick.length"
            :quick="quick"></quick-nav>
        <h-brands :brands="brands"></h-brands>
        <ad-slider v-if="ads.length"
            :ads="ads"></ad-slider>
        <h-themes v-if="themes.length"
            :themes="themes"></h-themes>
        <h-floor v-if="Object.keys(floor).length"
            :floor="floor"></h-floor>
        <h-recommend ref="recommend" :recommend="recommend"
            :loading="loading"></h-recommend>
    </scroller>
</template>
<script>
    import _ from "lodash"
    import mixin from "~/mixins"
    import filters from "~/filters"

    import store from "~/store"

    import helper from '~/utils/helper'

    import HBanner from "./Banner"
    import SearchMain from "./Search"
    import QuickNav from "./nav"
    import HBrands from './brand'
    import AdSlider from "./ad"
    import HThemes from "./theme"
    import HFloor from "./floor"
    import HRecommend from "./recommend"

    export default {
        props: {
            user: {
                type: Object
            },
            maxHeight: Number
        },
        components: {
            HBanner,
            SearchMain,
            QuickNav,
            HBrands,
            AdSlider,
            HThemes,
            HFloor,
            HRecommend
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        data: () => ({
            banners: [],
            search: [],
            quick: [],
            ads: [],
            themes: [],
            brands: [],
            floor: {},
            recommend: [],
            loading: 0, // 0-关闭加载器 1-显示加载器 2-没有更多了
            page: 1
        }),
        async created() {
            let { status, ok, statusText, data } = await this.stream("app.home")
            if (_.get(data, "payload.code") != 200)
                return this.alert("首页加载失败！");
            let {
                payload: { info: { search
                                    , banners
                                    , quick = this.quick
                                    , ads = this.ads
                                    , themes = this.themes
                                    , brands = this.brands
                                    , floor = this.floor } } } = data;
            this.search = search
            this.banners = banners
            this.quick = quick
            this.ads = ads
            this.themes = themes
            this.brands = brands
            this.floor = floor
            if (!Object.keys(this.floor).length) {
                this.loadmore()
            }
        },
        methods: {
            logout() {
                store.commit("SET_USER", null)
                this.$emit('update:user', null)
            },
            scroll({ contentSize, contentOffset }) {
                // console.log('__contentOffset', contentOffset)
            },
            async loadmore() {
                if (this.loading >= 2) return
                this.loading = 1
                let _page = this.page
                this.page += 1
                let { status, ok, statusText, data } = await this.stream("app.recommend", {
                    query: {
                        isBest: 1,
                        page: _page
                    }
                })
                if (_.get(data, "payload.code") != 200) return this.alert("推荐加载失败！")
                let { payload: { list, _meta: { currentPage, pageCount, perPage, totalCount } } } = data;
                this.loading = currentPage >=  pageCount ? 2 : 0
                this.recommend.push.apply(this.recommend, _.chunk(list, 2));
            }
        }
    };
</script>
<style>
.home-body {
    position: relative;
}
</style>