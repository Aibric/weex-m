<template>
    <div class="login">
        <div class="login-header">
            <wxc-icon class="login-back"
                name="back"
                size="medium"
                :icon-style="{fontSize: '60px'}" 
                @wxcIconClicked="jump('index')"></wxc-icon>
            <text class="login-title">新明辉商城登陆</text>
            <text class="register" @click="jump('register')">注册</text>
        </div>
        <div class="login-page">
            <div class="input-container">
                <text class="input-label">账号</text>
                <div class="login-input-box">
                    <input class="login-input login-username"
                        type="text"
                        placeholder="用户名/邮箱/已验证手机"
                        @focus="empty.name = true"
                        @blur="empty.name = false"
                        @input="changeVal()"
                        v-model="formData.username" />
                    <image v-if="empty.name"
                        class="icon-empty"
                        :src="imgPath('login/icon-empty.png')"
                        @click="emptyVal('username')"></image>
                </div>
            </div>
            <div class="input-container">
                <text class="input-label">密码</text>
                <div class="login-input-box">
                    <input class="login-input login-password"
                        :type="showPass ? 'text' : 'password'"
                        placeholder="请输入密码"
                        @focus="empty.pass = true"
                        @blur="empty.pass = false"
                        @input="changeVal()"
                        v-model="formData.password" />
                    <image v-if="empty.pass"
                        class="icon-empty"
                        :src="imgPath('login/icon-empty.png')"
                        @click="emptyVal('password')"></image>
                    <div class="show-password-box">
                        <image class="show-password"
                            resize="stretch"
                            :src="imgPath(['login', showPass ? 'show_password.png' : 'hide_password.png'].join('/'))"
                            @click="showPassword()"></image>
                    </div>
                </div>
            </div>
            <div :class="['login-submit-box', submitActived ? 'submit-actived' : '']"
                @click="submit()">
                <text :class="['login-submit', submitActived ? 'submit-actived' : '']">登 录</text>
            </div>
            <div class="login-quick-nav">
                <text class="login-quick-font login-quick-reg">手机快速注册</text>
                <text class="login-quick-font login-find-pwd">忘记密码</text>
            </div>
        </div>
        <div class="login-quick">
            <div class="login-quick-qq">
                <image class="login-quick-icon"
                    :src="imgPath('login/qq.png')"></image>
            </div>
            <div class="login-quick-wechat">
                <image class="login-quick-icon"
                    :src="imgPath('login/we-chat.png')"></image>
            </div>
        </div>
        <div class="agreement-tips">
            <text class="agreement-tips-text">登陆即代表您已同意</text>
            <text class="agreement-tips-title">新明辉隐私政策</text>
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

    const modal = weex.requireModule('modal')

    const stream2 = weex.requireModule('stream');

    export default {
        components: {
            WxcIcon
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        data: () => ({
            showPass: false,
            empty: {
                name: false,
                pass: false
            },
            formData: {
                username: '',
                password: ''
            },
            submitActived: false
        }),
        methods: {
            showPassword() {
                this.showPass = !this.showPass
            },
            emptyVal(input) {
                this.formData[input] = ''
            },
            changeVal() {
                this.submitActived = !_.isEmpty(this.formData.username) && !_.isEmpty(this.formData.password)
            },
            async submit() {
                if (!this.submitActived) return
                let { payload: { code } } = await store.dispatch('login', this.formData)
                if (code == 200) {
                    this.submitActived = false
                    setTimeout (() => { this.jump('/') }, 1000)
                }
            }
        }
    }
</script>
<style>
.login-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    padding-right: 20px;
    background-color: #f9f9f9;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #bbbbbb;
}
.login-title {
    font-size: 42px;
    color: #616161;
}
.register {
    font-size: 38px;
    color: #ed5564;
}
.login-page {
    padding-left: 35px;
    padding-right: 35px;
}
.input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 120px;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #d7d7d7;
}
.input-label {
    width: 150px;
    font-size: 38px;
    color: #555555;
}
.login-input-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    height: 120px;
    padding-right: 15px;
}
.login-input {
    flex: 1;
    height: 70px;
    line-height: 70px;
    font-size: 34px;
    placeholder-color: #999999;
    color: #555555;
}
.icon-empty {
    width: 38px;
    height: 38px;
}
.show-password-box {
    padding-top: 4px;
    padding-left: 15px;
}
.show-password {
    width: 58px;
    height: 52px;
}
.login-submit-box {
    margin-top: 70px;
    height: 105px;
    background-color: #eeeeee;
    border-radius: 3px;
}
.login-submit {
    line-height: 105px;
    text-align: center;
    font-size: 40px;
    color: #848689;
}
.submit-actived {
    background-color: #f23030;
    color: #ffffff;
}
.login-quick-nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 120px;
}
.login-quick-font {
    font-size: 32px;
    color: #676767;
}
.login-quick {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 120px;
}
.login-quick-icon {
    width: 80px;
    height: 80px;
}
.login-quick-qq,
.login-quick-wechat {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 98px;
    height: 98px;
    border-radius: 49px;
    border-width: 2px;
    border-style: solid;
}
.login-quick-qq {
    border-color: #1f9be6;
}
.login-quick-wechat {
    border-color: #3ab12d;
}
.agreement-tips {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 60px;
    margin-top: 25px;
}
.agreement-tips-text,
.agreement-tips-title {
    font-size: 32px;
    color: #555555;
}
.agreement-tips-title {
    text-decoration: underline;
}
</style>