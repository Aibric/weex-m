<template>
  <div class="logistics-list">
       <wxc-simple-flow :list="testData" :themeColor="themeColor"></wxc-simple-flow>
  </div>
</template>

<script>
import Vue from "vue";
import {    Utils,WxcSimpleFlow
        } from "weex-ui";

import mixin from "@/mixins";

const modal = weex.requireModule("modal");

export default {
    props:['orderTrack'],
    components: {WxcSimpleFlow },
    mixins: [mixin],
    data: () => ({
        themeColor: {
          lineColor: '#eee',
          pointInnerColor: '#eee',
          pointBorderColor: '#eee',
          highlightTitleColor: '#bf280b',
          highlightPointInnerColor: '#bf280b',
          highlightPointBorderColor: '#d46262'
        },
        testData: [
            {
              'date': '2017-05-24 21:10:29',
              'desc': '',
              'highlight': true,
              'title': '方案已确认'
            },
            {
              'date': '2017-05-24 19:54:28',
              'desc': '',
              'title': '方案已更新'
            },
            {
              'date': '2017-05-24 19:50:21',
              'desc': '您以确定了方案',
              'title': '方案已上传'
            },
            {
              'date': '2017-05-24 19:49:03',
              'desc': '商家会在2个工作小时内电话或旺旺联系您',
              'title': '商家已接单'
            }
        ]
    }),
    created(){
      
    },
    methods: {
      
    }
};
</script>
<style>
.logistics-list{
    margin-top:20px;
    background-color: #fff;
}
</style>