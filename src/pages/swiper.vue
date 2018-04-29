<template>
    <div class="swiper">
         <div class="swiper-inner"  ref="swiper">
            <div class="box" 
                v-for="(item,index) in imagesData" 
                :key="item" 
                @swipe="swiper">
                <text>{{index}}</text>
                <image :src="item" 
                        @load="onImageLoad"
                        :style="{height:maxHieght+'px'}"/>
            </div>
         </div>
        
    </div>
</template>
<script>
import Vue from "vue";
import { Utils,WxcIcon, WxcButton } from "weex-ui";

import mixin from "~/mixins";

const dom = weex.requireModule("dom");
const animation = weex.requireModule("animation");
const modal = weex.requireModule("modal");

export default {
    mixins: [mixin],
    data: () => ({
        imagesData: [
            "http://i.xinminghui.com/goods/201708/thumb_img/201708300401413.jpg",
            "http://i.xinminghui.com/goods/201606/goods_img/276_P_1466490512345.jpg",
            "http://i.xinminghui.com/goods/201606/goods_img/276_P_1466490512885.jpg",
            "http://i.xinminghui.com/goods/201606/goods_img/276_P_1466490512916.jpg"
        ],
        pages:0,
        maxPages:0,
        maxHieght:Utils.env.getPageHeight()/2,
    }),
    created() {
        this.maxPages = this.imagesData.length;
    },
    methods: {
        swiper(e) {
            if (e.direction === "left") {
                this.pages = this.pages+1;
                if(this.pages >= this.maxPages){
                    this.pages = 0
                }
            } else if (e.direction === "right") {
                 this.pages = this.pages-1;
                if(this.pages < 0){
                    this.pages = this.maxPages-1
                }
            }
            this.move();
        },
        move() {
            let self = this;
            let angle = 750;
            animation.transition(
               self.$refs.swiper,
                {
                    styles: {
                        transform: "translateX(-"+angle*self.pages + "px)",
                        transformOrigin: "center center"
                    },
                    duration: 800, //ms
                    timingFunction: "ease",
                    delay: 0 //ms
                },
                function() {
                    //modal.toast({ message: "animation finished." });
                }
            );

            //    let eleMent = this.$refs.region;
            // let eleX =  ele * 750;
            // this.wwwww = eleX
            // animation.transition(eleMent, {
            //   styles: {
            //     transform: 'translateX(-'+eleX+'px)',
            //     transformOrigin: 'center center'
            //   },
            //   duration: 800, //ms
            //   timingFunction: 'ease',
            //   delay: 0 //ms
            // }, function () {
            //   //modal.toast({ message: 'animation finished.' })
            // })
        },
        onImageLoad(event){
            let self = this;
            if(event.success){
                let width = (event.size.naturalWidth/event.size.naturalHeight)*self.maxHieght
                return  event.path[0].style.width =  width +'px'
            }
        }
    }
};
</script>
<style scoped>
.swiper {
    width: 750px;
    height: 400px;
}
.swiper-inner{
    width: 3000px;
    flex-direction: row;
}
.box {
    width: 750px;
    height: 400px;
    border:solid 1px red;
}
.box-img {
    width: 750px;
    height: 400px;
}
</style>