import Vue from 'vue'
import weex from 'weex-vue-render'

import '~/assets/css/main.css'

// 加载 web 日期控件
// import '~~/node_modules/vue/dist/vue.runtime.js'
// import '~~/node_modules/weex-vue-render/dist/index.js'
import '~~/node_modules/@weex-project/weex-picker/js/build/index.js'

// import { sync } from 'vuex-router-sync'
// import * as filters from '@/filters'
// import mixins from '@/mixins'

// // sync the router with the vuex store.
// // this registers `store.state.route`
// // sync(store, router)

// // register global utility filters.
// Object.keys(filters).forEach(key => {
//     Vue.filter(key, filters[key])
// })

// register global mixins.
// Vue.mixin(mixins)

weex.init(Vue)
