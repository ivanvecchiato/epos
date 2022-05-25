<template>
   <div class="pricelist">
      <div class="title">{{$t('pricelist.products_variants')}}</div>
      <el-tabs type="card" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('pricelist.products')">
          <inventory></inventory>
        </el-tab-pane>
        <el-tab-pane :label="$t('pricelist.categories')">
          <categories></categories>
        </el-tab-pane>
        <el-tab-pane :label="$t('pricelist.variants')">
          <variants></variants>
        </el-tab-pane>
      </el-tabs>
   </div>
</template>

<script>
import Inventory from './ProductConfig/Inventory.vue'
import Variants from './ProductConfig/Variants.vue'
import Categories from './ProductConfig/Categories.vue'

export default {
   components: { Inventory, Variants, Categories },
   data() {
     return {
     };
   },
   methods: {
     handleTabClick: function() {
       
     }
   },
}
</script>

<style scoped>
.pricelist {
  background-color: var(--background-color);
  height: 100vh;
}
</style>