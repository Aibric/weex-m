<template>
    <div class="search-main">
        <div class="search-box"
             @click="jump('/category/history',{pages:0})">
            <image class="search-logo"
                :src="imgPath(searchs.logo_url || logo_url)"></image>
            <div class="search-icon-box">
                <image class="search-icon"
                    :src="imgPath(searchs.search_icon || search_icon)"></image>
            </div>
            <input class="search-text"
                type="text"
                :placeholder="searchs.placeholder"
                autocomplete="off"
                v-model="searchs.value" />
        </div>
        <!-- <div class="search-login">
            <text v-if="!user"
                class="search-login-text"
                @click="jump('login')">登陆</text>
            <image v-else
                class="search-login-icon"
                :src="imgPath('user.png')"></image>
        </div> -->
    </div>
</template>
<script>
    import { WxcSearchbar
            , WxcIcon } from 'weex-ui';
    import { isObject } from 'lodash'

    import mixin from "~/mixins"
    import filters from "~/filters"
    
    const modal = weex.requireModule('modal');

    export default {
        props: ['user', 'search'],
        components: { 
            WxcSearchbar,
            WxcIcon
        },
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
            searchs () {
                return isObject(this.search) 
                    ? this.search 
                    : {}
            }
        },
        data: () => ({
            logo_url: 'logo.jpg',
            search_icon: 'search-icon.png'
        })
    }
</script>
<style>
.search-main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 750px;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, .7),rgba(0, 0, 0, .01));
}
.search-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 1;
    flex: 1;
    height: 70px;
    padding-left: 30px;
    padding-right: 20px;
    background-color: #ffffff;
    border-radius: 40px;
}
.search-logo {
    width: 50px;
    height: 50px;
}
.search-icon-box {
    margin-left: 10px;
}
.search-icon {
    width: 40px;
    height: 40px;
}
.search-text {
    flex: 1;
    height: 50px;
    margin-left: 10px;
    font-size: 34px;
    color: #666666;
    outline: none;
}
.search-login {
    margin-left: 18px;
}
.search-login-text {
    font-size: 32px;
    color: #ffffff;
}
.search-login-icon {
    width: 50px;
    height: 50px;
}
</style>
