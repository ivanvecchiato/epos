<template>
   <div>
      <div v-if="product.components == undefined || product.components.length==0">
         {{$t('product.no_components')}}
      </div>

      <div class="search">
         <input id="search" class="form-input search-input" :placeholder="$t('generic.search')"
           v-model="searchInput" :oninput="inputChange()"/>
      </div>
      <div class="search-results" v-if="results.length > 0">
         <ul style="max-height: 100px; overflow:scroll">
            <li v-for="p in results" :key="p.id" @click="selectProd(p)">
               {{p.name}}
            </li>
         </ul>
      </div>
      <ul>
         <li class="component-list" v-for="c, index in components" :key="c.id">
            <el-row :gutter="20" align="middle">
               <el-col :span="8">{{c.name}}</el-col>
               <el-col :span="6">
                  <input class="form-input" style="margin-top: 3px" size=5 v-model="c.price"/>
               </el-col>
               <el-col :span="2">
                 <el-button
                   size="small"
                   type="danger"
                   icon="el-icon-delete"
                   circle plain
                   @click="deleteItem(index)"></el-button>
               </el-col>
            </el-row>
         </li>
      </ul>

      <div class="bundle-price">
         Prezzo bundle: {{formatPrice(product.price)}}
      </div>
      <div :class="getCalculatedPriceStyle()">
         Prezzo calcolato: {{totalPrice}}
      </div>

   </div>
</template>

<script>
import utils from '@/utils.js'

export default {
   name: 'ProductComposition',
   props: ['product', 'catalog'],
   data() {
      return {
         loaded: false,
         components: [],
         searchInput: '',
         results: []
      }
   },
   computed: {
      totalPrice: function() {
         var p=0;
         for(var i=0; i<this.components.length; i++) {
            p += Number(this.components[i].price);
         }
         return utils.formatPrice(p);
      }
   },
   methods: {
      deleteItem: function(index) {
         this.components.splice(index, 1);
      },
      formatPrice: function(price) {
         return utils.formatPrice(price)
      },
      removeComponent: function(c) {
         var i=0;
         while (i<this.components.length) {
            if(this.components[i].id == c.id) {
               this.components.splice(i, 1);
               break;
            }
            i++;
         }
      },
      selectProd: function(p) {
         var subset = this.product.subset(p);
         this.components.push(subset);
         this.$emit('componentsUpdate', this.components)
         this.searchInput = '';
      },
      inputChange: function() {
         var input = this.searchInput;
         if(input.length<2) return;

         this.results = [];
         this.resultCount = 0;
         for(var p in this.catalog) {
           var name = this.catalog[p].name;
           if((name.toLowerCase()).startsWith(input.toLowerCase())) {
             this.results.push(this.catalog[p]);
           }
         }
      },
      getCalculatedPriceStyle() {
         if(Number(this.product.price) != Number(this.totalPrice)) {
            return 'calculated-price'
         } else {
            return 'bundle-price'
         }
      }
   },
   mounted() {
      this.components = this.product.components.slice(0);
   },
}
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.search {
  text-align: left;
  width: 200px;
  padding: 10px;
}
.search-input {
  border-radius: 25px;
  height: 30px;
  padding-left: 10px;
  padding-right: 10px;
}
.search-results {
   border-radius: 8px;
   border: solid 1px var(--info-color);
   padding: 5px;
}
.bundle-price {
   color: var(--primary-color);
   font-weight: bold;
   margin: 4px;
}
.calculated-price {
   color: var(--danger-color);
   font-weight: bold;
   margin: 4px;
}
</style>