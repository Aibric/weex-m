<template>
    <div class="order-detail-status">
        <div class="order-ds-box">
            <image :src="imgPath('/order/status/wait_s.png')"
                    v-if="status.id === 0"
                    class="order-ds-icon"/>
             <image :src="imgPath('/order/status/done.png')"
                    v-else-if="status.id === 1 || status.id === 2"
                    class="order-ds-icon"/>
             <image :src="imgPath('/order/status/return.png')"
                    v-else-if="status.id === 4 "
                    class="order-ds-icon"/>
              <image :src="imgPath('/cancle.png')"
                    v-else-if="status.id === 3 "
                    class="order-ds-icon"/>
             <image :src="imgPath('/order/status/del.png')"
                    v-else
                    class="order-ds-icon"/>
             <text class="order-ds-text">{{status.name}}</text>
        </div>
    </div>
</template>
<script>
import Vue from "vue";

import { Utils, } from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";



const dom = weex.requireModule("dom");

export default {
  props:['status'],
  components: { Utils },
  mixins: [mixin],
  data: () => ({
     statusIcon:[],
     statusName:['未确认','已确认','已完成','取消','退货','已分单','部分分单','删除','待提交审核','待审核','排队等货','已到货待确认发货']
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
.order-detail-status{
    width:750px;
    padding-top:50px;
    padding-bottom:50px;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: aquamarine;
    background-image:linear-gradient(to bottom,#f95a63,#fc8870);
}
.order-ds-box{
    padding-left:30px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start
}
.order-ds-icon{
    width:45px;
    height:45px;
    margin-right:15px;
}
.order-ds-text{
    font-size: 36px;
    color:#fff;
}
</style>