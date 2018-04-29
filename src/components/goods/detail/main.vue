<template>
        <div class="goods-detail-container">
            <web :src="goodsDesc" 
                 style="width:750px;"
                 :style="{height:maxHeight+'px'}"></web>
        </div>
</template>
<script>
import Vue from "vue";

import { Utils } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

const dom = weex.requireModule("dom");

export default {
  props:['goodsDesc'],
  components: { Utils },
  mixins: [mixin],
  data: () => ({
      maxHeight:Utils.env.getPageHeight()-160,
  }),
  created() {
    
  },
  methods: {
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
.goods-detail-container{
    border-top-style:solid;
    border-top-color:#e5e5e5;
    border-top-width:1px;
    width:750px;
    background-color: #fff;
    padding-left: 25px;
    padding-right:25px;
    align-items: center;
}
</style>