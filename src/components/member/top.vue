<template>
    <div class="member-top" ref="memberTop">
        <image :src="imgPath('/member/top_bg.png')" 
                size="stretch" 
                class="member-top-bg" />
        <div class="member-top-main">
            <div class="member-top-set">
                <!-- <image class="member-top-img" 
                       :src="imgPath('member/set.png')"
                       @click="setClick" /> -->
                <image class="member-top-img" 
                       :src="imgPath('/member/short.png')" 
                       @click="activeClick"/>
            </div>
            <div class="member-top-user">
                <div class="member-top-users" 
                     ref="memberUser"
                      @click="setClick">
                    <div class="member-users-bg">
                        <image class="member-users-img" 
                               v-if="user" 
                               :src="imgPath(user.user_info.user_avatar)" />
                        <image class="member-users-img" 
                               v-else 
                               :src="imgPath('/member/user.png')" />
                    </div>
                    <text class="member-top-white member-top-fontb"
                          v-if="user">{{user.user_info.username}}</text>
                    <text class="member-top-white member-top-fontb"
                          v-else >点击登录</text>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import store from "~/store";

const dom = weex.requireModule("dom");
const animation = weex.requireModule("animation");

export default {
    props: ['user'],
    components: {
        Utils,
    },
    mixins: [mixin],
    data: () => ({
        colors: [
            "#ED5564",
            "#FB6E52",
            "#FFCE55",
            "#A0D468",
            "#48CFAE",
            "#4FC0E8",
            "#5D9CEC",
            "#AC92ED",
            "#EC87BF",
            "#ED5564"
        ]
    }),
    created() {
    },
    mounted() {
        this.change();
        this.move();
    },
    methods: {
        change() {
            let index = 0;
            let self = this;
            let memberTop = self.$refs.memberTop;
            setInterval(function() {
                index++;
                if (index === 10) {
                    index = 0;
                }
                animation.transition(
                    memberTop,
                    {
                        styles: {
                            backgroundColor: self.colors[index]
                        },
                        duration: 800, //ms
                        timingFunction: "ease",
                        delay: 0 //ms
                    },
                    function() {
                        // modal.toast({ message: 'animation finished.' })
                    }
                );
            }, 2000);
        },
        move() {
            let memberUser = this.$refs.memberUser;
            animation.transition(
                memberUser,
                {
                    styles: {
                        opacity: 1
                    },
                    duration: 1000, //ms
                    timingFunction: "linear",
                    delay: 100 //ms
                },
                function() {}
            );
        },
        activeClick(){
            this.$emit('activeShortcut',true)
        },
        setClick(){
            if(this.user){
                
            }else{
                this.jump('/login')
            }
        }
    }
};
</script>
<style scoped>
.member-top {
    width: 750px;
    height: 300px;
    background-color: #ed5564;
    position: relative;
}
.member-top-bg {
    width: 750px;
    height: 300px;
}
.member-top-main {
    position: absolute;
    top: 0;
    left: 0;
    width: 750px;
    height:300px;
}
.member-top-set {
    width: 750px;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 86px;
    line-height: 86px;
    padding-left: 15px;
    padding-right: 35px;
}
.member-top-img {
    width: 45px;
    height: 45px;
}
.member-top-user {
    width: 750px;
    height: 200px;
}
.member-top-users {
    width: 750px;
    align-items: center;
    opacity: 0;
}
.member-users-bg {
    width: 120px;
    height: 120px;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 178px;
    border-top-right-radius: 178px;
    border-bottom-left-radius: 178px;
    border-bottom-right-radius: 178px;
    background-color: rgba(0, 0, 0, 0.5);
}
.member-users-img {
    width: 120px;
    height: 120px;
    border-top-left-radius: 120px;
    border-top-right-radius: 120px;
    border-bottom-left-radius: 120px;
    border-bottom-right-radius: 120px;
}
.member-top-white {
    padding-top: 10px;
    color: #ffffff;
}
.member-top-fontb {
    font-size: 32px;
}
.member-top-fonts {
    font-size: 28px;
}


</style>