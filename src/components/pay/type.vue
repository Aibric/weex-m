<template>
    <div class="pay-type">
        <div class="pay-type-header">
            <text class="pay-type-title">{{value.title}}</text>
        </div>
        <div class="pay-type-body">
            <div v-for="(val,key) in value.items"
                :key="key"
                class="pay-type-item">
                <div class="pay-type-left">
                    <image class="pay-type-icon"
                        :src="imgPath(val.icon_url)"></image>
                    <div class="pay-type-info">
                        <text class="pay-type-name">{{val.name}}</text>
                        <text class="pay-type-helper">{{val.text}}</text>
                    </div>
                </div>
                <div class="pay-type-select"
                    @click="$emit('activePayType', val)">
                    <image class="pay-type-select-image"
                        :src="imgPath(['pay', payTypeActive === val.tag && setPayActive(val)
                            ? 'selecte.active.png' 
                            : 'selecte.png'].join('/'))"></image>
                </div>
            </div>
            <div v-if="value.is_more"
                class="pay-more">
                <text class="pay-more-text">{{value.more_text}}</text>
                <wxc-icon class="pay-more-icon"
                    name="more"
                    size="medium"
                    :icon-style="{fontSize: '36px'}" 
                    @wxcIconClicked="1"></wxc-icon>
            </div>
        </div>
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

    export default {
        props: {
            value: Object,
            index: String,
            payTypeActive: String,
            isTriggerPayActive: Boolean
        },
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
            payActive: null
        }),
        created () {
            this.triggerPayActive()
        },
        methods: {
            setPayActive (payActive) {
                this.payActive = payActive
                return true
            },
            triggerPayActive () {
                // 是否触发默认支付选项
                if (this.isTriggerPayActive) {
                    $emit('activePayType', this.payActive)
                }
            }
        }
    }
</script>
<style>
.pay-type {
    flex-direction: column;
    background-color: #ffffff;
    border-top-style: solid;
    border-top-width: 2px;
    border-top-color: #eeeeee;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-color: #eeeeee;
    margin-bottom: 60px;
}
.pay-type-header {
    height: 82px;
    flex-direction: row;
    justify-content: flex-start;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-color: #eeeeee;
}
.pay-type-title {
    line-height: 82px;
    font-size: 28px;
    color: #848689;   
}
.pay-type-body {
    flex-direction: column;
    padding-top: 20px;
    padding-bottom: 40px; 
}
.pay-type-header,
.pay-type-body {
    padding-left: 25px;
    padding-right: 25px;
}
.pay-type-item {
    flex-direction: row;
    justify-content: space-between;
    margin-top: 15px;
    margin-bottom: 15px;
}
.pay-type-left {
    flex-direction: row;
}
.pay-type-icon {
    height: 60px;
    width: 60px;
}
.pay-type-info {
    flex-direction: column;
    margin-left: 15px;
}
.pay-type-name {
    line-height: 36px;
    font-size: 28px;
    color: #232626;
}
.pay-type-helper {
    line-height: 38px;
    font-size: 24px;
    color: #848689;
}
.pay-type-select {
    flex-direction: row;
    align-items: center;
}
.pay-type-select-image {
    width: 36px;
    height: 36px;
}
.pay-more {
    flex-direction: row;
    justify-content: space-between;
    padding-top: 30px;
    margin-bottom: 10px;
}
.pay-more-text {
    line-height: 40px;
    font-size: 26px;
    color: #686868;
}
</style>