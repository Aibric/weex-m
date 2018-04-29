<template>
    <div :class="['container', 'pay']" 
        :style="{height: `${maxHeight}px`}">
        <div :class="['pay-header', isIos ? 'pay-header-ios' : '']">
            <wxc-icon class="pay-back"
                name="back"
                size="medium"
                :icon-style="{fontSize: '50px'}" 
                @wxcIconClicked="jump('index')"></wxc-icon>
            <text class="pay-title">明辉收银台</text>
            <div class="header-short-box"
                @click="activeShortcut(!shortcutShow)">
                <image class="header-short"
                    :src="imgPath('common/shortcut/short.png')"></image>
            </div>
        </div>
        <scroller class="pay-body"
            :style="{height: `${payBodyHeight}px`}">
            <div class="order-bar">
                <div class="order-bar-left"></div>
                <div class="order-bar-right">
                    <text class="order-bar-right-text">需支付:</text>
                    <div class="pay-total">
                        <text class="pay-total-1">{{orderInfo.order_amount | startPrice}}</text>
                        <text class="pay-total-2">.{{orderInfo.order_amount | endPrice}}</text>
                        <text class="pay-total-3">元</text>
                    </div>
                </div>
            </div>
            <pay-type v-for="(val,key) in pay"
                :key="key"
                :value="val"
                :index="key"
                :pay-type-active="payTypeActive"
                :is-trigger-pay-active="isTriggerPayActive"
                @activePayType="activePayType"></pay-type>
        </scroller>
        <div class="pay-submit"
            :style="{bottom: `${submitPosBottom}px`}"
            @click="submitPay()">
            <text class="pay-submit-text">银行卡支付{{orderInfo.order_amount}}元</text>
        </div>
        <wxc-loading :show="loading"></wxc-loading>
        <shortcut-pages :shortcutShow="shortcutShow"
            position="absolute"
            v-on:activeShortcut="activeShortcut"
            v-if="shortcutShow">
        </shortcut-pages>
    </div>
</template>
<script>
    import { WxcIcon
            , WxcLoading
            , Utils } from "weex-ui"
    import _ from 'lodash'

    import mixin, { queryParames
                    , queryParame
                    , isWeiXin
                    , stream
                    , alert } from "~/mixins"
    import filters from "~/filters"
    import helper from "~/utils/helper"

    import store from '~/store/index'
    import storeCart from '~/store/module/cart'

    import shortcutPages from '~/components/common/shortcut'
    import payType from '~/components/pay/type'

    var navigator = weex.requireModule('navigator')
    var modal = weex.requireModule('modal')

    export default {
        components: {
            WxcIcon,
            WxcLoading,
            shortcutPages,
            payType
        },
        mixins: [mixin],
        filters: {
            ...filters,
            startPrice (value) {
                if (!value) return '0'
                if (!_.isString(value)) value = value.toString()
                value = value.split('.')
                value.pop()
                return value.join('.')
            },
            endPrice (value) {
                if (!value 
                    || value 
                    && !_.isString(value) 
                    && !(value = value.toString()) 
                    || (value = value.split('.')) 
                    && value.length < 2) return '00'
                return value.pop().substring(0, 2)
            }
        },
        computed: {
            payBodyHeight () {
                return this.maxHeight 
                    - this.headerHeight 
                    - this.submitHeight
                    - 6
            },
            submitPosBottom () {
                return 0 + (this.isAndroid 
                        ? this.weexAndroidHeightDiff
                        : 0)
            }
        },
        data: () => ({
            user: null,                                     // 用户信息
            orderSn: null,                                  // 订单号
            maxHeight: Utils.env.getPageHeight(),
            headerHeight: 82,
            submitHeight: 80,
            shortcutShow: false,
            orderInfo: {                                    // 订单信息

            },
            payTypeActive: null,                            // 支付类型
            isTriggerPayActive: false,                      // 是否触发默认支付事件
            loading: false,
            isSubmitPay: false,                             // 是否已正在执行提交支付
            payTypeInfo: {                                  // 支付方式信息

            },
            pay: {
                // bank: {
                //     title: '银行卡支付',
                //     items: [
                //         {
                //             tag: 'minsheng',
                //             name: '中国民生银行',
                //             text: '储蓄卡 (00001)',
                //             icon_url: 'https://storage.360buyimg.com/payment-assets/sdk/bank/CMBC.png'
                //         }
                //     ],
                //     is_more: true,
                //     more_text: '其它银行卡'
                // },
                other: {
                    title: '其它支付方式',
                    items: [
                        {
                            tag: 'weixin',
                            name: '微信支付',
                            text: '仅安装微信6.0.2 及以上版本客户端使用',
                            icon_url: 'pay/type/weixin.active.png'
                        },
                        {
                            tag: 'zhifubao',
                            name: '支付宝',
                            text: '仅安装支付宝6.0.2 及以上版本客户端使用',
                            icon_url: 'pay/type/zhifubao.active.png'
                        }
                    ],
                    is_more: false
                }
            }
        }),
        async beforeCreate () {
            this.user = await store.states('user')
            this.orderSn = this.queryParame('osn')
            if (!this.orderSn || !this.user) return this.jump('/', {pages: 3})
            let data = queryParames()
            // 如果是微信 AND 是微信授权回掉
            if (isWeiXin && data.code && data.state) {
                let { data: { payload: { info, code } }, status, ok} = await stream('app.!pays.wx-oauth', {
                    query: data
                })
                if (code === 200) {
                    this.payTypeActive = 'weixin'
                    this.isTriggerPayActive = true
                } else {
                    alert('微信授权失败，请重新授权！')
                }
            }
        },
        async created () {
            this.orderSn = this.queryParame('osn')
            let { data: { payload: { list: [ orderInfo ], code } }, status, ok} = await this.stream('app.!order.view', {
                query: {
                    osn: this.orderSn,
                    fields: ['order_id'
                            , 'order_sn'
                            , 'goods_amount'
                            , 'order_amount'
                            , 'order_status'
                            , 'add_time'].join(',')
                }
            })
            if (code != 200) return
            this.orderInfo = orderInfo
            //console.log('____orderInfo', orderInfo)
            //orderInfo
            //console.log('__osn', this.queryParame('osn'))
        },
        methods: {
            activeShortcut (val) {    // 响应快速选择工具点击事件
                this.shortcutShow = val
            },
            async activePayType ({ tag }) {
                this.loading = true
                if (this.payTypeActive == tag) return 
                this.payTypeActive = tag
                switch (tag) {
                    case 'weixin':
                        if (!this.isWeiXin) {
                            this.alert('只支持微信浏览器端授权登陆！')
                            break;
                        }
                        let openid = await this.getWeiXinOpenid()
                        if (openid === false) break;
                        this.payTypeInfo[this.payTypeActive] = {
                            openid
                        }
                        // 去微信支付 - 点击提交时支付
                        ///this.goWeiXinPay({ openid })
                        break;
                    case 'zhifubao':
                        // this.alert('支付宝支付开发中...')
                        this.getAlipayUrl()
                        break;
                    default: 
                        this.alert('只支持“支付宝”和“微信”支付！')
                }
                this.loading = false
            },
            // 获取微信绑定 ID
            async getWeiXinOpenid () {
                let { user_info: { openid } } = this.user
                if (!_.isEmpty(openid)) return openid
                let { data: { payload: { info 
                            , code } }
                                , status
                                , ok: userOk} = await this.stream('app.!common.!user.view', {
                    query: {
                        expand: ['bind'].join(','),
                        fields: ['id'].join(',')
                    }
                })
                if (code !== 200) {
                    this.alert('微信授权：请求服务端失败，请尝试刷新！')
                    return false
                }
                if (!_.isEmpty(info.bind) && info.bind.openid) {
                    return info.bind.openid
                }
                // 去微信授权绑定
                this.toBindWeiXinOpenid()
                return false
            }, 
            // 微信跳转
            async toBindWeiXinOpenid () {
                 let { data: { payload: { info, code } }
                                , status
                                , ok } = await this.stream('http://w.xinminghui.com/wechat/code-url', { //'app.!pays.wx-code-url'
                                    query: {
                                        // token: this.user.token,
                                        redirect_uri: '/pay.html',
                                        osn: this.orderSn
                                    }
                                })
                if (code !== 200) return false
                this.jumpHttp(info.code_url)
            },
            // 去微信支付
            async goWeiXinPay ({ openid }) {
                let { data: { payload: { info: { data }, code } }, status, ok} = await this.stream('app.!pays.index', {
                    query: {
                        pay_type: 'wxpay',
                        wx_trade_type: 'JSAPI',
                        //sign_type: '',
                        openid,
                        osn: this.orderSn,
                        // return_url: '/pay'
                    }
                })
                if (code !== 200) {
                    this.alert('网络异常！')
                    return
                }
                if (typeof WeixinJSBridge == "undefined"){  
                    if (document.addEventListener) {  
                        document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
                    } else if (document.attachEvent) {  
                        document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady) 
                        document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
                    }  
                } else {  
                    this.onBridgeReady(data)  
                }
            },
            // 微信浏览器支付绑定事件
            onBridgeReady (data) {  
                WeixinJSBridge.invoke('getBrandWCPayRequest'
                    , data
                    , (res) => {       
                        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg 将在用户支付成功后返回 ok，但并不保证它绝对可靠。  
                        switch (res.err_msg) {
                            case 'get_brand_wcpay_request:ok':      // 用户支付成功
                                this.jump('/pay-ok')
                                break;
                            case 'get_brand_wcpay_request:cancel':  // 用户取消支付
                                this.alert('您已取消微信支付！')
                                break;
                            default:        // 用户支付失败
                                this.alert('微信支付失败，请尝试重新支付！')
                        }
                    }  
                )
            },
            // 获取 alipay 支付 url
            async getAlipayUrl () {
                let { data: { payload: { info: { data }, code } }, status, ok} = await this.stream('app.!pays.index', {
                    query: {
                        pay_type: 'alipay',
                        // wx_trade_type: 'JSAPI',
                        ali_sign_type: 'MD5',
                        osn: this.orderSn,
                        // return_url: '/pay'
                    }
                })
                if (code !== 200) {
                    this.alert('网络异常！')
                    return
                }
                this.payTypeInfo[this.payTypeActive] = data
            },
            submitPay () {
                if (this.isSubmitPay) return
                this.loading = true
                this.isSubmitPay = true
                switch (this.payTypeActive) {
                    case 'weixin':
                        if (this.isWeiXin) {
                            this.goWeiXinPay(this.payTypeInfo[this.payTypeActive])
                            break;
                        }
                        this.alert('请在微信客户端打开！')
                        this.isSubmitPay = false
                        this.loading = false
                        break;
                    case 'zhifubao':
                        this.jumpHttp(this.payTypeInfo[this.payTypeActive])
                        break;
                    default:
                        this.isSubmitPay = false
                        this.loading = false
                        this.alert('请选择支付类型！')
                }
            } 
        }
    }
</script>
<style>
.pay {
    width: 750px;
    background-color: #f0f2f5;
}
.pay-body {
    width: 750px;
    position: relative;
    overflow: hidden;
}
.pay-header {
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
.pay-header-ios {
    border-bottom: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .05);
}
.pay-title {
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
.order-bar {
    height: 82px;
    padding: 0 25px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #f8f8f8;
    border-bottom: 2px solid #e3e5e8;
    margin-bottom: 40px;
}
.order-bar-right {
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
}
.order-bar-right-text {
    line-height: 82px;
    font-size: 30px;
    color: #232326;
}
.pay-total {
    flex-direction: row;
    justify-content: center;
    height: 82px;
    margin-left: 10px;
}
.pay-total-1 {
    line-height: 82px;
    font-size: 32px;
    color: #f23030;
}
.pay-total-2,
.pay-total-3 {
    line-height: 90px;
    font-size: 24px;
    color: #f23030;
}
.pay-submit {
    flex-direction: row;
    justify-content: center;
    height: 80px;
    background-color: #f23030;
}
.pay-submit-text {
    line-height: 80px;
    font-size: 32px;
    color: #ffffff;
}
</style>