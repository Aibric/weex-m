<template>
    <div class="cart-item">
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
                    <text class="cart-number">×{{good.number}}</text>
                    <!-- 
                    <common-stepper :default-value="good.number"
                        step="1"
                        max="100"
                        min="1"
                        :minusStyle="stepperButtonStyle"
                        :plusStyle="stepperButtonStyle"
                        :inputStyle="stepperInputStyle"
                        :iconStyle="stepperIconStyle"
                        :disabled="isDisabled"
                        :readOnly="isOnlyRead"></common-stepper> 
                        -->
                </div>
                <div class="cart-item-action">
                    <div class="item-action-7">
                        <div :style="{marginRight: '10px'}">
                            <image class="item-action-7-image"
                                :src="imgPath('action/7.png')"></image>
                        </div>
                        <text class="item-action-7-text">支持7天无理由退货(激活后不支持)</text>
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
                    backgroundColor: '#ffffff',
                    lineHeight: '44px',
                    color: '#888888',
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
                    fontSize: '46px',
                    color: '#999999'
                }
            }
        },
        data: () => ({
            currentValue: 1,
            isDisabled: true,
            isOnlyRead: true
        }),
        methods: {
        }
    }
</script>
<style>
.cart-item {
    flex-direction: row;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 25px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-sizing: border-box;
    background-color: #ffffff;
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
    width: 520px;
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
.cart-number {
    lines: 1;
    line-height: 30px;
    font-size: 26px;
    color: #999999;
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
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-right: 15px;
    margin-top: 15px;
    margin-bottom: 10px;
}
.item-action-7 {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
}
.item-action-7-image {
    width: 34px;
    height: 34px;
}
.item-action-7-text {
    line-height: 34px;
    font-size: 22px;
    color: #999999;
}
</style>
