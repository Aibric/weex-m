<template>
    <div class="address">
        <top-pages :topInfo="topInfo" 
                    ref="header"></top-pages>
        <edit-pages :maxHeight="maxHeight"></edit-pages>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils, } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import topPages from "~/components/member/address/top"
import editPages from "~/components/member/address/edit"

const dom = weex.requireModule("dom");

export default {
  components: { Utils,topPages,editPages},
  mixins: [mixin],
  data: () => ({
      pageHeight: Utils.env.getPageHeight(),
      topInfo:{
          title:'',
          back:'',
      },
      maxHeight:0,
      addressData:{},
  }),
  created() {
    this.$set(this.topInfo,'title',this.queryParames().title);
    this.$set(this.topInfo,'back',this.queryParames().path);
  },
  mounted(){
      this.maxHeight = this.pageHeight - 100;
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