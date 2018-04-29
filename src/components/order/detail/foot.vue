<template>
    <div class="order-detail-foot">
        <div>
             <text class="order-df-text"
                   @click="operations(info.order_id,ix.k)"
                   v-for="ix in operation.buttons"
                   :key="ix.k"
                   v-if="ix.k === 'delete'">{{ix.name}}</text>
        </div>
        <div>
            <text class="order-df-text"
              @click="operations(info.order_id,ix.k)"
              v-for="ix in operation"
              :key="ix.k"
              v-if="ix.k !== 'buyAgain' && ix.k !== 'payNow' && ix.k !== 'delete'">{{ix.v}}</text>
            <text class="order-df-text order-df-buy"
                  @click="pay(item.detail)"
                  v-for="ix in operation"
                  :key="ix.k"
                  v-if="ix.k === 'payNow'">{{ix.v}}</text>
            <text class="order-df-text order-df-buy"
                  @click="buyAgains(info.detail)"
                  v-for="ix in operation"
                  :key="ix.k"
                  v-if="ix.k === 'buyAgain'">{{ix.v}}</text>
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
  props:['info','operation'],
  components: { Utils },
  mixins: [mixin],
  data: () => ({
     
  }),
  created() {
   
  },
  mounted(){
     
  },
  methods: {
        buyAgains(detail){//再次购买
            this.$emit('buyAgain',detail, true)
        },
        async operations(id,name){
            let {data: {payload: {message,code,info}}} = await this.stream(`app.!order[${name}]`,{query:{id}});
            if(code === 200){
                  modal.toast({
                    message: info,
                    duration: 0.8
                });  
                this.$emit('getOrder')
            }
        },
  }
};
</script>
<style scoped>
.order-detail-foot{
    position: fixed;
    bottom:0;
    left:0;
    width:750px;
    height:122px;
    line-height: 122px;
    padding-left:30px;
    padding-right:30px;
    padding-top:30px;
    padding-bottom:30px;
    background-color: #F8F8F8;
    justify-content: space-between;
    flex-direction: row;
}
.order-df-text{
    font-size: 32px;
    color: #26262A;
    padding-top:5px;
    padding-bottom:5px;
    padding-left:15px;
    padding-right:15px;
    border-color:#26262A;
    border-style:solid;
    border-width:1px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.order-df-buy{
    border-color:#D60008;
    color:#D60008;
}

</style>