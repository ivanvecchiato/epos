<template>
   <div>
      <div>
         <el-dropdown>
           <span class="el-dropdown-link">
            <div class="search">
               <input class="search-input" :placeholder="$t('generic.search')"
                  v-model="searchInput"
                  @input="inputChange()"/>
            </div>
           </span>
           <template #dropdown>
             <el-dropdown-menu>
               <el-dropdown-item v-for="result in results"
                  :key="result.id"
                  @click="handlePlaceSelection(result)">
                  <span>{{result.area + "/" + result.place.name}}</span>
               </el-dropdown-item>
             </el-dropdown-menu>
           </template>
         </el-dropdown>
      </div>
      <!--
      <div class="area-selector">
         <div v-for="area, index in areas" :key="area.id">
            <el-badge :value="openBills[index]" class="item" :type="getBadgeType(index)">
               <span class="area">
                  {{ area.name }}
               </span>
            </el-badge>
            <ul>
               <li
                  v-for="result in results[index]"
                  :key="result.id"
                  @click="handlePlaceSelection(area, result)">
                  <div style="min-height: 70px; position: relative;">
                     <div class="place-name">
                        <el-icon style="vertical-align: middle;" :size="18" color="#FF5621"><location /></el-icon>
                        {{result.name}}
                     </div>
                     <div class="table-last-modification">
                       <el-icon style="vertical-align: middle;" color="#F9A825" :size="18"><clock/></el-icon>
                       {{getLastMod(result)}}
                     </div>
                     <div class="table-order-amount">
                       <el-icon style="vertical-align: middle;" color="#FB8C00" :size="18">
                         <coin/>
                       </el-icon>
                       {{getAmount(result)}}
                     </div>
                     <div class="table-order-quantity">
                       <el-icon style="vertical-align: middle;" color="#667BCC" :size="18">
                         <shopping-cart-full/>
                       </el-icon>
                       {{getQuantity(result)}} {{$t('product.products')}}
                     </div>
                  </div>
               </li>
            </ul>
         </div>
      </div>
      -->
      <div v-if="notFound" class="not-found">
         {{$t('bill.noBills')}}
      </div>

   </div>
</template>

<script>
import Conto from "@/data/Conto.js";
import utils from "@/utils.js";
import Firebase from "../../firebase.js";
//import { Location, ShoppingCartFull, Clock, Coin } from "@element-plus/icons";

export default {
   name: "PlaceSelector",
   props: ['data'],
   data() {
      return {
         areas: [],
         currentArea: null,
         results: [],
         resultCount: 0,
         searchInput: '',
         openBills: []
      }
   },
//   components: {Location, ShoppingCartFull, Clock, Coin},
   computed: {
      notFound: function() {
         if(this.searchInput.length == 0) {
            return false;
         } else if(this.resultCount == 0) {
            return true;
         }
         return false;
      }
   },
   methods: {
      getBadgeType: function(index) {
         if(this.openBills[index]>0) return 'danger'
         else return 'info';
      },
      inputChange: function() {
         console.log('----------------------')
         var input = this.searchInput;
         if(input.length==0) {
            this.results = [];
            return;
         }
         this.results = [];
         this.resultCount = 0;
         for(var i=0; i<this.areas.length; i++) {
            var area = this.areas[i];
            for(var p in area.places) {
               var name = "" + area.places[p].name;
               if((name.toLowerCase()).startsWith(input.toLowerCase())) {
                  this.resultCount++;
                  var obj = {
                     area: area.name,
                     place: area.places[p]
                  }
                  this.results.push(obj)
               }
            }
         }
      },
      handlePlaceSelection: function(area, selectedPlace) {
         selectedPlace['area'] = {
            docId: area.docId,
            name: area.name
         };
         this.$emit('selectPlace', selectedPlace);
      },
      getLastMod: function(place) {
         if(place.conto == null) return;
         if(place.conto.size() > 0) {
           var now = new Date();
           var h = 0;
           var d = 0;
           var min = Math.floor((now.getTime()/1000 - place.conto.lastModified.toDate().getTime()/1000)/60);
           h = Math.floor(min/60);
           if(h > 0) {
             min = min % 60;
           }
           d = Math.floor(h/24);
           if(d > 0) {
             h = h % 24;
           }
           var time = '';
           if(d>0) {
             time = d + " day\u2022";
           }
           if(h>0) {
             time += h + " h\u2022";
           }
           time += min + " min";
           return time;
         } else {
           return '';
         }
      },
      getAmount: function(place) {
         if(place.conto != null && place.conto.orderList != undefined) {
            return utils.formatPriceWithCurrency(place.conto.getTotaleNetto());
         } else {
            return utils.formatPriceWithCurrency(0);
         }
      },
      getQuantity: function(place) {
         if(place.conto != null) {
            return place.conto.getQuantity();
         } else {
            return 0
         }
      },
      getParks: function() {
         var self = this;
         Firebase.db
            .collection("park")
            .orderBy("order")
            .onSnapshot((snapshotChange) => {
               self.areas = [];
               self.openBills = [];
               snapshotChange.forEach((doc) => {
                  var counter = 0;
                  var area = doc.data();
                  area.docId = doc.id;
                  var places = area.places;
                  for(var n in places) {
                     if(places[n].conto != null) {
                       var conto = new Conto;
                       conto.fillData(places[n].conto);
                       if(conto.size() > 0) {
                          counter++;
                       }
                       places[n].conto = conto;
                     }
                     places[n].id = n;
                  }
                  self.openBills.push(counter)
                  self.areas.push(area);
               });
            });
      },
   },
   mounted() {
      this.getParks();
   },
}
</script>

<style scoped>
.area {
   display: block;
   min-width: 180px;
   text-align: center;
   background-color: #fff;
   color: var(--primary-color);
   font-weight: bold;
   font-size: 1.2em;
   border: 1px solid var(--primary-color);
   border-radius: 8px;
}
ul {
   list-style-type: none;
	list-style: none;
	padding: 0;
	width: 100%;
}
ul li {
   margin: 5px;
	padding: .5em;
   border-radius: 4px;
   border: 1px solid var(--secondary-color);
   text-align: left;
}
ul li:last-child {
	border-bottom: 1;
}
.area-selector {
   margin-top: 10px;
   display: flex;
   flex-direction: row;
   text-align: center;
}
.place-name {
   font-weight: bold;
   font-size: 1.5em;
}
.search {
  text-align: left;
  width: 200px;
  padding: 10px;
}
.search-input {
   border-radius: 30px;
   height: 30px;
   border: solid 1px var(--secondary-color);
   color: var(--secondary-color);
   font-weight: bold;
   font-size: 1.2em;
   background: var(--light-secondary-color);
   padding-left: 10px;
   padding-right: 10px;
}
.search-input:focus {
   outline: none;
}
.table-order-quantity {
  position: absolute;
  font-size: 0.8em;
  bottom: 5px;
  right: 0px;
  color: var(--primary-color);
  text-transform: lowercase;
  border: solid 1px var(--primary-color);
  border-radius: 4px;
  background: #667acc20;
  padding: 1px 4px;
  font-weight: bold;
}
.table-order-amount {
  position: absolute;
  font-size: 0.8em;
  bottom: 5px;
  left: 0px;
  color: var(--success-color);
  text-transform: lowercase;
  border: solid 1px var(--success-color);
  border-radius: 4px;
  background: #fc6a8220;
  padding: 1px 4px;
  font-weight: bold;
}
.table-last-modification {
  position: absolute;
  font-size: 0.9em;
  top: 5px;
  right: 10px;
  color: #000;
  font-weight: bold;
}
.not-found {
   font-size: 1.5em;
   font-weight: bold;
   color: var(--danger-color);
   text-align: center;
}
 .item {
    margin-top: 10px;
    margin-right: 20px;
  }
</style>