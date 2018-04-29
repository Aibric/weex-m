<template>
  <div class="cate-d"> 
    <search-page :backId="backId"
                 :goodsName="goodsName"></search-page>
    <div class="cate-d-sort cate-f-r">
         <div class="cate-d-s-panel" @click="sortChange('add_time')">
             <text class="cate-d-s-text">新品</text>
            <image :src="imgPath('/category/down.png')"
                    class="cate-arrow"
                    v-if="add_time"/>
            <image :src="imgPath('/category/up.png')"
                    class="cate-arrow"
                    v-else/>
        </div>
        <div class="cate-d-s-panel"  @click="sortChange('sales_amount')">
            <text class="cate-d-s-text">销量</text>
            <image :src="imgPath('/category/default.png')"
                    v-if="sales_amount === ''"
                    class="cate-arrow"/>
            <image :src="imgPath('/category/down.png')"
                    class="cate-arrow"
                    v-else-if="sales_amount"/>
            <image :src="imgPath('/category/up.png')"
                    class="cate-arrow"
                    v-else/>
        </div>
        <div class="cate-d-s-panel"  @click="sortChange('price')">
            <text class="cate-d-s-text">价格</text>
            <image :src="imgPath('/category/default.png')"
                    v-if="price === ''"
                    class="cate-arrow"/>
            <image :src="imgPath('/category/down.png')"
                    class="cate-arrow"
                    v-else-if="price"/>
             <image :src="imgPath('/category/up.png')"
                    class="cate-arrow"
                    v-else/>
        </div>
    </div> 
    <lists-page  :square="square" 
                 :goodsList="goodsList"
                 :finish="finish"
                 v-on:topBtn="topBtn"
                 v-on:moreData="moreData"  
                 ref="modaltop"></lists-page>
    <div class="cate-btn">
        <image  v-if="topStatus" 
                :src="imgPath('/category/category_top.png')"  
                @click="childTop" 
                class="cate-btn-icon"/>
        <image  v-if="square" 
                :src="imgPath('/category/category_row.png')" 
                @click="changeShow(false)" 
                class="cate-btn-icon"/>
        <image  v-else 
                :src="imgPath('/category/category_col.png')" 
                @click="changeShow(true)" 
                class="cate-btn-icon"/>
    </div>
     <wxc-loading :show="show"
                  loading-text="数据加载中..."></wxc-loading>
     
 </div> 
</template>
<script>
import Vue from "vue";
import {
    WxcIcon,
    Utils,
    WxcLoading,
} from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";
import helper from "@/utils/helper";

 import SearchPage from "~/components/category/detail/Search";
 import ListsPage from "~/components/category/detail/Lists"

const dom = weex.requireModule("dom");

export default {
  components: { 
      WxcIcon,
      ListsPage,
      SearchPage,
      WxcLoading},
  mixins: [mixin],
  data: () => ({
    show:false,
    backId:'',
    goodsId:'',
    goodsName:'',
    goodsList:[],
    meta:{
        totalCount:0,
        pageCount:0,
        currentPage:1,
        perPage:20,
    },
    finish:false,
    square:true,//数据展示方式 true -- 一列 false -- 两列
    topStatus:false,//返回顶部按钮显隐
    maxHeight: Utils.env.getPageHeight() - 200,
    sort:'',
    add_timeSort:'-add_time',
    sales_amountSort:'-sales_amount',
    priceSort:'-price',
    add_time:true,
    sales_amount:'',
    price:''
  }),
  created() {
    this.show = true;
    this.goodsId = this.queryParames().id || 335;
    this.backId = this.queryParames().back || '';
    this.goodsName = this.queryParames().searchKey || '';
    this.getGoodsList();
  },
    methods: {
        sortChange(value){
            let self = this;
            self.show = true;
            self.goodsList = [];
            self[value] = !self[value];
            self[value+'Sort'] = self[value] ? '-'+value : value
            this.getGoodsList();
        },
      up(value){
          let self = this;
          self.show = true;
          self.goodsList = [];
          self[value+'Sort'] = value;
          self[value] = !self[value];
          this.getGoodsList();
      },
      down(value){
          let self = this;
          self.show = true;
          self.goodsList = [],
          self[value.substr(1)+'Sort'] = value;
          self[value.substr(1)] = !self[value.substr(1)];
          this.getGoodsList();
      },
      changeShow(val){
          this.square = val;
      },
      topBtn(val){
        this.topStatus = val;
      },
      childTop(){
        this.$refs.modaltop.goTop();
      },
      moreData(val){
        let self = this;
        self.meta.currentPage = self.meta.currentPage + 1;
        if(this.meta.currentPage > this.meta.pageCount){
            self.show = false;
            self.finish = true;
        }else{
            self.getGoodsList(self.meta.currentPage,self.goodsId)
        }
      },
      async getGoodsList() {
            let self = this;
            let query = {
                page: self.meta.currentPage,
                cat_id: self.goodsId,
                goods_name:self.goodsName,
                sort:self.add_timeSort+','+self.sales_amountSort+','+self.priceSort,
            }
            let {data:{payload:{list,_meta,code}}} = await self.stream("app.!good.list", {query});

            if(code === 200 && list){
                list.map(item => self.goodsList.push(item) )
                self.meta = _meta; 
            }
            if(self.goodsList.length >= self.meta.totalCount){
                self.finish = true;
            }
            this.show = false;
        },
  }
};
</script>
<style>
.cate-d {
  width: 750px;
  position: relative;
  align-items: flex-start;
}
.cate-f-r{
   flex-direction: row; 
}
.cate-f-c{
    align-items: center
}
.cate-f-b{
    justify-content: space-between
}
.cate-t-b{
    font-size: 32px;
}
.cate-t-m{
    font-size: 28px;
}
.cate-t-s{
    font-size: 24px;
}
.cate-p-LR{
  padding-left:10px;
  padding-right:10px;
}
.cate-f-s{
    font-weight:700;
}
.cate-f-c-r{
    color:#f23030;
}
.cate-f-c-g{
    color:#666666;
}
.cate-b{
    border-bottom-style: solid;
    border-bottom-width: 1px;
}
.cate-d-sort{
    width: 750px;
    height:80px;
    justify-content: space-around;
    align-items: center;
    background-color:#ffffff;
    padding-top:20px;
    padding-bottom:20px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #e5e5e5;
}
.cate-d-s-panel{
    padding-top:10px;
    padding-bottom:10px;
    padding-left:20px;
    padding-right:20px;
    flex-direction: row;
    align-items: center;
}
p.cate-d-s-text{
    font-size: 28px;
}
.cate-d-s-icon{
    margin-left:10px;
}
p.cate-d-s-icon{
    margin-left:10px;
}
.cate-d-s-text{
    font-size: 28px;
    padding-right: 10px;
}
p.cate-d-name{
    padding-top:10px;
    padding-bottom:10px;
    font-size: 28px;
}
.cate-d-name{
    padding-top:10px;
    padding-bottom:10px;
}
.cate-btn {
   position:absolute;
   bottom:20px;;
   right:15px;
   padding-left:10px;
   padding-right:10px;
}
.cate-btn-icon {
  width: 90px;
  height: 90px;
  margin-bottom:15px;
}
figure.cate-btn-icon {
  width: 90px;
  height: 90px;
  margin-bottom:15px;
}
.cate-arrow{
  width: 26px;
  height: 28px;
  margin-left:10px;
}
figure.cate-arrow{
  width: 26px;
  height: 28px;
  margin-left:10px;
}
.cate-ds-lists{
    width:750px;
    flex-direction: row;
    position: fixed;
    top:100px;
    left:0;
    background-color: rgba(0,0,0,0.8);
}
.cate-ds-sr{
    width:750px;
    font-size:28px;
    padding-top:15px;
    padding-bottom:15px; 
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #e5e5e5;
}
p.cate-ds-sr{
    width:750px;
    font-size:28px;
    padding-top:15px;
    padding-bottom:15px; 
    padding-left:30px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #e5e5e5;
}

</style>