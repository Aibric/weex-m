<template>
    <wxc-tab-bar bubble="true" :tab-titles="tabTitles"
        :tab-styles="tabStyles"
        :title-use-slot="true"
        title-type="icon"
        ref="wxc-tab-bar"
        @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
        <template v-for="(val,key) in tabTitles">
            <div :key="`navs-${key}`"
                :slot="`tab-title-${key}`"
                :style="titleStyle"
                class="tab-title"
                @click="navActived(key, val.title, val)">
                <image class="tab-title-image"
                    :src="imgPath(val.active ? val.activeIcon : val.icon)"
                    :style="imageStyle"></image>
                <div class="tab-title-box"
                    :style="titleBoxStyle">
                    <text class="tab-title-text"
                        :style="{
                            fontSize: tabStyles.fontSize + `px`,
                            fontWeight: tabStyles.isActiveTitleBold 
                                ? 'blod' 
                                : 'normal',
                            color: val.active 
                                ? tabStyles.activeTitleColor 
                                : tabStyles.titleColor
                        }">{{val.title}}</text>
                </div>
            </div>
            <div :key="`item-${key}`"
                :style="{height: maxHeight + 'px'}"
                class="item-container">
                <component v-if="!val.isWeb"
                    :is="val.component"
                    :max-height="maxHeight"
                    :user.sync="user"
                    keep-alive></component>
            </div>
        </template>
    </wxc-tab-bar>
</template>
<script>
    import { WxcTabBar
            , Utils } from "weex-ui";
    import { get, each, isEmpty, isObject } from 'lodash'

    import mixin, { stream } from "~/mixins";
    import filters from "~/filters";
    import helper from "~/utils/helper"
    import Config from "~/utils/config";

    import store from '~/store/index'

    import HomePage from "~/components/home/Index";
    import CategoryIndexPages from "~/components/category/Index"
    import FoundPage from '~/components/found/Index'
    import CartPage from '~/components/cart/Index'
    import MemberPage from '~/components/member/Index'

    export default {
        name: "App",
        components: {
            HomePage,
            WxcTabBar,
            CategoryIndexPages,
            FoundPage,
            CartPage,
            MemberPage
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
            titleStyle () {
                return {
                    backgroundColor: this.tabStyles.bgColor || '#ffffff',
                    width: `${this.tabStyles.width}px`,
                    height: `${this.tabStyles.height}px`
                }
            },
            imageStyle () {
                return {
                    width: `${this.tabStyles.iconWidth}px`,
                    height: `${this.tabStyles.iconHeight}px`
                }
            },
            titleBoxStyle () {
                return {
                    paddingLeft: `${this.tabStyles.textPaddingLeft}px`,
                    paddingRight: `${this.tabStyles.textPaddingRight}px`,
                    paddingTop: `${this.tabTitles.textPaddingTop}px`
                }
            }
        },
        data: () => ({
            // iconStyle: 'width, height, left, top, right, bottom',
            // textStyle: 'width, height, left, top, right, bottom, bg_color, bg_repeat, bg_position, border_radius'
            user: null,
            tabTitles: [],
            tabStyles: {},
            maxHeight: Utils.env.getPageHeight(),
            actives: {}
        }),
        async beforeCreate () {
            let { status, ok, statusText, data, headers } = await stream("app.navs");
            if (get(data, 'payload.code') != 200) return
            let { styles, titles } = get(data, 'payload.list', {})
            if (styles) {
                each(styles, (val, key) => {
                    this.$set(this.tabStyles, helper.toUpperCaseAll(key), val)
                })
            }
            if (titles) {
                each(titles, (val,key) => {
                    val = helper.toUpperCaseAll(val, false, true)
                    val['icon'] = this.defaultVal(val, 'icon', 'defaultIcon')
                    val['activeIcon'] = this.defaultVal(val, 'activeIcon', 'defaultActiveIcon')
                    if (!this.tabTitles.length) val.active = true
                    this.tabTitles.push(val)
                })
            }
            this.maxHeight = this.maxHeight - this.tabStyles.height
            !this.isWeb && (this.maxHeight -= 34)
        },
        async created () {
            this.user = (await store.mapGetters(["user"])).user
        },
        mounted () {
            if (this.queryParame('pages')) {
                setTimeout(() => {
                    this.navActived(this.queryParame('pages'))
                }, 1000)
            }  
        },
        methods: {
            wxcTabBarCurrentTabSelected(e) {
                // console.log(e.page);
            },
            defaultVal (val, key, defKey) {
                return key in val && isEmpty(val[key]) 
                    ? val[defKey] || ''
                    : val[key]
            },
            navActived (index, title, value) {
                this.tabTitles.forEach((val, key) => {
                    this.$set(this.tabTitles[key], 'active', val.title == title || index == key)
                    if (index == key && !value) value = val
                })
                this.$refs['wxc-tab-bar'].setPage(index)
                if (value && value.isWeb) this.jump(value.webUrl)
            }
        }
    };
</script>
<style>
.item-container {
    width: 750px;
    background-color: #f2f3f4;
    position: relative;
}
.tab-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 5px;
}
</style>