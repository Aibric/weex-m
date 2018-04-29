<template>
    <div class="shipping">
        <div class="shipping-header">
            <text class="shipping-header-title">配送服务</text>
        </div>
        <div class="shipping-body">
            <div v-for="(val,key) in shipping"
                :key="key"
                :class="['shipping-item', shippingActive.area_id === val.area_id 
                    ? 'shipping-item-active' 
                    : '' ]"
                @click="actived(val)">
                <text :class="['shipping-item-text', shippingActive.area_id === val.area_id 
                    ? 'shipping-item-text-active' 
                    : '']">{{val.name}}</text>
            </div>
        </div>
        <div class="shipping-tips">
            <text class="shipping-tips-text"> 送货时间：工作日、双休日与节假日均可送货 </text>
        </div>
    </div>
</template>
<script>
    import { Utils } from "weex-ui"
    import _ from 'lodash'

    import mixin from "~/mixins"
    import filters from "~/filters"
    import helper from "~/utils/helper"

    import storeCart from '~/store/module/cart'

    export default {
        props:{
            shipping: {
                type: Array,
                default () {
                    return []
                }
            },
            shippingActive: Object
        },
        components: {
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
        },
        data: () => ({
        }),
        created () {
        },
        methods: {
            actived ({ area_id, id, name }) {
                this.$emit('update:shippingActive', this.shippingActive.area_id == area_id 
                    ? null 
                    : { area_id, id, name })
                this.$emit('orderConfirm')
            }
        }
    }
</script>
<style>
.shipping {
    flex-direction: column;
}
.shipping-header {
    flex-direction: row;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 15px;
}
.shipping-header,
.shipping-body,
.shipping-tips {
    padding-left: 25px;
    padding-right: 25px;
}
.shipping-header-title {
    line-height: 50px;
    font-size: 32px;
    color: #464646;
}
.shipping-body {
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-bottom: 10px;
}
.shipping-item {
    height: 60px;
    padding-left: 30px;
    padding-right: 30px;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: 5px;
    margin-bottom: 25px;
    border-radius: 6px;
    border-style: solid;
    border-width: 2px;
    border-color: #dddddd;
}
.shipping-item-active {
    border-color: #e93b3d;
}
.shipping-item-text {
    line-height: 58px;
    font-size: 26px;
    color: #666666;
}
.shipping-item-text-active {
    color: #e93b3d;
}
.shipping-tips {
    margin-bottom: 30px;
    border-top-style: solid;
    border-top-width: 2px;
    border-top-color: #e9e9e9;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-color: #e9e9e9;
}
.shipping-tips-text {
    line-height: 50px;
    font-size: 24px;
    color: #ababab;
}
</style>