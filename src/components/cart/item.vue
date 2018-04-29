<template>
    <div class="cart-item">
        <div class="cart-item-select"
            @click="$emit('goodsSelects', good.cart_id)">
            <image class="cart-item-select-image"
                :src="imgPath(['cart', active 
                    ? 'item-select-current.png' 
                    : 'item-select.png'].join('/'))"></image>
        </div>
        <div class="cart-item-body">
            <image class="cart-item-image"
                :src="good.goods_img"
                @click="jump('/goods',{id: good.goods_id})"></image>
            <div class="cart-item-right">
                <div class="cart-item-info">
                    <text class="cart-item-name"
                        @click="jump('/goods',{id: good.goods_id})">{{good.goods_name}}</text>
                    <div class="cart-item-specs">
                        <text class="cart-item-specs-text"
                            v-if="good.spec && good.spec.length"
                            :style="{marginBottom: '5px'}">{{good.spec | specsTo}}</text>
                        <text class="cart-item-weight">{{good.weight}}kg</text>
                    </div>
                </div>
                <div class="cart-item-line">
                    <div class="cart-item-price">
                        <text class="item-price-start">￥</text>
                        <text class="item-price">{{good.price | startPrice}}</text>
                        <text class="item-price-end">.{{good.price | endPrice}}</text>
                    </div>
                    <common-stepper :default-value="good.number"
                        step="1"
                        max="100"
                        min="1"
                        :params="good"
                        :minusStyle="stepperButtonStyle"
                        :plusStyle="stepperButtonStyle"
                        :inputStyle="stepperInputStyle"
                        :iconStyle="stepperIconStyle"
                        @stepperValueChanged="stepperValueChange"
                        @stepperValueIsMinOver="stepperValueIsMinOver"
                        @stepperValueIsMaxOver="stepperValueIsMaxOver"></common-stepper>
                </div>
                <div class="cart-item-action">
                    <text class="item-action-search"></text>
                    <div class="item-action-right">
                        <!-- <text class="item-move-focus"
                            @click="moveFocus()">移入关注</text> -->
                        <text class="item-delete"
                            @click="itemDelete(good.cart_id)">删除</text>
                    </div>
                </div>
            </div>
        </div>
    </div> 
</template>
<script>
    import { WxcStepper
            , Utils } from "weex-ui"
    import _ from 'lodash'

    import mixin from "~/mixins"
    import filters from "~/filters"
    import helper from "~/utils/helper"

    import store from '~/store/index'
    import storeCart from '~/store/module/cart'
    
    import commonStepper from '~/components/common/stepper'

    export default {
        props: {
            active: {
                type: Boolean,
                default: false
            },
            good: Object
        },
        components: {
            WxcStepper,
            commonStepper
        },
        mixins: [mixin],
        filters: {
            ...filters,
            specsTo(value) {
                let specTo = ''
                if (!Array.isArray(value)) return specTo
                value.forEach(({k, v}) => {
                    specTo += [k, ' : ', v, '  '].join('')
                })
                return specTo
            },
            startPrice (value) {
                if (!_.isString(value)) value = value.toString()
                value = value.split('.')
                value.pop()
                return value.join('.')
            },
            endPrice (value) {
                if (!_.isString(value)) value = value.toString()
                if ((value = value.split('.')) && value.length < 2) return '00'
                return value.pop().substring(0, 2)
            }
        },
        computed: {
            stepperButtonStyle () {
                return {
                    width: '46px',
                    height: '46px',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: '#f1f1f1',
                    borderRadius: 0,
                    boxSizing: 'content-box',
                    backgrounfColor: '#f5f5f5'
                }
            },
            stepperInputStyle () {
                return {
                    lineHeight: '44px',
                    borderTopStyle: 'solid',
                    borderTopWidth: '1px',
                    borderTopColor: '#f1f1f1',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: '#f1f1f1'
                }
            },
            stepperIconStyle () {
                return {
                    fontSize: '46px'
                }
            }
        },
        data: () => ({
            currentValue: 1,
            isDisabled: true,
            isOnlyRead: true
        }),
        methods: {
            async stepperValueChange (e, { cart_id, goods_id }) {
                if (this.isWeb && this.currentValue == e.value) return
                this.currentValue = e.value
                await storeCart.dispatch('create', [{
                    gid: goods_id,
                    num: e.value,
                    isSum: false
                }])
                this.$emit('cartsChange')
                console.log(e.value);
            },
            stepperValueIsMinOver (e) {
                console.log('___min', e.value);
            },
            stepperValueIsMaxOver (e) {
                console.log('___max', e.value);
            },
            itemSelect (cartId) {

            },
            moveFocus () {

            },
            async itemDelete (cid) {
                let [, status] = await this.confirmAsync('是否确定删除此商品？', 0.6)
                if (status) {
                    storeCart.dispatch('delete', [cid])
                    // this.$emit('change')
                }
            }
        }
    }
</script>
<style>
.cart-item {
    flex-direction: row;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 25px;
    margin-bottom: 20px;
    box-sizing: border-box;
    background-color: #ffffff;
}
.cart-item-select {
    padding-top: 60px;
    padding-right: 15px;
}
.cart-item-select-image {
    width: 40px;
    height: 40px;
}
.cart-item-body {
    flex: 1;
    flex-direction: row;
}
.cart-item-image {
    width: 165px;
    height: 165px;
}
.cart-item-right {
    flex: 1;
    flex-direction: column;
    margin-left: 20px;
}
.cart-item-info {
    flex: 1;
    flex-direction: column;
    overflow: hidden;
}
.cart-item-name {
    width: 460px;
    height: 72px;
    overflow: hidden;
    lines: 2;
    text-overflow: ellipsis;
    font-weight: bold;
    line-height: 36px;
    font-size: 28px;
    color: #555555;
}
.cart-item-specs {
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    margin-top: 10px;
}
.cart-item-specs-box {
    margin-right: 20px;
}
.cart-item-specs-text,
.cart-item-weight {
    flex: 1;
    lines: 1;
    text-overflow: ellipsis;
    line-height: 30px;
    font-size: 26px;
    color: #999999;
}
.cart-item-line {
    flex-direction: row;
    justify-content: space-between;
    padding-right: 15px;
    margin-top: 15px;
}
.cart-item-price {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}
.item-price-start,
.item-price-end {
    line-height: 28px;
    font-size: 28px;
    color: #f23030;
}
.item-price {
    height: 34px;
    line-height: 37px;
    font-size: 34px;
    color: #f23030;
}
.cart-stepper-minus,
.cart-stepper-plus {
    width: 46px;
    height: 46px;
    background-color: #ededed;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}
.cart-stepper-input {
    border-width: 0;
    text-align: center;
    color: #3d3d3d;
    font-size: 30px;
    line-height: 46px;
    width: 86px;
}
.cart-stepper-icon {
    font-size: 12px;
}
.cart-item-action {
    flex-direction: row;
    justify-content: space-between;
    padding-right: 15px;
    margin-top: 15px;
    margin-bottom: 30px;
}
.item-action-search {
    line-height: 34px;
    font-size: 26px;
    color: #e4393c;
}
.item-action-right {
    width: 180px;
    flex-direction: row;
    justify-content: flex-end;
}
.item-move-focus,
.item-delete {
    line-height: 34px;
    font-size: 26px;
    color: #999999
}
</style>
