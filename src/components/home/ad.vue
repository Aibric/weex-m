<template>
    <div class="ad-slider">
        <div v-for="(val, key) in ads"
            :key="key"
            class="ad-slider-item current">
            <image class="ad-slider-image"
                :src="imgPath(val.img_url)"
                :style="{
                    width: `${val.width || adImgWidth}`,
                    height: `${val.height || adImgHeight}px`
                }"
                @click="jumpWeb(val.href)"></image>    
        </div>
    </div>
</template>
<script>
    import mixin from "~/mixins"
    import filters from "~/filters"

    export default {
        props: ['ads'],
        mixins: [mixin],
        filters: {
            ...filters
        },
        data: () => ({
            adImgWidth: 750,
            adImgHeight: 230
        })
    }
</script>
<style>
.ad-slider {

}
.ad-slider-image {
    width: 750px;
}
</style>
