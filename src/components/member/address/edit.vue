<template>
    <div class="address-edit" :style="{height:maxHeight+'px'}">
        <div class="add-edit-panel">
            <text class="add-ep-label">收货人：</text>
            <input type="text" class="add-ep-input" :value="formD.consignee"  @input="changeData('consignee',$event)" />
        </div>
        <div class="add-edit-panel">
            <text class="add-ep-label">手机号码：</text>
            <input type="number" class="add-ep-input" :value="formD.mobile" @input="changeData('mobile',$event)" />
        </div>
        <div class="add-edit-panel" @click="popupClick">
            <text class="add-ep-label">所在地区：</text>
            <text  class="add-ep-input">{{regions}}</text>
            <wxc-icon name="more" 
                      class="add-ep-more" 
                      @wxcIconClicked="activeAddress"
                      style="fontSize:40px;"></wxc-icon>
        </div>
        <div class="add-edit-panel add-edit-panelt">
            <text class="add-ep-label add-ep-labet" style="margin-top: 5px;">详细地址：</text>
            <textarea rows="2" class="add-ep-input" placeholder="街道、门牌号等" :value="formD.address" @input="changeData('address',$event)"></textarea>

        </div>
        <div class="add-edit-btn">
            <text class="add-edit-save" @click="saveNew">保存</text>
        </div>
        <wxc-popup popup-color="rgb(255, 255,255)" :show="isBottomShow" @wxcPopupOverlayClicked="popupClick" pos="bottom" :height="oHeight">
            <region-pages v-on:popupClick="popupClick" v-on:getRegions="getRegions" :selectR="selectR"></region-pages>
        </wxc-popup>
    </div>
</template>

<script>
import Vue from "vue";
import { Utils, WxcIcon, WxcPopup } from "weex-ui";

import mixin from "@/mixins";

import regionPages from "~/components/member/address/region";

const modal = weex.requireModule("modal");

export default {
    mixins: [mixin],
    props: ["maxHeight"],
    components: { Utils, WxcIcon, regionPages, WxcPopup },
    data: () => ({
        activeIndex: 1,
        oHeight: Utils.env.getPageHeight() / 2,
        isBottomShow: false,
        regions: "",
        address_id: "",
        selectR: [],
        txtInput: "",
        formD: {
            address_id: "",
            consignee: "",
            mobile: "",
            province: "",
            city: "",
            district: "",
            address: ""
        }
    }),
    created() {
        if (this.queryParames().id) {
            this.getAdress(this.queryParames().id);
        }
    },
    methods: {
        activeAddress() {},
        onInput(event) {
            this.txtInput = event.value;
            console.log("oninput", event.value);
        },
        getRegions(val) {
            let names = "";
            let self = this;
            self.selectR = val;
            val.map(function(item, index) {
                if (index === 0) {
                    names = names + item.region_name;
                    self.formD.province = item.region_id;
                } else if (index === 1) {
                    names = names + item.region_name;
                    self.formD.city = item.region_id;
                } else if (index === 2) {
                    names = names + item.region_name;
                    self.formD.district = item.region_id;
                }
            });
            self.regions = names;
        },
        popupClick() {
            this.isBottomShow = !this.isBottomShow;
        },
        async saveNew() {
            let self = this;
            let body = {};
            body = self.formD;
            let mothods = "";
            if (this.queryParames().id) {
                mothods = "update";
            } else {
                mothods = "create";
            }

            let { data: { payload }, status, ok } = await self.stream(
                `app.!address.${mothods}`,
                { body }
            );
            if (payload.code === 200) {
                modal.toast({
                    message: payload.info,
                    duration: 0.8
                });
            }
        },
        async getAdress(id) {
            let self = this;
            let query = {
                id: id,
                expand: "province,city,district",
                fields: "address_id,address,mobile,consignee,is_default"
            };
            let { data: { payload }, status, ok } = await self.stream(
                "app.!address.view",
                { query }
            );
            if (payload.code === 200) {
                self.formD.address_id = payload.list[0].address_id;
                self.formD.consignee = payload.list[0].consignee;
                self.formD.address = payload.list[0].address;
                self.formD.mobile = payload.list[0].mobile;
                self.formD.province = payload.list[0].province.region_id;
                self.formD.city = payload.list[0].city.region_id;
                self.formD.district = payload.list[0].district.region_id;
                self.$set(self.selectR, 0, payload.list[0].province);
                self.$set(self.selectR, 1, payload.list[0].city);
                self.$set(self.selectR, 2, payload.list[0].district);
                self.regions =
                    payload.list[0].province.region_name +
                    payload.list[0].city.region_name +
                    payload.list[0].district.region_name;
            }
        },
        changeData(ele, event) {
            this.$set(this.formD, ele, event.value);
        }
    }
};
</script>
<style>
.address-edit {
    width: 750px;
    position: relative;
    background-color: #f0f2f5;
}
.add-edit-panel {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
    border-bottom-style: solid;
    border-bottom-color: #e7e7e7;
    border-bottom-width: 1px;
    background-color: #fff;
    flex-direction: row;
    align-items: center;
}
.add-edit-panelt {
    align-items: flex-start;
}
.add-ep-label {
    font-size: 34px;
    height: 34px;
    line-height: 34px;
    font-weight: 500;
    color: #26262a;
    margin-right: 15px;
}
p.add-ep-label {
    font-size: 34px;
    height: 34px;
    line-height: 34px;
    font-weight: 500;
    color: #26262a;
    margin-right: 15px;
}
.add-ep-input {
    flex: 1;
    outline: none;
    font-size: 34px;
    font-weight: 500;
}
.add-ep-more {
    color: #888;
    padding-top: 20px;
    font-size: 16px;
    margin-left: 15px;
}
.add-edit-btn {
    width: 750px;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: 30px;
}
.add-edit-save {
    width: 500px;
    height: 80px;
    line-height: 80px;
    color: #fff;
    font-size: 34px;
    background-color: #d60008;
    text-align: center;
}
</style>