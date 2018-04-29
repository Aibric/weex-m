<template>
    <div class="cart-empty-box">
        <div class="cart-empty">
            <image class="cart-empty-icon"
                :src="imgPath('cart/cart.png')"></image>
            <text class="cart-empty-text">登录后可同步购物车中商品</text>
            <div class="cart-login-btn" @click="jump('login')">
                <text class="login-btn-text">登陆</text>
            </div>
        </div>
        <div class="cart-sign">
            <image class="cart-sign-image"
                :src="imgPath('cart/sign.jpg')"></image>
        </div>
    </div>
</template>
<script>
    import { WxcIcon } from "weex-ui"
    import _ from 'lodash'

    import mixin from "~/mixins"
    import filters from "~/filters"
    import helper from "~/utils/helper"

    import store from '~/store/index'

    export default {
        components: {
            WxcIcon
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
        },
        data: () => ({
            shortcutShow: false,
        }),
        created () {
        },
        methods: {
        }
    }
</script>
<style>
.cart-empty-box {
    width: 750px;
    background-color: #f7f7f7;
}
.cart-empty {
    display: flex;
    flex-flow: column nowrap;
    align-content: center;
    align-items: center;
    padding-top: 50px;
}
.cart-empty-icon {
    width: 175px;
    height: 175px;
}
.cart-empty-text {
    line-height: 90px;
    font-size: 32px;
    color: rgba(51,51,51,.66);
}
.cart-login-btn {
    padding-left: 30px;
    padding-right: 30px;
    border-color: #e4393c;
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
}
.login-btn-text {
    line-height: 56px;
    font-size: 28px;
    color: #e4393c;
}
.cart-sign {
    margin-top: 60px;
    margin-bottom: 20px;
}
.cart-sign-image {
    width: 750px;
    height: 180px;
}
</style>
