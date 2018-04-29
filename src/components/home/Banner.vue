<template>
    <wxc-ep-slider class="banner-box" 
            ref="wxc-ep-slider" 
            :slider-id="sliderId"
            :card-length='cardLength'
            :select-index="2"
            :container-s="containerSize"
            :card-s="cardSize"
            :auto-play="true"
            @wxcEpSliderCurrentIndexSelected="wxcEpSliderCurrentIndexSelected">
            <image v-for="(val,key) in getBrands"
                :key="key"
                :slot="`card${key}_${sliderId}`"
                :class="['banner-item-image', 'slider',`slider${key}`]"
                :src="val.image_url"></image>
    </wxc-ep-slider>   
</template>
<script>
    import { WxcEpSlider } from 'weex-ui'

    export default {
        // props: ['brands'],
        components: {
            WxcEpSlider
        },
        computed: {
            getBrands () {
                return this.brands || []
            }
        },
        data: () => ({
            sliderId: 1032,
            cardLength: 5,
            containerSize: {
                position: 'relative',
                width: 750,
                height: 436
            },
            cardSize: {
                width: 750,
                height: 436,
                spacing: 0,
                scale: 0.8
            },
            brands: [
                {
                    url: 'http://xinminghui.com',
                    image_url: 'https://m.360buyimg.com/mobilecms/s1125x549_jfs/t18328/296/1077193906/141943/c7ea5a5c/5abdb70dN1eba00ef.jpg!cr_1125x549_0_72!q70.jpg'
                },
                {
                    url: '',
                    image_url: 'https://img1.360buyimg.com/da/jfs/t13237/260/2412553113/222934/7cd5f879/5aba0a46Nf75957d1.jpg!cr_1125x549_0_72'
                },
                {
                    url: '',
                    image_url: 'https://img1.360buyimg.com/da/s750x366_jfs/t16177/242/2623645945/81926/345ebfd5/5ab7b992N2222c139.jpg!cr_1125x549_0_72'
                },
                {
                    url: '',
                    image_url: 'https://m.360buyimg.com/mobilecms/s750x366_jfs/t18436/226/1174662633/273971/65aa04f7/5abc9f9dNa390ea86.jpg!cr_1125x549_0_72!q70.jpg'
                }
            ]
        }),
        mounted () {
            this.$refs['wxc-ep-slider'].rebind();
        },
        methods: {
            wxcEpSliderCurrentIndexSelected (e) {
                const index = e.currentIndex;
                console.log(index);
            },
            logout () {
                store.commit('SET_USER', null)
            }
        }
    }
</script>
<style>
.banner-box {
    width: 750px;
    height: 436px;
    overflow: hidden;
}
.banner-item-image {
    width: 750px;
    height: 436px;
}
</style>

