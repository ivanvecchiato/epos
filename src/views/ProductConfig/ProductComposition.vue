<template>
   <div>
      <div v-if="composition == undefined || composition.length==0">
         {{$t('product.no_components')}}
      </div>
      <ul>
         <li class="component-list" v-for="c in components" :key="c.id">
            <el-tag closable @close="removeComponent(c)">{{c.name}}</el-tag>
         </li>
      </ul>
      <div class="search">
         <input class="form-input search-input" :placeholder="$t('generic.search')"
           v-model="searchInput" :oninput="inputChange()"/>
            <i class="el-input__icon el-icon-search" @click="searchItem"></i>
      </div>
      <div class="search-results" v-if="results.length > 0">
         <ul style="max-height: 100px; overflow:scroll">
            <li v-for="p in results" :key="p.id" @click="selectProd(p)">
               {{p.name}}
            </li>
         </ul>
      </div>
   </div>
</template>

<script>
export default {
   name: 'ProductComposition',
   props: ['composition', 'catalog'],
   data() {
      return {
         loaded: false,
         components: [],
         searchInput: '',
         results: []
      }
   },
   methods: {
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
         this.components.push(p);
         this.$emit('componentsUpdate', this.components)
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
   },
   mounted() {
     this.components = this.composition;
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

.component-list {
  float: left;
  margin: 5px;
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
</style>