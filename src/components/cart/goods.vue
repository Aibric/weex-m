<template>
    <div class="cart-goods"
        :style="{height: `${cartBodyHeight}px`}">
        <div class="address-bar"
            :style="{height: `${addressBarHeight}px`}">
            <div class="address-bar-left"
                @click="showBottomPopup = true">
                <div class="address-bar-mr15">
                    <image class="address-bar-icon"
                        :src="imgPath('cart/address-bar-icon.png')"></image>
                </div>
                <text class="address-bar-text">{{addressText}}</text>
            </div>
            <text class="goods-edit-btn">{{isUpdateAll ? '完成' : '编辑商品'}}</text>
        </div>
        <scroller class="cart-list"
            :style="{height: `${cartListHeight}px`}">
            <cart-item v-for="(val,key) in list"
                :key="key"
                :good="val"
                :active="selects.includes(val.cart_id)"
                @goodsSelects="goodsSelects"
                @cartsChange="cartsChange"></cart-item>
        </scroller>
        <div class="total-bottom"
            :style="{height: `${totalBottomHeight}px`}">
            <div class="total-select"
                @click="totalActives()">
                <image class="total-select-image"
                    :src="imgPath(['cart', totalActive 
                        ? 'item-select-current.png' 
                        : 'item-select.png'].join('/'))"></image>
                <text class="total-select-text">全选</text>
            </div>
            <div class="total-right">
                <div class="total-price">
                    <div class="total-price-body">
                        <text class="total-price-1">总计：</text>
                        <text class="total-price-2"
                            :style="{marginTop:'2px'}">￥{{total.price}}</text>
                    </div>
                    <text class="total-weight">重量：{{total.weight}}kg</text>
                    
                </div>
                <div :class="['total-buy',  selectsIsEmpty() ? 'total-buy-disabled' : '']"
                    :style="{height: `${totalBottomHeight}px`}"
                    @click="!selectsIsEmpty() && jump('/order-action')">
                    <text :class="['total-buy-text', selectsIsEmpty() ? 'total-buy-text-disabled' : '']">去结算</text>
                    <text :class="['total-buy-count', selectsIsEmpty() ? 'total-buy-count-disabled' : '' ]"> ({{total.count}}件)</text>
                </div>
            </div>
        </div>
        <common-popup position="absolute"
            :show.sync="showBottomPopup"
            pos="bottom"
            :bg-height="cartBodyHeight"
            :height="addressBodyHeight">
            <template slot-scope="{ hide }">
                <cart-address :maxHeight="addressBodyHeight"
                    :address="address"
                    :defaultAddress.sync="defaultAddress"
                    @getAddress="getAddress"
                    @hidePopup="hide"></cart-address>
            </template>
        </common-popup>
    </div>
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

    import commonPopup from '~/components/common/popup'
    import cartAddress from './address'
    import cartItem from './item'

    export default {
        props:{
            maxHeight: Number,
            cartBodyHeight: Number
        },
        components: {
            WxcIcon,
            commonPopup,
            cartAddress,
            cartItem
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
            cartListHeight() {
                return this.cartBodyHeight - this.addressBarHeight - this.totalBottomHeight
            },
            addressText () {
                let { province
                    , city
                    , district } = this.defaultAddress
                return _.isEmpty(this.defaultAddress) 
                    ? '...' 
                    : `${district.region_name} ${city.region_name} ${district.region_name}`
            }
        },
        data: () => ({
            user: null,
            selects: [],
            totalActive: false,
            isUpdateAll: false,
            addressBarHeight: 86,
            totalBottomHeight: 100, 
            addressBodyHeight: 680,
            showBottomPopup: false,
            address: [],
            defaultAddress: {},
            list: storeCart.state.goods,
            total: {
                count: 0,
                price: '0.00',
                weight: '0.0000'
            }
        }),
        async created () {
            this.user = await store.states('user')
            if (this.user) {
                await storeCart.dispatch('getLists', true)
                this.getAddress()
                this.cartsChange()
            }
        },
        watch: {
            list (val) {
                this.totalActive = _.size(val) <= _.size(this.selects)
            },
        },
        methods: {
            async cartsChange () {
                if (!this.user) return
                let { goods, total, carts } = await storeCart.mapGetters(['goods', 'total', 'carts'])
                this.list = goods
                this.total = total
                this.selects = carts
            },
            popupClicked () {   /// :show.sync 和 @popupClicked 选其一
                this.showBottomPopup = false
            },
            async totalActives () {
                if (!this.user) return
                this.totalActive = !this.totalActive
                let cartIds = []
                this.totalActive && _.forEach(this.list, ({cart_id}) => {cartIds.push(cart_id)})
                this.selects = cartIds
                await storeCart.dispatch('carts', this.selects)
                this.total = (await storeCart.mapGetters(['total'])).total
            },
            async getAddress () {
                if (!this.user || this.address.length) return
                let {data: { payload: { list, code } }, status, ok} = await this.stream('app.!address.list', {
                    query: {
                        expand: ['province'
                                , 'city'
                                , 'district'].join(','),
                        fields: ['address_id'
                                , 'country_name'
                                , 'province_name'
                                , 'city_name'
                                , 'district'
                                , 'address'
                                , 'mobile'
                                , 'consignee'
                                , 'is_default'].join(',')
                    }
                })
                if (code == 200) {
                    this.address = list
                    this.address.forEach((val, key) => {
                        if (val.is_default === 1) {
                            storeCart.commit('SET_ADDRESS', this.defaultAddress = val)
                        }
                    })
                }
            },
            async goodsSelects(cartId) {
                if (!this.user) return
                this.selects.indexOf(cartId) > -1 
                    ? _.remove(this.selects, (value) => value == cartId)
                    : this.selects.push(cartId)
                await storeCart.dispatch('carts', this.selects)
                this.totalActive = this.selects.length >= _.size(this.list)
                this.total = (await storeCart.mapGetters(['total'])).total
            },
            selectsIsEmpty () {
                return _.isEmpty(this.selects)
            }
        }
    }
</script>
<style>
.cart-goods {
    height: 1000px;
    position: relative;
}
.address-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 86px;
    box-sizing: border-box;
    padding-left: 25px;
    padding-right: 25px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #eeeeee;
}
.address-bar-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 86px;
}
.address-bar-mr15 {
    margin-right: 10px;
}
.address-bar-icon {
    width: 30px;
    height: 34px;
}
.address-bar-text {
    font-size: 28px;
    color: #999999;
}
.goods-edit-btn {
    font-size: 28px;
    color: #e4393c;
}
.cart-list {
    background-color: #f2f3f4;
}
.total-bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    background-color: #ffffff;
    padding-left: 25px;
    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: #eeeeee;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #eeeeee;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0),rgba(0, 0, 0, .04));
}
.total-select {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100px;
    height: 40px;
}
.total-select-image {
    width: 40px;
    height: 40px;
}
.total-select-text {
    font-size: 22px;
    color: #666666;
}
.total-right {
    flex-direction: row;
    align-items: center;
}
.total-weight {
    line-height: 26px;
    font-size: 22px;
    color: #666666;
}
.total-price {
    flex-direction: column;
    align-items: flex-end;
}
.total-price-body {
    flex-direction: row;
    justify-content: center;
}
.total-price-1 {
    font-weight: bold;
    font-size: 30px;
    color: #333333;
}
.total-price-2 {
    font-weight: bold;
    font-size: 28px;
    color: #e4393c;
}
.total-buy {
    flex-direction: row;
    align-items: center;
    padding-left: 30px;
    padding-right: 30px;
    margin-left: 20px;
    background-color: #e4393c;
}
.total-buy-text {
    font-size: 34px;
    color: #ffffff;
}
.total-buy-count {
    margin-top: 10px;
    font-size: 22px;
    color: #ffffff;
}
.total-buy-disabled {
    background-color: #d7d7d7;
    cursor: default;
}
.total-buy-text-disabled,
.total-buy-count-disabled {
    color: #999999;
}
</style>
