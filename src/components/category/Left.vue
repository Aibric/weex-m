<template>
        <list class="category-navs">
          <cell v-for="(item,index) in leftNavs" :key="index" class="category-navs-cell" @click="navsClick(item.id,index)">
            <div class="category-navs-cell-text">
              <text :class="['category-navs-name',activeIndex === index ? 'category-navs-name-active' : '']" lines="1">{{item.name}}</text>
            </div>
          </cell>
        </list>
</template>
<script>
import Vue from "vue";
import {
  Utils,
} from "weex-ui";


export default {
  components: { },
  props: ['leftNavs'],
  data: () => ({
    activeIndex: 0, //当前活动状态的分类
  }),
  created() {
  
  },
  methods: {
    navsClick:function(id,index){
       this.activeIndex = index
       this.$emit('clickMenu',id)
    }
  }
};
</script>
<style>
.category-navs {
  width: 180px;
  text-align: center;
  background-color: #F8F8F8;
}
.category-navs-cell {
  width: 180px;
  align-items: center;
}
.category-navs-cell-text {
  width: 170px;
  align-items: center;
}
.category-navs-name {
  width: 180px;
  lines: 1;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 28px;
}
p.category-navs-name {
  width: 180px;
  lines: 1;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 28px;
}
.category-navs-name-active {
  color: #e93b3d;
  background-color: #f2f3f4;
}
</style>