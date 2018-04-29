<template>
    <div class="address">
        <top-pages :topInfo="topInfo" 
                    ref="header"></top-pages>
        <list-pages :scollerHeight="scollerHeight"></list-pages>
        <footer-pages ref="footer"></footer-pages>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils, } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import topPages from "~/components/member/address/top"
import listPages from "~/components/member/address/list"
import footerPages from "~/components/member/address/footer"

const dom = weex.requireModule("dom");

export default {
  components: { Utils,topPages,listPages,footerPages},
  mixins: [mixin],
  data: () => ({
      maxHeight: Utils.env.getPageHeight(),
      topInfo:{
          title:'收货地址管理',
          back:'/',
      },
      scollerHeight:0,
      addressList:[],
  }),
  created() {
     
  },
  mounted(){
      this.scollerHeight = this.maxHeight - 200;
  },
  methods: {
     
  }
};
</script>
<style scoped>
.address{
    width: 750px;
    background-color:#F3F4F6
}

</style>