<template>
      <div class="region">
          <div class="region-top">
              <text class="region-tname">所在地区</text>
              <wxc-icon name="close" 
                        class="region-tclose"
                        @wxcIconClicked="closeClick"></wxc-icon>
          </div>
        
          <div class="region-area">
              <text  :class="['region-aname',activeTabIndex === index ? 'region-aname-active':'']"
                     v-for="(item,index) in regions"
                    :key="item.region_id"
                     @click="activeTab(item,index)">{{item.region_name}}</text>
                     
                <text class="region-aname region-aname-active"
                      v-if="regions.length < 3">请选择</text>
          </div>
          <scroller class="region-list" 
                    :style="{height:maxHeight+'px'}">
                <div class="region-lists"
                      ref="region">
                    <div class="region-con"
                     ref="region0">
                        <div v-for="item in province"
                             :key="item.region_id"
                             class="region-name"
                             @click="getCity(item, 0)">
                            <text class="region-names">{{item.region_name}}</text>
                            <div v-if="regions.length>0">
                                  <image class="region-select"
                                         v-if="regions[0].region_id === item.region_id"
                                         :src="imgPath('/member/select.png')"/>
                            </div>
                           
                        </div>
                    </div>
                    <div class="region-con"
                     ref="region1">
                        <div v-if="city"
                             v-for="item in city"
                            :key="item.region_id"
                            class="region-name"
                            @click="getArea(item,1)">
                           <text class="region-names">{{item.region_name}}</text>
                            <div v-if="regions.length>1">
                                  <image class="region-select"
                                         v-if="regions[1].region_id === item.region_id"
                                         :src="imgPath('/member/select.png')"/>
                            </div>
                        </div>
                    </div>
                    <div class="region-con"
                     ref="region2">
                        <div v-if="area"
                             v-for="item in area" 
                            :key="item.region_id"
                            class="region-name"
                            @click="getRegions(item,2)">
                           <text class="region-names">{{item.region_name}}</text>
                            <div v-if="regions.length>2">
                                  <image class="region-select"
                                         v-if="regions[2].region_id === item.region_id"
                                         :src="imgPath('/member/select.png')"/>
                            </div>
                        </div>
                    </div>
                </div>
          </scroller>
      </div>
</template>

<script>
import Vue from "vue";
import {    Utils,WxcIcon, WxcPopup,WxcEpSlider ,WxcPanItem
        } from "weex-ui";

import mixin from "@/mixins";

const modal = weex.requireModule("modal");
const animation = weex.requireModule('animation')

export default {
  props:['selectR'],
  mixins: [mixin],
  components: { Utils,WxcIcon, WxcPopup,WxcEpSlider ,WxcPanItem},
  data: () => ({
    maxHeight:Utils.env.getPageHeight()/2-140,
    province:[],
    city:[],
    area:[],
    regions:[],
    activeTabIndex:0,
  }),
  async created(){
       if(this.selectR.length > 0){
            this.regions = this.selectR;
            let [ {data: {payload:{list :province }}},
                  {data: {payload:{list :city }}},
                  {data: {payload:{list :area }}}] = await Promise.all([
                await this.stream("app.!region.list", {query:{parent_id: 0}}),
                await this.stream("app.!region.list", {query:{parent_id: this.regions[0].region_id}}),
                await this.stream("app.!region.list", {query:{parent_id: this.regions[1].region_id}})
            ]);
            this.province = province;
            this.city = city;
            this.area = area;
       }else{
             this.province =  this.getProvince();
       }
  },
  methods: {
        activeTab(item,index){
            this.activeTabIndex = index;
            this.hide(parseInt(index))
        },
        hide(ele){
            let eleMent = this.$refs.region;
            let eleX =  ele * 750;
            this.wwwww = eleX
            animation.transition(eleMent, {
              styles: {
                transform: 'translateX(-'+eleX+'px)',
                transformOrigin: 'center center'
              },
              duration: 800, //ms
              timingFunction: 'ease',
              delay: 0 //ms
            }, function () {
              //modal.toast({ message: 'animation finished.' })
            })
        },
        async getProvince(){
           this.city=[];
           let {data: {payload:{list :province }}} = await this.stream("app.!region.list", {query:{parent_id: 0}});
           this.province = province;
        },
        async getCity(item,ele){
            this.area=[];
            this.activeTabIndex = 1;
            let {data: {payload:{list :city }}} = await this.stream("app.!region.list", {query:{parent_id: item.region_id}});
            this.city = city;
            // console.log('_____item', item)
            this.$set(this.regions, 0, item);
            this.regions = this.regions.splice(0, 1);
            this.hide(parseInt(ele+1))
        },
        async getArea(item,ele){
            this.activeTabIndex = 2;
            let {data: {payload:{list :area }}} = await this.stream("app.!region.list", {query:{parent_id: item.region_id}});
            this.area = area;
            this.$set(this.regions,1,item);
            this.regions.splice(2);
            this.hide(parseInt(ele+1))
        },
        getRegions(item,name){
            this.$set(this.regions,2,item);
            this.closeClick();
            this.$emit('getRegions',this.regions)
        },
        async getRegion(data_id){
            let query = {
                parent_id: data_id,
            }
            let {data: {payload},status,ok} = await this.stream("app.!region.list", {query})
            if(payload.code === 200 && payload.list){
                return payload.list
            }
        },
        closeClick(){
            this.$emit('popupClick')
        }
  }
};
</script>
<style>
.region{
    width:750px;
}
.region-top{
    flex:1;
    padding-left:30px;
    padding-right:30px;
    border-bottom-style:solid;
    border-bottom-color:#e7e7e7;
    border-bottom-width:1px;
    background-color:#fff;
    flex-direction: row;
    justify-content: space-between;
}
.region-tname{
    flex:9;
    text-align:center;
    height:80px;
    line-height:80px;
    font-size:38px;
    color:#26262A;
}
p.region-tname{
    flex:9;
    text-align:center;
    height:80px;
    line-height:80px;
    font-size:38px;
    color:#26262A;
}
.region-tclose{
    flex:1;
    padding-left:30px;
    padding-right:30px;
    height:80px;
    line-height:80px;
    font-size:38px;
    color:#85878A;
}
.region-area{
    width:750px;
    flex-direction: row;
    padding-left:30px;
    padding-right:30px;
    border-bottom-style:solid;
    border-bottom-color:#e7e7e7;
    border-bottom-width:1px;
    background-color:#fff;
}
.region-aname{
    height:60px;
    line-height:60px;
    font-size:34px;
    color:#26262A;
    padding-left: 5px;
    padding-right:5px;
    margin-right:20px;
}
p.region-aname{
    height:60px;
    line-height:60px;
    font-size:34px;
    color:#26262A;
    margin-right:15px;
}
.region-aname-active{
    color:#d60008;
    border-bottom-style:solid;
    border-bottom-color:#d60008;
    border-bottom-width:1px;
}
p.region-aname-active{
    color:#d60008;
    border-bottom-style:solid;
    border-bottom-color:#d60008;
    border-bottom-width:1px;
}
.region-list{
    width:750px;
}
.region-lists{
    width:2250px;
    justify-content: flex-start;
    flex-direction: row;
}
.region-con{
    width:750px;
    justify-content: flex-start;
}
.region-name{
    width:750px;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
    padding-left:30px;
    padding-right:30px;
    border-bottom-style:solid;
    border-bottom-color:#e7e7e7;
    border-bottom-width:1px;
    background-color:#fff;
}
.region-names{
    height:60px;
    line-height:60px;
    font-size:34px;
    color:#26262A;
    padding-right:15px;
}
p.region-names{
    height:60px;
    line-height:60px;
    font-size:34px;
    color:#26262A;
    padding-right:15px;
}
.region-select{
    width:35px;
    height:35px;
}
</style>