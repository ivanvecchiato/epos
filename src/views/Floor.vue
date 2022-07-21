<template>
  <div class="floor">
    <div class="areas-toolbar">

      <div class="area-buttons">
        <div class="search">
           <input class="search-input" :placeholder="$t('generic.search')"
              v-model="searchInput"
              @input="inputChange()"/>
        </div>
        <el-button
          type="info"
          round
          v-for="area in areas"
          :key="area.id"
          :class="getButtonClass(area.id)"
          @click="selectArea(area)">
          {{ area.name }}
        </el-button>

        <el-button
          round
          class="button-new"
          @click="addArea">
          {{$t('floor.new_area')}}
        </el-button>
      </div>
      <div class="area-indicator" :style="setColor(currentArea.color)"></div>
    </div>
    <div class="grid">
      <div v-if="getPlaces(currentArea) == 0">
        <img src="@/assets/icons/not_found.png"/>
      </div>
      <div v-else v-for="t in currentArea.places" :key="t.name" class="table">
        <div class="inner-table" @click="selectTable(t)">
          <Popper
            offsetSkid="100"
            offsetDistance="-20"
            :show="t.showMenu">
              <span :class="getStatusClass(t)" @click.stop="t.showMenu=true">{{t.name}}</span>
              <template #content>
                <span class="menu-header">{{$t('bill.place', {description: t.name})}}</span>
                <el-divider></el-divider>
                <span class="menu-item" @click="selectTable(t)">
                  <el-icon :size="24" style="vertical-align: middle;">
                    <shopping-cart-full />
                  </el-icon>
                  {{$t('orders.order')}}</span>
                <el-divider></el-divider>
                <span class="menu-item">
                  <el-icon :size="24" style="vertical-align: middle;">
                    <calendar />
                  </el-icon>
                  {{$t('booking.booking')}}</span>
                <el-divider></el-divider>
                <span class="menu-item">
                  <el-icon :size="24" style="vertical-align: middle;">
                    <delete />
                  </el-icon>
                  {{$t('generic.deletion')}}</span>
                <el-divider></el-divider>
                <span class="menu-item" @click.stop="move">
                  <el-icon :size="24" style="vertical-align: middle;">
                    <location />
                  </el-icon>
                  {{$t('modification.move')}}</span>
                <el-divider></el-divider>
                <span class="menu-item" @click.stop="t.showMenu=false">
                  <el-icon :size="24" style="vertical-align: middle;">
                    <circle-close />
                  </el-icon>
                  {{$t('generic.close')}}</span>
              </template>
          </Popper>
          <div v-if="tableBusy(t)">
            <div class="table-last-modification">
              <el-icon style="vertical-align: middle;" color="#F9A825" :size="18"><clock/></el-icon>
              {{getLastMod(t)}}
            </div>
            <div class="table-order-amount">
              <el-icon style="vertical-align: middle;" color="#FB8C00" :size="18">
                <coin/>
              </el-icon>
              {{getAmount(t)}}
            </div>
            <div class="table-order-quantity">
              <el-icon style="vertical-align: middle;" color="#667BCC" :size="18">
                <shopping-cart-full/>
              </el-icon>
              {{getQuantity(t)}} {{$t('product.products')}}
            </div>
            <div class="table-show-details">
              <el-icon @click.stop="showOrder(t)" color="#667BCC" :size="24">
                <tickets/>
              </el-icon>
            </div>
          </div>
        </div>

      </div>
    </div>

    <el-dialog
      :title="currentConto.place"
      v-model="showContoDetail"
      :center="false"
      custom-class="dialog"
      width="40%"
      destroy-on-close>
      <order-list
        :order="currentConto"
        @onChange="onChange"
        @onDelete="onDelete">
      </order-list>
      
    </el-dialog>
  </div>
</template>

<script>
import Conto from "../data/Conto.js";
import Firebase from "../firebase.js";
import Popper from "vue3-popper";
import '../popper-theme.css'
import { Calendar, Delete, ShoppingCartFull, Location, Clock, CircleClose, Coin, Tickets } from '@element-plus/icons'
import OrderList from "../components/OrderList.vue";
import utils from "../utils.js";

export default {
  name: "Floor",
  components: { Popper, Calendar, Delete, ShoppingCartFull, Location, Clock, OrderList, CircleClose, Coin, Tickets },
  props: ['order'],
  data() {
    return {
      areas: [],
      currentArea: {},
      showContoDetail: false,
      currentConto: {},
      searchInput: '',
    };
  },
  methods: {
    inputChange: function() {
      var input = this.searchInput;
      if(input.length==0) {
         this.results = [];
         return;
      }
      this.results = [];
      this.resultCount = 0;
      for(var i=0; i<this.areas.length; i++) {
         var area = this.areas[i];
         this.results[i] = [];
         for(var p in area.places) {
            var name = "" + area.places[p].name;
            if((name.toLowerCase()).startsWith(input.toLowerCase())) {
               this.resultCount++;
               this.results[i].push(area.places[p])
            }
         }
      }
    },
    getPlaces: function(area) {
      var count = 0;
      for(var key in area.places) {
      if(Object.prototype.hasOwnProperty.call(area.places, key))
        count++;
      }
      return count;
    },
    showOrder: function(t) {
      this.showContoDetail = true;
      this.currentConto = t.conto;
    },
    tableBusy: function(t) {
      if(t.conto == null) return false;
      else return t.conto.size()>0;
    },
    move: function() {
      this.$message({
          message: this.$t('modification.move_explain'),
          type: 'error',
          showClose: false,
          duration: 0
        })
    },
    selectTable: function(table) {
      this.$router.push({
        name: 'frontend',
        params: {
          place: JSON.stringify({
            id: table.key,
            name: table.name,
            area: {
              docId: this.currentArea.docId,
              id: this.currentArea.id,
              name: this.currentArea.name
            }
          })
        }
      })
    },
    getStatusClass: function(t) {
      if(t.conto == null) {
        return 'table-name-free';
      } else {
        if(t.conto.size()>0) {
          return 'table-name-busy';
        }
        else {
          return 'table-name-free';
        }
      }
    },
    setColor: function(color) {
      return "background-color: " + color;
    },
    getLastMod: function(t) {
      if(t.conto.size() > 0) {
        var now = new Date();
        var h = 0;
        var d = 0;
        var min = Math.floor((now.getTime()/1000 - t.conto.lastModified.toDate().getTime()/1000)/60);
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
    getQuantity: function(t) {
      return t.conto.getQuantity();
    },
    getAmount: function(t) {
      return utils.formatPriceWithCurrency(t.conto.getTotaleNetto());
    },
    selectArea: function(c) {
      this.currentArea = c;
    },
    getNextAreaId: function() {
      var max=0;
      for(var i=0; i<this.areas.length; i++) {
        if(this.areas[i].id > max) {
          max = this.areas[i].id;
        }
      }
      return Number(max+1);
    },
    addArea: function() {
      this.$prompt('', this.$t('floor.new_area'), {
          confirmButtonText: this.$t('generic.ok'),
          cancelButtonText: this.$t('generic.cancel')
        })
        .then(({ value }) => {
          Firebase.db.collection('park')
            .add({
              id: this.getNextAreaId(),
              name: value,
              places: {}
            })
            .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        })
        .catch(() => {
        })
    },
    getButtonClass: function(areaId) {
      if(this.currentArea == null || areaId != this.currentArea.id) {
        return 'button-idle';
      } else {
        return 'button-active'
      }
    },
    getParks: function() {
      var self = this;
      Firebase.db
        .collection("park")
        .orderBy("order")
        .onSnapshot((snapshotChange) => {
          self.areas = [];
          snapshotChange.forEach((doc) => {
            var area = doc.data();
            area.docId = doc.id;
            var places = area.places;
            for(var n in places) {
              if(places[n].conto != null) {
                var conto = new Conto;
                conto.fillData(places[n].conto);
                places[n].conto = conto;
                places[n].showMenu = false;
              }
              places[n].key = n;
            }
            self.areas.push(area);
          });
          self.currentArea = self.areas[0];
          console.log(self.currentArea.places)
        });
    }
  },
  mounted() {
    this.getParks();
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: auto;
  grid-row-gap: 15px;
  grid-column-gap: 15px;
  margin: 10px;
  padding-right: 10px;
  text-align: center;
}
.table {
  min-height: 110px;
  position: relative;
  top: 1px;
  left: 1px;
  background: #fff;
  border: 0px solid rgb(150, 155, 162);
  border-radius: 8px;
  padding: 0px;
}
.inner-table {
  min-height: 90px;
}
.table-name-free {
  font-weight: bold;
  font-size: 2.0em;
  position: absolute;
  top:-5px;
  right: -5px;
  border-radius: 8px;
  background: rgb(255, 255, 255);
  width: 50px;
  height: 40px;
  padding: 4px;
  text-align: center;
  box-shadow: 3px 3px 3px rgb(151, 114, 114, 0.4);
}
.table-name-busy {
  font-weight: bold;
  font-size: 2.0em;
  position: absolute;
  top:-5px;
  right: -5px;
  background: var(--secondary-color);
  color: white;
  border-radius: 8px;
  width: 50px;
  height: 40px;
  padding: 4px;
  text-align: center;
  box-shadow: 3px 3px 3px rgb(151, 114, 114, 0.4);
}
.table-order-quantity {
  position: absolute;
  font-size: 0.9em;
  bottom: 5px;
  left: 10px;
  min-width: 90px;
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
  font-size: 0.9em;
  bottom: 30px;
  left: 10px;
  min-width: 90px;
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
  left: 10px;
  color: #000;
  font-weight: bold;
}
.table-show-details {
  position: absolute;
  display: block;
  bottom: 5px;
  right: 15px;
}
.menu-item:hover {
  font-weight: bold;
  vertical-align: middle;
}
.menu-header {
  color: #000;
  font-weight: bold;
}
.area-buttons {
  display: flex;
  flex: 1;
  overflow-x: auto;
  padding-top: 10px;
  padding-left: 10px;
  flex-flow: row nowrap;
  align-items: center;
}
.area-buttons::-webkit-scrollbar {
  display: none;
}
.area-indicator {
  height: 5px;
  margin: 5px;
  width: 70%;
}
.button-active {
  background-color: var(--secondary-color);
  border: 0px;
  font-size: 1.2em;
  font-family: "Montserrat";
  font-weight: bold;
  min-width: 150px;
}
.button-idle {
  min-width: 150px;
  background-color: #fff;
  color: var(--primary-color);
  font-family: "Montserrat";
  font-weight: bold;
  font-size: 1.2em;
  border: 0px solid var(--primary-color);
}
.button-new {
  min-width: 150px;
  font-weight: bold;
  font-family: "Montserrat";
  font-size: 1.2em;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
}
.dialog {
  background: red;
}
.search {
  text-align: left;
  padding: 10px;
}
.search-input {
   border-radius: 30px;
   width: 150px;
   height: 35px;
   border: solid 1px var(--secondary-color);
   color: var(--secondary-color);
   font-weight: bold;
   font-size: 1.2em;
   background: transparent;
   padding-left: 10px;
   padding-right: 10px;
}
</style>
