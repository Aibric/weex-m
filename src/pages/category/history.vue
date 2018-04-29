<template>
  <div class="category-his"> 
    <search-pages v-on:searchResult="searchResult"></search-pages>
    <history-pages  :resultLists="resultLists"></history-pages>
  </div>
</template>
<script>
import Vue from "vue";
import {
  Utils,
} from "weex-ui";

import mixin from "@/mixins";
import Config from "@/utils/config";


 import searchPages from "~/components/category/history/Search";
 import historyPages from "~/components/category/history/History";

const dom = weex.requireModule("dom");

export default {
  mixins: [mixin],
  components: {
      searchPages, 
      historyPages,
  },
  data: () => ({
    resultLists:[],
    searchStatus:false,
  }),
  created() {

  },
  methods: {
    searchResult(val){
          let self = this;
          self.searchStatus = val.status;
          self.resultLists = val.list;
      }
  }
};
</script>
<style>
.category-his{
    width: 750px;
}
</style>