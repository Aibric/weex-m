<template>
    <div>
        <div class="personal-edit-name">
            <input  type="text" 
                    placeholder="请输入姓名" 
                    class="personal-edit-input" 
                    :autofocus=true 
                    :value="name"
                    @input="changeName"/>
            <wxc-icon name="wrong" 
                      v-if="name"
                      class="personal-edit-cancel"
                      style="fontSize:28px"
                      @WxcIconClicked="resetName"></wxc-icon>
        </div>
        <text class="personal-edit-tip">4-20个字符，可由中英文、数字组成</text>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils,WxcIcon } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";

const dom = weex.requireModule("dom");

export default {
  components: { Utils,WxcIcon },
  mixins: [mixin],
  data: () => ({
      name:'',
  }),
  created() {
    this.name = this.queryParames().value;
  },
  mounted(){
     
  },
  methods: {
      resetName(){
          debugger
            this.name = '';
      },
      changeName(event){
          this.name = event.value
          this.$emit('editName',this.name)  
      }
  }
};
</script>
<style scoped>
.personal-edit-name{
    position: relative;
     height: 80px;
    background-color:#fff;
}
.personal-edit-input{
    height: 80px;
    line-height: 80px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 32px;
}
input.personal-edit-input{
    height: 80px;
    line-height: 80px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 32px;
}
.personal-edit-cancel{
    position: absolute;
    top: 30px;
    right:15px;
}
.personal-edit-tip{
    color:#B9BABC;
    font-size:32px;
    padding-top:20px;
    padding-bottom:20px;
    padding-left: 20px;
    padding-right: 20px;
}
</style>