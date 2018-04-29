<template>
    <div class="personal"
         :style="{height:maxHeight+'px'}">
        <top-pages :topInfo="topInfo"
                   :newName="newName"></top-pages>
        <info-pages></info-pages>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils, } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import topPages from "~/components/member/personal/top"
import infoPages from "~/components/member/personal/info"


const dom = weex.requireModule("dom");

export default {
  components: { Utils,topPages,infoPages},
  mixins: [mixin],
  data: () => ({
      maxHeight: Utils.env.getPageHeight(),
      topInfo:{
          title:'个人信息',
          back:'/',
          icon:{
              show:false,
          },
      },
      newName:'',
  }),
  created() {
   
  },
  mounted(){
     
  },
  methods: {
  }
};
</script>
<style scoped>
.personal{
    width: 750px;
    background-color:#F3F4F6
}

</style>