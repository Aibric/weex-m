<template>
    <div class="order-action"
        :style="{height: `${maxHeight}px`, maxHeight: `${maxHeight}px`, minHeight: '0'}">
        <div :class="['order-header', isIos ? 'order-header-ios' : '']">
            <wxc-icon class="order-back"
                name="back"
                size="medium"
                :icon-style="{fontSize: '50px'}" 
                @wxcIconClicked="jump('/')"></wxc-icon>
            <text class="order-title">确认订单</text>
            <div :style="{width: '60px'}"></div>
        </div>
        <scroller class="order-body"
            :style="{height: `${actionBodyHeight}px`}">
            <div class="address"
                @click="showAddressPopup = !showAddressPopup">
                <text class="address-title">{{defaultAddress.consignee}} {{defaultAddress.mobile}}</text>
                <div class="address-info">
                    <text class="address-text">{{addressText(defaultAddress)}}</text>
                    <wxc-icon class="address-more"
                        name="more"
                        size="medium"
                        :icon-style="{fontSize: '34px'}"></wxc-icon>
                </div>
            </div>
            <div class="address-line">
                <div class="address-line-bg"
                    :style="{width: `${addressLineBgWidth}px`}">
                    <image v-for="val in addressLineMultiple"
                        :key="val"
                        class="address-line-image"
                        :src="imgPath('action/line.png')"
                        :style="{width: `${addressLineWidth}px`}"></image>
                </div>
            </div>
            <div class="action-list">
                <cart-item v-for="(val,key) in list"
                    :key="key"
                    :good="val"></cart-item>
            </div>
            <action-shipping :shipping="shipping"
                :shipping-active.sync="shippingActive"
                @orderConfirm="orderConfirm"></action-shipping>
            <div class="chart">
                <div class="chart-column chart-price">
                    <div class="chart-left">
                        <text class="chart-text">商品金额</text>
                    </div>
                    <div class="chart-right">
                        <text class="chart-price-1">¥ </text>
                        <text class="chart-price-2">{{total.priceTotal}}</text>
                    </div>
                </div>
                <div class="chart-column chart-weight">
                    <div class="chart-left">
                        <text class="chart-text">重量</text>
                        <text class="chart-tips">（总重：{{total.weightTotal}}kg）</text>
                    </div>
                    <div class="chart-right">
                        <text class="chart-price-0">+ </text>
                        <text class="chart-price-1"> ¥ </text>
                        <text class="chart-price-2">{{total.shippingPrice}}</text>
                    </div>
                </div>
            </div>
            <div class="order-message">
                <div class="order-message-header">
                    <text class="order-message-title">订单备注</text>
                </div>
                <textarea placeholder="请输入您的订单备注"
                    class="order-message-input"
                    :value="orderMessage"
                    @input="orderMessageChange"
                    @blur="orderMessageChange"
                    @change="orderMessageChange"></textarea>
            </div>
            <div :style="{
                    height: '80px',
                    backgroundColor: '#f2f3f4'
                }">
            </div>
        </scroller>
        <div class="action-pay"
            :style="{height: `${actionBottomHeight}px`}">
            <div></div>
            <div class="action-pay-right">
                <div class="total-price-body">
                    <text class="total-price-1">实付款：</text>
                    <text class="total-price-2">￥</text>
                    <text class="total-price-3"
                        :style="{marginTop:'2px'}">{{total.realPayPrice}}</text>
                </div>
                <div :class="['total-buy', isDisabled 
                    ? 'total-buy-disabled' 
                    : '']"
                    @click="createOrder()">
                    <text :class="['total-buy-text', isDisabled 
                        ? 'total-buy-text-disabled' 
                        : '']">提交订单</text>
                </div>
            </div>
        </div>
        <common-popup position="absolute"
            :show.sync="showAddressPopup"
            pos="right"
            :bg-height="maxHeight"
            :height="maxHeight"
            :hide-animation="{
                styles: {
                    opacity: 1
                }
            }">
            <template slot-scope="{ hide }">
                <cart-address :max-height="maxHeight"
                    :address="address"
                    :defaultAddress.sync="defaultAddress"
                    @getAddress="getAddress"
                    @hidePopup="hide"
                    @orderConfirm="orderConfirm"></cart-address>
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
    import cartItem from '~/components/action/item'
    import actionShipping from '~/components/action/shipping'
    import cartAddress from '~/components/action/Address'

    export default {
        components: {
            WxcIcon,
            commonPopup,
            cartItem,
            actionShipping,
            cartAddress
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
            addressLineMultiple () {
                return Math.ceil(750 / this.addressLineWidth)
            },
            addressLineBgWidth () {
                return this.addressLineMultiple * this.addressLineWidth
            },
            actionBodyHeight () {
                return this.maxHeight 
                    - (this.isIos ? 85 : 86) 
                    - this.actionBottomHeight 
                    - (this.isAndroid 
                        ? this.weexAndroidHeightDiff - 5
                        : 0)
            }
        },
        data: () => ({
            user: null,                     // 登录用户
            maxHeight: Utils.env.getPageHeight(),
            addressLineWidth: 128,
            actionBottomHeight: 100,        // 底部操作栏高度
            showAddressPopup: false,        // 是否开启选择收货地址面板
            address: [],
            defaultAddress: {},             // 默认收货地址
            selects: [],                    // 收货地址列表
            list: [],
            total: {                        // 计算总和
                count: 0,
                priceTotal: "0.00",
                realPayPrice: "0.00",
                shippingPrice: "0.00",
                weightTotal: "0.0000"
            },
            shipping: [],                   // 快递列表
            shippingActive: {               // 选择快递
                area_id: null,
                id: null,
                name: null
            },
            orderMessage: '',               // 订单备注
            isDisabled: true,               // 禁止提交
            isCreateOrder: false            // 已经提交
        }),
        async created () {
            this.user = await store.states('user')
            if (!this.user) this.jump('/')
            let { goods, carts, address } = await storeCart.mapGetters(['goods', 'carts', 'address'])
            if (_.isEmpty(carts)) this.jump('/')
            this.selects = carts
            this.defaultAddress = address
            _.forEach(goods, (val) => {carts.includes(val.cart_id) && this.list.push(val)})
            let { status, ok, statusText, data: { payload }, headers } = await this.stream("app.!common.!deliveries.way", {
                query: {
                    id: this.defaultAddress.address_id
                }
            })
            if (_.get(payload, 'code') == 200 && payload.list) {
                this.shipping = payload.list
                if (this.shipping[0]) {
                    let { area_id, id, name } = this.shipping[0]
                    this.shippingActive = {
                        area_id,
                        id,
                        name
                    }
                }
            }
            this.orderConfirm()
        },
        methods: {
            addressText (defaultAddress) {
                if (_.isEmpty(defaultAddress)) return ''
                let { address
                    , province: { region_name: province_name = '' }
                    , city: { region_name: city_name = '' }
                    , district: { region_name: district_name = '' }} = defaultAddress
                return `${district_name} ${city_name} ${district_name}${address}`
            },
            async getAddress () {
                if (this.address.length) return
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
            orderMessageChange (e) {
                this.orderMessage = e.value
            },
            async orderConfirm () {
                this.isDisabled = true
                if (!this.user || !this.shippingActive.area_id || !this.selects.length) return
                let { status, ok, statusText, data: { payload: { code, list } }, headers } = await this.stream('app.!common.!action.confirm', {
                    body: {
                        ids: this.selects.join(','),
                        area_id: this.shippingActive.area_id
                    }
                })
                if (code == 200) {
                    this.isDisabled = false
                    this.total = Object.assign(this.total, list.total)
                    //// this.list = list.goods
                }
            },
            async createOrder () {
                if (this.isDisabled ||  this.isCreateOrder) return
                this.isCreateOrder = true
                let { address_id } = this.defaultAddress
                let {area_id, id: shipping_id } = this.shippingActive
                let { status, ok, statusText, data: { payload }, headers } = await this.stream('app.!common.!action.create', {
                    body: {
                        items: this.selects.join(','),
                        addressId: address_id,
                        areaId: area_id,
                        shippingId: shipping_id,
                        orderMessage: this.orderMessage
                    }
                })
                if (_.get(payload, 'code') !== 200) {
                    this.isCreateOrder = false
                    this.alert(_.get(payload, 'info'))
                    return
                }
                // payload.info     // 订单号
                await storeCart.dispatch('emptyCart')
                this.jump('/pay', {osn: payload.info})
            }
        }
    }
</script>
<style>
.order-action {
    flex-direction: column;
    overflow: hidden;
    position: relative;
}
.order-body {
    width: 750px;
    position: relative;
    overflow: hidden;
}
.order-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 85px;
    padding-right: 20px;
    background-color: #ffffff;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #eeeeee;
    background-image: linear-gradient(to top,#ffffff,#efefef);
}
.order-header-ios {
    border-bottom: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}
.order-title {
    font-size: 32px;
    color: #616161;
}
.address {
    padding-top: 25px;
    padding-bottom: 15px;
    padding-left: 25px;
    padding-right: 25px;
    flex-direction: column;
}
.address-title {
    line-height: 50px;
    font-weight: 600;
    font-size: 30px;
    color: #333333;
}
.address-info {
    flex-direction: row;
    align-items: center;
}
.address-text {
    flex: 1;
    padding-right: 20px;
    line-height: 46px;
    font-size: 28px;
    color: #333333;
}
.address-line {
    width: 750px;
    overflow: hidden;
}
.address-line-bg {
    flex-direction: row;
    flex-wrap: nowrap;
}
.address-line-image {
    width: 120px;
    height: 10px;
}
.action-list {
    padding-top: 25px;
    background-color: #f2f3f4;
}
.action-pay {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.action-pay-right {
    flex-direction: row;
}
.total-price-body {
    flex-direction: row;
    justify-content: center;
    overflow: hidden;
    margin-right: 30px;
}
.total-price-1 {
    line-height: 106px;
    font-size: 28px;
    color: #e4393c;
}
.total-price-2 {
    line-height: 110px;
    font-size: 24px;
    color: #e4393c;
}
.total-price-3 {
    line-height: 100px;
    font-size: 32px;
    color: #e4393c;
}
.total-buy {
    flex-direction: row;
    align-items: center;
    padding-left: 50px;
    padding-right: 50px;
    margin-left: 20px;
    background-color: #e4393c;
}
.total-buy-text {
    line-height: 100px;
    font-size: 36px;
    color: #ffffff;
}
.total-buy-disabled {
    background-color: #d7d7d7;
    cursor: default;
}
.total-buy-text-disabled {
    color: #999999;
}
.order-message {
    flex-direction: column;
    padding-top: 25px;
    padding-bottom: 40px;
    padding-left: 25px;
    padding-right: 25px;
}
.order-message-header {
    flex-direction: row;
    margin-bottom: 15px;
}
.order-message-title {
    line-height: 50px;
    font-size: 28px;
    color: #464646;
}
.order-message-input {
    width: 700px;
    height: 200px;
    box-sizing: border-box;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
    border-style: solid;
    border-width: 2px;
    border-color: #eaeaea;
    border-radius: 12px;
    line-height: 36px;
    font-size: 24px;
    color: #666666;
}
.chart {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #f2f3f4;
}
.chart-column {
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 20px;
    background-color: #ffffff;
}
.chart-left,
.chart-right {
    flex-direction: row;
}
.chart-left {
    padding-left: 25px;
}
.chart-right {
    padding-right: 25px;
}
.chart-price {
    padding-top: 30px;
}
.chart-weight {
    padding-bottom: 40px;
}
.chart-text {
    line-height: 32px;
    font-size: 28px;
    color: #333333;
}
.chart-tips {
    line-height: 38px;
    font-size: 22px;
    color: #999999;
}
.chart-price-0,
.chart-price-1,
.chart-price-2 {
    line-height: 40px;
    font-size: 24px;
    color: #e4393c;
}
.chart-price-2 {
    line-height: 32px;
    font-size: 28px;
}
</style>
