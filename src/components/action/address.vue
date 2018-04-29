<template>
    <div class="address-slide">
        <div :class="['order-header', isIos ? 'order-header-ios' : '']">
            <wxc-icon class="order-back"
                name="back"
                size="medium"
                :icon-style="{fontSize: '50px'}" 
                @wxcIconClicked="hidePopup()"></wxc-icon>
            <text class="order-title">收货地址</text>
            <div :style="{width: '60px'}"></div>
        </div>
        <scroller class="address-body">
            <div v-for="(val,key) in address"
                :key="key"
                class="address-item"
                @click="setDefault(val.address_id)">
                <image class="address-item-current"
                    :src="imgPath(['cart', parseInt(val.is_default)
                        ? 'address-item-current.png' 
                        : 'address-default-icon.png'].join('/'))"></image>
                <div class="address-item-body">
                    <text :class="['address-item-text', parseInt(val.is_default) 
                        ? 'address-default-text' 
                        : '']">{{addressText(val)}}</text>
                </div>
                <image class="address-item-curr"
                    v-if="parseInt(val.is_default)"
                    :src="imgPath('cart/address-item-curr-icon.png')"></image>
                <image class="address-item-update"
                    v-else
                    :src="imgPath('cart/address-update-icon.png')"
                    @click="addressUpdate($event, val)"></image>
            </div>
        </scroller>
        <div class="address-add">
            <div class="address-add-mr10">
                <text class="address-add-text"
                    @click="addressAdd">新增收货地址</text>
            </div>
            <image class="address-add-icon"
                :src="imgPath('cart/address-add-icon.png')"></image>
        </div>
    </div>
</template>
<script>
    import { WxcIcon
            , Utils } from "weex-ui"

    import mixin from "~/mixins"
    import filters from "~/filters"

    export default {
        props: {
            maxHeight: {
                type: Number,
                default: 300
            },
            address: {
                type: Array,
                default () {
                    return []
                }
            },
            defaultAddress: {
                type: Object
            }
        },
        components: {
            WxcIcon
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        data: () => ({
            // address: []
        }),
        created () {
            this.$emit('getAddress')
        },
        methods: {
            addressText ({ address
                        , province
                        , city
                        , district }) {
                return `${district.region_name} ${city.region_name} ${district.region_name}${address}`
            },
            setDefault(addressId) {
                this.address.forEach((val, key) => {
                    if (val.address_id === addressId) {
                        this.address[key].is_default = 1
                        this.setAddressDefault(val)
                        this.$emit('update:defaultAddress', val)
                        this.$emit('orderConfirm')
                    } else {
                        this.address[key].is_default = 0
                    }
                })
            },
            async setAddressDefault({ address_id }) {
                let {data: { payload: { list, code } }, status, ok} = await this.stream('app.!address.update', {
                    query: {
                        id: address_id
                    },
                    body: {
                        is_default: 1
                    }
                })
                return true;
            },
            addressUpdate (event, { address_id }) {
                this.jump('/member/addedit', {
                    id: address_id, 
                    title: '编辑收货地址',
                    path: '/member/address'
                })
                event.preventDefault()
            },
            addressAdd () {
                this.jump('/member/addedit', {
                    title: '新增收货地址',
                    path: '/member/address'
                })
            },
            hidePopup () {
                this.$emit('hidePopup')
            }
        }
    }
</script>
<style>
.address-slide {
    flex-direction: column;
    align-items: center;
    width: 750px;
}
.order-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 750px;
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
.address-body {
    width: 720px;
    flex: 1;
    box-sizing: border-box;
    padding-top: 25px;
}
.address-item {
    flex-direction: row;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 25px;
    padding-right: 15px;
}
.address-item-current,
.address-item-update {
    width: 30px;
    height: 30px;
}
.address-item-body {
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    padding-left: 15px;
    padding-right: 15px;
}
.address-item-text {
    width: 600px;
    text-align: left;
    lines: 2;
    text-overflow: ellipsis;
    font-size: 28px;
    color: #666666;
}
.address-default-text {
    color: #e4393c; /*#6a77b6;*/
}
.address-item-curr {
    width: 30px;
    height: 30px;
}
.address-add {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 750px;
    height: 80px;
    margin-top: 15px;
    background-color: #fefefe;
    border-top-style: solid;
    border-top-width: 2px;
    border-top-color: rgba(0, 0, 0, 0.03);
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-color: #efefef;
}
.address-add-mr10 {
    margin-right: 10px;
}
.address-add-text {
    font-size: 30px;
    color: #333333;
}
.address-add-icon {
    width: 30px;
    height: 30px;
}
</style>
