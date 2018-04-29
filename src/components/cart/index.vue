<template>
    <scroller :class="['container', 'cart']" 
        :style="{height: `${maxHeight}px`}">
        <div :class="['cart-header', isIos ? 'cart-header-ios' : '']">
            <wxc-icon class="cart-back"
                name="back"
                size="medium"
                :icon-style="{fontSize: '50px'}" 
                @wxcIconClicked="jump('index')"></wxc-icon>
            <text class="cart-title">购物车</text>
            <div class="header-short-box"
                @click="activeShortcut(!shortcutShow)">
                <image class="header-short"
                    :src="imgPath('common/shortcut/short.png')"></image>
            </div>
        </div>
        <div class="cart-body"
            :style="{height: `${cartBodyHeight}px`}">
            <cart-empty v-if="!user"></cart-empty>
            <cart-goods v-else
                :cart-body-height="cartBodyHeight"></cart-goods>
        </div>
        <shortcut-pages :shortcutShow="shortcutShow"
            position="absolute"
            v-on:activeShortcut="activeShortcut"
            v-if="shortcutShow">
        </shortcut-pages>
    </scroller>
</template>
<script>
    import { WxcIcon
            , Utils } from "weex-ui"
    import _ from 'lodash'

    import mixin from "~/mixins"
    import filters from "~/filters"
    import helper from "~/utils/helper"

    import store from '~/store/index'
    import storeCart from '~/store/module/cart'

    import shortcutPages from '~/components/common/shortcut'
    import cartEmpty from './empty'
    import cartGoods from './goods'

    var modal = weex.requireModule('modal')

    export default {
        props: {
            user: {
                type: Object
            },
            maxHeight: Number
        },
        components: {
            WxcIcon,
            shortcutPages,
            cartEmpty,
            cartGoods
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
            store () {
                return store
            },
            cartBodyHeight () {
                return this.maxHeight - (this.isIos ? 88 : 89)
            }
        },
        data: () => ({
            shortcutShow: false
        }),
        methods: {
            activeShortcut (val) {    // 响应快速选择工具点击事件
                this.shortcutShow = val
            },
        }
    }
</script>
<style>
.cart {
    width: 750px;
    background-color: #ffffff;
}
.cart-body {
    width: 750px;
    position: relative;
    overflow: hidden;
}
.cart-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 88px;
    padding-right: 20px;
    background-color: #ffffff;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #eeeeee;
}
.cart-header-ios {
    border-bottom: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}
.cart-title {
    font-size: 38px;
    color: #616161;
}
.header-short-box {
    margin-right: 20px;
}
.header-short {
    width:40px;
    height:40px;
}
</style>
