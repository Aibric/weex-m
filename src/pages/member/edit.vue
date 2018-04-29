<template>
    <div class="personal-edit" :style="{height:maxHeight+'px'}">
        <top-pages :topInfo="topInfo"
                   :newName ="newName"></top-pages>
        <sex-pages v-if="this.queryParames().edit === 'sex'"></sex-pages>
        <name-pages v-else
                    v-on:editName="editName"></name-pages>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils} from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import topPages from "~/components/member/personal/top"
import sexPages from "~/components/member/personal/edit/sex"
import namePages from "~/components/member/personal/edit/name"

const dom = weex.requireModule("dom");

export default {
  components: { Utils,topPages,sexPages,namePages },
  mixins: [mixin],
  data: () => ({
    maxHeight: Utils.env.getPageHeight(),
    topInfo:{
          title:'修改个人信息',
          back:'/member/personal',
          icon:{
              show:true,
          },
    },
    newName:'',
  }),
  created() {
    if(this.queryParames().edit === 'sex'){
        this.$set(this.topInfo,'title','修改性别');
        this.$set(this.topInfo.icon,'show',false);
    }else{
        this.$set(this.topInfo,'title','修改姓名');
        this.$set(this.topInfo.icon,'show',true);
    }
  },
  mounted(){
     
  },
  methods: {
   editName(val){
       this.newName = val;
   }
  }
};
</script>
<style scoped>
.personal-edit{
    width: 750px;
    background-color:#F3F4F6
}

</style>