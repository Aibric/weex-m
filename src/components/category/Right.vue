<template>
        <scroller class="category_menu">
          <list>
            <cell v-for="menu in menus" 
                  :key="menu.id"  
                  v-if="menu.child.length > 0">
              <text class="category_menu_title" 
                    v-if="menu.child">{{menu.name}}</text>
              <div class="category_menu_list">
                  <div class="category_menu_list_c">
                        <div class="category_menu_list_img" 
                             v-for="(item,index) in menu.child" 
                             :key="item.id" 
                             v-if="index%3 === 0" 
                             @click="jump('/category/detail',{id:item.id,back:menusParent})">
                          <image style="width:100px;height:100px"  :src="item.icon"/>
                          <div class="category_name_panel">
                            <text class="category_name" lines="2">{{item.name}}</text>
                          </div>
                        </div>
                  </div>
                  <div class="category_menu_list_c">
                        <div class="category_menu_list_img" 
                             v-for="(item,index) in menu.child" 
                             :key="item.id" 
                             v-if="index%3 === 1" 
                              @click="jump('/category/detail',{id:item.id,back:menusParent})">
                          <image style="width:100px;height:100px" :src="item.icon"/>
                           <div class="category_name_panel">
                            <text class="category_name" lines="2">{{item.name}}</text>
                          </div>
                        </div>
                  </div>
                  <div class="category_menu_list_c">
                        <div class="category_menu_list_img" 
                             v-for="(item,index) in menu.child" 
                             :key="item.id" 
                             v-if="menu.child && index%3 === 2"  
                             @click="jump('/category/detail',{id:item.id,back:menusParent})">
                          <image style="width:100px;height:100px" :src="item.icon"/>
                          <div class="category_name_panel">
                            <text class="category_name" lines="2">{{item.name}}</text>
                          </div>
                        </div>
                  </div>
              </div>
            </cell>
          </list>
        </scroller>



</template>
<script>
import Vue from "vue";
import {
  Utils
} from "weex-ui";

import mixin from "@/mixins";

const dom = weex.requireModule("dom");
const navigator = weex.requireModule('navigator')
const modal = weex.requireModule('modal')

export default {
  props:['menus','menusParent'],
  components: {},
  mixins: [mixin],
  data: () => ({
   width:{
     'background-color' :'yellow'
   }
  }),
  created() {
  
  },
  methods: {
   widthC(){
     this.width = {'background-color' :'red'}
   }
  }
};
</script>
<style>
.category_menu {
  flex:3;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 30px;
}
.category_menu_title {
  color: #333333;
  font-size: 28px;
  font-weight: 700;
  padding-top: 10px;
  padding-bottom: 10px;
}
.category_menu_list {
  padding-top: 15px;
  padding-bottom: 15px;
  flex-direction: row;
  justify-content: flex-start;
}
.category_menu_list_c {
  width: 180px;
  align-items: center;
}
.category_menu_list_img {
  width: 180px;
  align-items: center;
  margin-bottom: 15px;
  height: 200px;
}
.category_name_panel {
  width: 150px;
  padding-top: 15px;
  padding-bottom: 15px;
  align-items: center;
}
.category_name {
  width: 150px;
  lines: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666666;
  text-align: center;
  font-size: 24px;
}
</style>