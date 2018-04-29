<template>
    <div class="floor">
        <div class="floor-title">
            <image class="floor-title-image"
                :src="imgPath(floorTitle.img_url || '')"></image>
        </div>
        <div class="floor-content">
            <div v-for="(val,key) in goods"
                :key="key"
                :class="['floor-item', `floor-item-${val.type == 1 ? 1 : 2}`]">
                <div :class="['floor-item-body', `floor-item-body-${val.type == 1 ? 1 : 2}`]">
                    <image :class="['floor-item-image', `floor-item-image-${val.type == 1 ? 1 : 2}`]"
                        :src="imgPath(val.img_url)"></image>
                </div>
                <div :class="['floor-item-header', `floor-item-header-${val.type == 1 ? 1 : 2}`]">
                    <text class="floor-item-title">{{val.name}}</text>
                    <text class="floor-item-sub-title" :style="val.sub_title_color 
                        ? {
                            color: val.sub_title_color, 
                            backgroundImage: 'none',
                            textFillColor: val.sub_title_color}
                        : {}">{{val.sub_title}}</text>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from "~/mixins"
    import filters from "~/filters"

    export default {
        props: ['floor'],
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
            name (name, val) {
                return name + (val.type == 1 ? 1 : 2)
            },
            floorTitle () {
                return this.floor.floorTitle || {
                }
            },
            goods () {
                return this.floor.goods || []
            }
        }
    }
</script>
<style>
.floor {
    background-color: #ffffff;
}
.floor-title {
    padding-top: 15px;
    background-color: #f6f6f6;
}
.floor-title-image {
    width: 750px;
    height: 70px;
}
.floor-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 750px;
}

.floor-item {
    display: flex;
    height: 286px;
    border-right-style: solid;
    border-right-width: 2px;
    border-right-color: #f9f9f9;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-color: #f9f9f9;
}
.floor-item-1 {
    flex-direction: column;
    width: 187px;
    position: relative;
}
.floor-item-2 {
    flex-direction: row;
    justify-content: flex-end;
    width: 373px;
    position: relative;
}

.floor-item-header {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    padding-top: 15px;
    position: absolute;
    left: 0;
    top: 0;
}

.floor-item-title {
    line-height: 40px;
    font-size: 30px;
    color: #000000;
}
.floor-item-sub-title {
    line-height: 30px;
    font-size: 24px;
    background-image: -webkit-linear-gradient(left, rgb(212, 0, 255), rgb(255, 50, 10));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: #ff5959;
}

.floor-item-body {
    display: flex;
    align-content: center;
    justify-content: center;
}
.floor-item-body-1 {
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    margin-bottom: 20px;
}
.floor-item-body-2 {
    width: 206px;
}

.floor-item-image-1 {
    width: 166px;
    height: 152px;
}
.floor-item-image-2 {
    width: 192px;
    height: 188px;
}
</style>
