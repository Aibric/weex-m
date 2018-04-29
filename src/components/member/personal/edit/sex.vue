<template>
    <wxc-radio :list="list"
                :config="config"
                @wxcRadioListChecked="wxcRadioListChecked"></wxc-radio>
</template>
<script>
import Vue from "vue";

import { Utils,WxcRadio } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

import store from '~/store'

const modal = weex.requireModule("modal");
const dom = weex.requireModule("dom");

export default {
  components: { Utils,WxcRadio },
  mixins: [mixin],
  data: () => ({
    user: null,
    list: [
      { title: '先生', value: 1, checked: false},
      { title: '女士', value: 2, checked: false },
      { title: '保密', value: 3, checked: false},
    ],
    config:{
        checkedIcon:'/src/static/images/member/select.png',
        checkedColor: '#D60008'
    },
    checkedInfo: { title: '选项2', value: 2, oldIndex: -1, index: 1 }
  }),
  async created() {
    this.list.map(item =>{
        if(item.title === this.queryParames().value){
            return item.checked = true;
        }
    })
  },
  mounted(){
     
  },
  methods: {
    async wxcRadioListChecked (e) {
        this.checkedInfo = e;
        let {data: {payload},status,ok} = await this.stream("app.!member.update", {
            body:{
                C_sex: this.checkedInfo.title
            }
        })
        if (payload.code === 200) {
            store.commit('SET_USER_SEX',this.checkedInfo.title)
            modal.toast({
                    message: payload.message,
                    duration: 0.8
            });

           this.jump('/member/personal');
        }
      }
  }
};
</script>
<style scoped>


</style>