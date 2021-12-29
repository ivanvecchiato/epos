<template>
  <div class="floor">
    <div class="areas-toolbar">
      <div class="area-buttons">
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
    </div>
    <div class="grid">
    <div v-for="t in currentArea.places" :key="t.id" class="table">
      <Popper
        offsetSkid="100"
        offsetDistance="-20">
        <div class="inner-table">
          <div :class="getStatusClass(t)">&nbsp;</div>
          <span class="table-name">{{t.name}}</span>
          <div class="table-last-modification">{{getLastMod(t)}}</div>
        </div>
        <template #content>
          <span class="menu-header">{{$t('bill.place', {description: t.name})}}</span>
          <el-divider></el-divider>
          <span class="menu-item" @click="selectTable(t.id)">
            <el-icon>
              <shopping-cart />
            </el-icon>
            {{$t('bill.order')}}</span>
          <el-divider></el-divider>
          <span class="menu-item">
            <el-icon>
              <calendar />
            </el-icon>
            {{$t('booking.booking')}}</span>
          <el-divider></el-divider>
          <span class="menu-item">
            <el-icon>
              <delete />
            </el-icon>
            {{$t('generic.deletion')}}</span>
          <el-divider></el-divider>
          <span class="menu-item" @click="move">
            <el-icon>
              <location />
            </el-icon>
            {{$t('modification.move')}}</span>
        </template>
      </Popper>
    </div>
    </div>
  </div>
</template>

<script>
import Order from "../data/Order.js";
import Firebase from "../firebase.js";
import Popper from "vue3-popper";
import '../popper-theme.css'
import { Calendar } from '@element-plus/icons'
import { Delete } from '@element-plus/icons'
import { ShoppingCart } from '@element-plus/icons'
import { Location } from '@element-plus/icons'

export default {
  name: "Floor",
  components: { Popper, Calendar, Delete, ShoppingCart, Location },
  props: ['order'],
  data() {
    return {
      areas: [],
      currentArea: {}
    };
  },
  methods: {
    move: function() {
      this.$message({
          message: this.$t('modification.move_explain'),
          type: 'error',
          showClose: false,
          duration: 0
        })
    },
    selectTable: function(tableId) {
      this.$router.push({
        name: 'frontend',
        params: {
          room: JSON.stringify({
            docId: this.currentArea.docId,
            id: this.currentArea.id,
            name: this.currentArea.name}),
          place: tableId
        }
      })
    },
    getStatusClass: function(t) {
      if(t.order.size()>0) {
        return 'status-busy';
      }
      else {
        return 'status-free';
      }
    },
    getLastMod: function(t) {
      if(t.order.size() > 0) {
        var now = new Date();
        var h = 0;
        var d = 0;
        var min = Math.floor((now.getTime()/1000 - t.order.lastModified.toDate().getTime()/1000)/60);
        h = Math.floor(min/60);
        if(h > 0) {
          min = min % 60;
        }
        d = Math.floor(h/24);
        if(d > 0) {
          h = h % 24;
        }
        return d + " day - " + h + " h - " + min + " min";
      } else {
        return '';
      }
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
              places: []
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
      Firebase.db
        .collection("park")
        .orderBy("id")
        .onSnapshot((snapshotChange) => {
          this.areas = [];
          snapshotChange.forEach((doc) => {
            var area = doc.data();
            area.docId = doc.id;
            var places = area.places;
            for(var n=0; n<places.length; n++) {
              var order = new Order;
              order.fillData(places[n].order);
              places[n].order = order;
            }
            this.areas.push(area);
            console.log(area.name)
          });
          this.currentArea = this.areas[0];
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
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: auto;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  margin: 10px;
  text-align: left;
}
.table {
  min-height: 90px;
  position: relative;
  top: 1px;
  left: 1px;
  border: 1px solid var(--info-color);
  border-radius: 8px;
  padding: 0px;
}
.inner-table {
  min-height: 90px;
}
.table-name {
  font-weight: bold;
  font-size: 2.0em;
  position: absolute;
  top:5px;
  right: 5px;
}
.status-free {
  width: 12px;
  min-height: 90px;
  background: rgb(164, 189, 235);
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  height: 100%;
}
.status-busy {
  min-height: 90px;
  width: 12px;
  background: rgb(216, 29, 29);
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  height: 100%;
}
.table-last-modification {
  position: absolute;
  font-size: 0.9em;
  bottom: 5px;
  left: 15px;
  color: #000;
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
.button-active {
  background-color: var(--secondary-color);
  border: 0px;
  font-size: 1.2em;
  font-weight: bold;
  min-width: 150px;
}
.button-idle {
  min-width: 150px;
  background-color: var(--lightest-main-color);
  color: var(--primary-color);
  font-weight: bold;
  font-size: 1.2em;
  border: 1px solid var(--primary-color);
}
.button-new {
  min-width: 150px;
  font-weight: bold;
  font-size: 1.2em;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
}
</style>
