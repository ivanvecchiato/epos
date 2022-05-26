<template>
   <div>
      <div class="search">
         <input id="search" class="form-input search-input" :placeholder="$t('generic.search')"
           v-model="searchInput" @input="inputChange()"/>
         <div class="search-results" v-if="results.length > 0">
            <ul style="max-height: 100px; overflow:scroll">
               <li v-for="p in results" :key="p.id" @click="selectProd(p)">
                  {{p.name}}
               </li>
            </ul>
         </div>
      </div>
      <div class="composition">
         <ul>
            <li class="component-list" v-for="c, index in options" :key="c.id">
               <el-row :gutter="20" align="middle">
                  <el-col :span="8">{{c.name}}</el-col>
                  <el-col :span="4">
                     <input class="form-input" style="margin-top: 3px" size=5 v-model="c.delta_price"/>
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
      </div>
   </div>
</template>

<script>
import utils from '@/utils.js'

export default {
   name: 'ProductOption',
   components: [],
   props: ['suboptions', 'catalog', 'step'],
   data() {
      return {
         options: [],
         searchInput: '',
         results: []
      }
   },
   methods: {
      deleteItem: function(index) {
         this.options.splice(index, 1);
      },
      formatPrice: function(price) {
         return utils.formatPrice(price)
      },
      removeOption: function(c) {
         var i=0;
         while (i<this.options.length) {
            if(this.options[i].id == c.id) {
               this.options.splice(i, 1);
               break;
            }
            i++;
         }
      },
      selectProd: function(p) {
         var component = {
            id: p.id,
            code: p.code,
            name: p.name
         };
         this.options.push(component);
         this.$emit('optionsUpdate', this.step, this.options)
         this.searchInput = '';
         this.results = [];
      },
      inputChange: function() {
         var input = this.searchInput;
         if(input.length<2) return;

         this.results = [];
         this.resultCount = 0;
         for(var p in this.catalog) {
           var name = this.catalog[p].name;
           if((name.toLowerCase()).search(input.toLowerCase()) != -1) {
             this.results.push(this.catalog[p]);
           }
         }
      }
   },
   mounted() {
      this.options = this.suboptions.slice(0);
   },
}
</script>

<style scoped>
.search {
   float: left;
   padding: 10px;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>