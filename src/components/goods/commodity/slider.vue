<template>
        <wxc-ep-slider :slider-id="autoSliderId"
                       :card-length='sliderImg.length'
                       :interval="2000"
                       ref="wxc-ep-slider"
                       :card-s="cardSize"
                       :auto-play="true"
                       :select-index="0"
                       :container-s="containers"
                       @wxcEpSliderCurrentIndexSelected="wxcEpSliderCurrentIndexSelected">
            <wxc-pan-item v-for="(v,index) in sliderImg"
                          :key="index"
                          :ext-id="index"
                          class="slider"
                          url=""
                          @wxcPanItemPan="wxcPanItemPan"
                          @wxcPanItemClicked="wxcPanItemClicked"
                          :slot="`card${index}_${autoSliderId}`"
                          :accessible="true"
                          :aria-label="`这里是第${index + 1}个滑块`">
                          <image class="slider-img" :src="v" @load="onImageLoad"/>
                          <div class="slider-page-o"><text class="slider-page">{{index + 1}}/{{sliderImg.length}}</text></div>
            </wxc-pan-item>
        </wxc-ep-slider>
</template>
<script>
import {   Utils, 
           WxcEpSlider, 
           WxcPanItem, 
           BindEnv } from "weex-ui";

const modal = weex.requireModule("modal");

export default {
  props:['sliderImg'],
  components: { Utils, 
                WxcEpSlider, 
                WxcPanItem, 
                BindEnv },
  data: () => ({
    sliderId: 1,
    autoSliderId: 2,
    cardLength: 5,
    containers:{
        'position': 'relative',
        'width': 750,
        'height': 750
    },
    cardSize: {
      width: 750,
      height: 750,
      spacing: 0,
      scale: 0.8
    }
  }),
  created() {},
  methods: {
    wxcEpSliderCurrentIndexSelected(e) {
     
    },
    wxcPanItemPan(e) {
      if (BindEnv.supportsEBForAndroid()) {
        this.$refs["wxc-ep-slider"].clearAutoPlay();
        this.$refs["wxc-ep-slider"].bindExp(e.element);
      }
    },
    wxcPanItemClicked (e) {
        modal.toast({
          message: e.extId,
          duration: 1
        })
    },
    onImageLoad(event){
       if(event.success){
         let height = (350 * event.size.naturalHeight) / event.size.naturalWidth;

         return  event.path[0].style.height = height+'px'
       }
    }
  }
};
</script>
<style scoped>
.slider {
    width: 750px;
    height: 750px;
    background-color: #fff;
    align-items: center;
    justify-content: center;
}
.slider-img{
    margin-left:55px;
    width:640px;
    height:640px;
}
.slider-page-o{
    width:750px;
    align-items: flex-end;
    padding-right:15px;
}
.slider-page {
    width: 50px;
    height: 50px;
    font-size: 20px;
    text-align: center;
    line-height: 50px;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    color: #fff;
    background-color: rgba(0,0,0,0.15);
}
</style>
