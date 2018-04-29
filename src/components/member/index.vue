<template>
    <scroller class="member" :style="{height:maxHeight+'px'}">
        <top-pages v-on:activeShortcut="activeShortcut"
            :user.sync="userInfo"></top-pages>
        <main-pages :user.sync="userInfo"></main-pages>
        <shortcut-pages :shortcutShow="shortcutShow"
            position="absolute"
            v-on:activeShortcut="activeShortcut" 
            v-if="shortcutShow"></shortcut-pages>
    </scroller>
</template>
<script>
import { Utils } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import shortcutPages from "~/components/common/shortcut";
import topPages from "./top";
import mainPages from "./lists";

const dom = weex.requireModule("dom");
const modal = weex.requireModule("modal");
const animation = weex.requireModule("animation");

export default {
    props:['maxHeight', 'user'],
    components: {
        Utils,
        topPages,
        mainPages,
        shortcutPages
    },
    mixins: [mixin],
    data: () => ({
        shortcutShow:false,
        userInfo: null
    }),
    created() {
        this.userInfo = this.user
    },
    watch: {
        user (val) {
            this.userInfo = val
        },
        userInfo (val) {
            this.$emit('update:user', val)
        }
    },
    mounted() {},
    methods: {
        activeShortcut(val) {
            //响应快速选择工具点击事件
            this.shortcutShow = val;
        },
    }
};
</script>
<style>
.member {
    width: 750px;
    background-color: #f2f3f4;
    padding-bottom:30px;
}

</style>