<template>
    <div class="themes">
        <div>
            <image class="themes-first-image"
                :src="firstTheme.img_url"></image>  
        </div>
        <div class="themes-box">
            <div v-for="(val, key) in getThemes"
                :key="key"
                class="themes-item">
                <image class="themes-image"
                    :src="val.img_url"></image>    
            </div>
        </div>
    </div>
</template>
<script>
    import { isArray, values } from 'lodash'

    import mixin from "~/mixins"
    import filters from "~/filters"

    export default {
        props: ['themes'],
        mixins: [mixin],
        filters: {
            ...filters
        },
        computed: {
            firstTheme() {
                return this.getThemes.shift() || {}
            },
            getThemes () {
                return (isArray(this.themes) 
                    ? values(this.themes.sort((x, y) => x.sort - y.sort)) 
                    : []).slice(0, 5)
            }
        }
    }
</script>
<style>
.themes {
    display: flex;
    flex-direction: row;
}
.themes-first-image {
    width: 300px;
    height: 340px;
}
.themes-box {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 342px;
    flex: 1;
}
.themes-item,
.themes-image {
    width: 225px;
    height: 170px;
}
</style>
