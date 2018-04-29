<template>
    <div class="register"
         :style="{height:maxHeight+'px'}">
        <div class="register-header">
            <wxc-icon class="register-back"
                name="back"
                size="medium"
                :icon-style="{fontSize: '60px'}" 
                @wxcIconClicked="jump('index')"></wxc-icon>
            <text class="register-title">新明辉商城注册</text>
            <text class="register" @click="jump('register')">登录</text>
        </div>

        <div class="register-container">
            <div class="register-box">
                <text class="register-label">手机号</text>
                <div class="register-inner">
                     <input class="register-input login-password"
                            type="number"
                            :value="formData.username"
                            @input="getData('username',$event)" />
                    <image  class="icon-empty"
                            :src="imgPath('/login/icon-empty.png')"
                            v-if="formData.username"
                            @click="empty('username')"/>
                </div>
            </div>
            <div class="register-box">
                <text class="register-label">验证码</text>
                <div class="register-inner">
                     <input class="register-input login-code"
                            type="number"
                            :value="formData.smsCode"
                            @input="getData('smsCode',$event)"/>
                     <text class="register-code"
                           v-if="formData.username"
                           @click="getCode(formData.username)">获取验证码</text>
                </div>
            </div>
            <div class="register-box">
                <text class="register-label">密码</text>
                <div class="register-inner">
                     <input class="register-input login-password"
                             :type=" showPass? 'text':'password'"
                            :value="formData.password"
                            @input="getData('password',$event)" />
                    <image  class="show-password"
                            resize="stretch"
                            :src="imgPath(['login', showPass ? 'show_password.png' : 'hide_password.png'].join('/'))"
                            @click="showPass = !showPass"/>
                </div>
            </div>
            <div class="register-box">
                <text class="register-label">确认密码</text>
                <div class="register-inner">
                     <input class="register-input login-password"
                            :type=" showRe? 'text':'password'"
                            :value="rePassword"
                            @input="getRepass" />
                    <image  class="show-password"
                            resize="stretch"
                            :src="imgPath(['login', showRe ? 'show_password.png' : 'hide_password.png'].join('/'))"
                            @click="showRe = !showRe"/>
                </div>
                <text class="register-error"
                      v-if="erRepass">您输入的密码不一致</text>
            </div>
        </div>
        <div class="register-submit-box"
             v-if="submitActived"
              @click="register">
             <text class="register-submit  submit-actived">注 册</text>
        </div>
        <div class="register-submit-box"
             v-else>
             <text class="register-submit">注 册</text>
        </div>
        <div class="agreement-tips">
            <text class="agreement-tips-text">注册即代表您已同意</text>
            <text class="agreement-tips-title">新明辉隐私政策</text>
        </div>
        <wxc-dialog title=""
                :content="RegisterContent"
                :show="show"
                :single="true"
                @wxcDialogConfirmBtnClicked="wxcShowClicked">
        </wxc-dialog>
         <wxc-dialog title=""
                :content="smsContent"
                :show="showCode"
                :single="true"
                @wxcDialogConfirmBtnClicked="wxcSmsClicked">
        </wxc-dialog>
    </div>
</template>
<script>
    import { WxcIcon,Utils,WxcDialog  } from "weex-ui"
    import _ from 'lodash'

    import mixin from "~/mixins"
    import filters from "~/filters"
    import helper from "~/utils/helper"

    import store from '~/store/index'

    const modal = weex.requireModule('modal')

    const stream2 = weex.requireModule('stream');

    export default {
        components: {
            WxcIcon,
            Utils,
            WxcDialog
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        data: () => ({
            show: false,
            showCode:false,
            isChecked: false,
            smsContent:'',//获取手机验证码提示信息
            RegisterContent:'',//注册提示信息
            maxHeight:Utils.env.getPageHeight()-100,
            formData:{
                username:'',
                password:'',
                smsCode:'',
            },
            rePassword:'',
            mobile:'',
            showPass:false,
            showRe:false,
            submitActived:false,
            erRepass:false,
        }),
        methods: {
            getRepass(event){
                this.rePassword = event.value;
                this.erRepass = (this.formData.password !== this.rePassword) ? true : false;
                this.submitActived = !_.isEmpty(this.formData.username) && !_.isEmpty(this.formData.password) && !_.isEmpty(this.formData.smsCode) && !this.erRepass
           },
            getData(event,$event){
                this.formData[event] = $event.value;
                console.log(!_.isEmpty(this.formData.username))
                console.log(!_.isEmpty(this.formData.password))
                console.log(!_.isEmpty(this.formData.smsCode))
                console.log(this.erRepass)
                this.submitActived = !_.isEmpty(this.formData.username) && !_.isEmpty(this.formData.password) && !_.isEmpty(this.formData.smsCode) && !this.erRepass
            },
            empty(event){
               this.formData[event] = '';
               if(event === 'password'){
                    this.rePassword = '';
                }
            },
            async getCode(mobile){
                let self = this;
                let {data: {payload:{code,info}}} = await self.stream("app.!smscode.send-sms",{
                     query:{
                         mobile:mobile,
                     }
                 });
                 if(code === 200){
                    modal.toast({ 
                        message:info,
                        duration: 0.8
                    })
                 }else{
                     this.smsContent = info;
                     this.showCode = true;
                 }
            },
            async register(){
                let self = this;
                let {data: {payload:{code,info}}} = await self.stream("app.!register.register",{
                     body: self.formData
                 });
                 if(code === 400){
                     this.show = true;
                     this.RegisterContent = info
                 }else if(code === 200){
                    modal.toast({ 
                        message: info,
                        duration: 0.8
                    }),
                    self.jump("login");
                 }
            },
            registerPop(){
                this.show = true;
                this.RegisterContent = "请完善您的注册信息！"
            },
            wxcShowClicked () {
            //此处必须设置，组件为无状态组件，自己管理
              this.show = false;
            },
            wxcSmsClicked () {
            //此处必须设置，组件为无状态组件，自己管理
              this.showCode = false;
            },
        }
       
    }
</script>
<style>
.register-header {
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
.register-title {
    font-size: 42px;
    color: #616161;
}
.register-container{
    padding-left: 35px;
    padding-right: 35px;
}
.register-box{
    flex:1;
    height:120px;
    line-height: 120px;
    flex-direction: row;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #d7d7d7;
    position: relative;
}
.register-label{
    width: 160px;
    height:120px;
    text-align: left;
    line-height: 120px;
    font-size: 38px;
    color: #555555;
}
.register-inner{
    flex: 1;
    flex-direction: row;
    height:120px;
    line-height: 120px;
    align-items: center;
}
.register-input{
    flex:1;
    font-size: 34px;
    color: #555555;
}
.icon-empty {
    width: 38px;
    height: 38px;
    margin-left: 3px;
}
figure.icon-empty {
    width: 38px;
    height: 38px;
    margin-left: 3px;
}
.show-password {
    width: 58px;
    height: 52px;
}
figure.show-password {
    width: 58px;
    height: 52px;
}
.register-code{
    color: #f7f2f2;
    background-color: #ccc;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}
p.register-code{
    color: #f7f2f2;
    background-color: #ccc;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}
.register-error{
    color:#d60008;
    font-size: 12px;
    position: absolute;
    bottom: -34px;
    left:160px;
}
.register-submit-box {
    width:750px;
    margin-top: 70px;
    height: 105px;
    border-radius: 3px;
}
.register-submit {
    flex:1;
    margin-left: 35px;
    margin-right: 35px;
    line-height: 105px;
    text-align: center;
    font-size: 40px;
    color: #848689;
    background-color: #eeeeee;
}
p.register-submit {
    flex:1;
    margin-left: 35px;
    margin-right: 35px;
    line-height: 105px;
    text-align: center;
    font-size: 40px;
    color: #848689;
    background-color: #eeeeee;
}
.submit-actived {
    background-color: #d60008;
    color: #ffffff;
}
p.submit-actived {
    background-color: #d60008;
    color: #ffffff;
}
.agreement-tips {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 60px;
    margin-top: 25px;
}
.agreement-tips-text {
    font-size: 32px;
    color: #555555;
}
.agreement-tips-title {
    font-size: 32px;
    color: #555555;
}
.agreement-tips-title {
    text-decoration: underline;
}
</style>