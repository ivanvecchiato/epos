<template>
  <div class="floor">
      <!--
    <div class="areas-toolbar">
      <div class="area-buttons">
        <el-button
          type="info"
          round
          v-for="area in areas"
          :key="area.id"
          :class="getButtonClass(area.id)"
          @click="selectArea(area)"
        >
          {{ area.name }}
        </el-button>

        <el-button round class="button-new" @click="addArea">
          {{ $t("floor.new_area") }}
        </el-button>
      </div>
      <div class="area-indicator" :style="setColor(currentArea.color)"></div>
    </div>
  -->
    <div class="grid">
      <div v-if="getPlaces(currentArea) == 0">
        <img src="@/assets/icons/not_found.png" />
      </div>
      <div
        v-else
        v-for="t in currentArea.places"
        :key="t.name"
        class="table"
        @click="selectTable(t)"
      >
        <div class="color-indicator" :style="getBgc(t)" />
        <span class="table-name">{{ t.name }}</span>
        <div class="moving-warning" v-if="isMoving(t)">
          <div>
            <Right style="width: 2em; height: 2em" />
          </div>
          <div>
            {{ $t("modification.move_explain") }}
          </div>
          <button class="danger" @click.stop="undoMove">
            {{ $t("generic.cancel") }}
          </button>
        </div>
        <div v-else class="inner-table">
          <div v-if="tableBusy(t)">
            <div class="table-last-modification">
              <el-icon style="vertical-align: middle" color="#F9A825" :size="18"
                ><clock
              /></el-icon>
              {{ getLastMod(t) }}
            </div>
            <div class="table-order-amount">
              <el-icon style="vertical-align: middle" color="#FF5621" :size="18">
                <coin />
              </el-icon>
              {{ getAmount(t) }}
            </div>
            <div class="table-order-quantity">
              <el-icon style="vertical-align: middle" color="#102A68" :size="18">
                <shopping-cart-full />
              </el-icon>
              {{ getQuantity(t) }} {{ $t("product.products") }}
            </div>
            <div class="table-show-details" @click.stop="showOrder(t)">
              <el-icon class="button-icon" color="#ffffff" :size="16">
                <MoreFilled />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showContoDetail"
      :center="false"
      custom-class="dialog"
      width="40%"
      destroy-on-close
    >
      <order-list :conto="currentConto" @moveConto="moveConto" @deleteConto="deleteConto">
      </order-list>
    </el-dialog>
  </div>
</template>

<script>
import Status from "../data/Status.js";
import Conto from "../data/Conto.js";
import Firebase from "../firebase.js";
import { ShoppingCartFull, Clock, Coin, MoreFilled, Right } from "@element-plus/icons";
import OrderList from "../components/OrderList.vue";
import utils from "../utils.js";
import repo from "@/db/repo.js";

export default {
  name: "Floor",
  components: { ShoppingCartFull, Clock, OrderList, Coin, MoreFilled, Right },
  props: ["order"],
  data() {
    return {
      areas: [],
      currentArea: {},
      showContoDetail: false,
      currentConto: {},
      searchInput: "",
      contiAperti: [],
      movingTab: null,
    };
  },
  methods: {
    undoMove: function () {
      this.movingTab = null;
    },
    moveConto: function () {
      this.showContoDetail = false;
      this.move(this.currentConto);
    },
    deleteConto: function() {
      this.showContoDetail = false;
      this.deleteTab(this.currentConto);
    },
    getBgc: function (t) {
      var style = "background-color: ";
      if(t.status != undefined) {
        if(t.status == Status.locked) {
          style += " var(--danger-color);";
        } else {
          style += "rgb(232, 232, 232)";
        }
      } else {
        style += "rgb(232, 232, 232)";
      }

      return style;
    },
    isMoving: function (t) {
      if (this.movingTab == null) return false;

      if (
        this.movingTab.place.areaDocId == this.currentArea.docId &&
        this.movingTab.place.placeId == t.key
      ) {
        return true;
      } else return false;
    },
    getPlaces: function (area) {
      var count = 0;
      for (var key in area.places) {
        if (Object.prototype.hasOwnProperty.call(area.places, key)) count++;
      }
      return count;
    },
    showOrder: function (t) {
      this.showContoDetail = true;
      this.currentConto = t.conto;
    },
    tableBusy: function (t) {
      if (t.conto == null) return false;
      else return t.conto.size() > 0;
    },
    move: function (tab) {
      this.movingTab = tab;
    },
    deleteTab: function(tab) {
      console.log("deleteTab", tab);
      repo.deleteConto(
        tab.id,
        tab.place,
        function() {
          console.log("Tab Deleted")
        }
      );
    },
    moveTab: function (tab, destination) {
      console.log("moveTab", tab, destination);
      this.movingTab = null;

      var source = {
        areaId: tab.place.areaDocId,
        areaName: tab.place.areaName,
        placeId: tab.place.placeId,
        placeName: tab.place.placeName,
      };

      var docRef = Firebase.db.collection("park").doc(destination.areaId);
      var key = "places." + destination.placeId + ".contoId";
      docRef
        .update({
          [key]: this.currentConto.id,
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      docRef = Firebase.db.collection("park").doc(source.areaId);
      key = "places." + source.placeId + ".contoId";
      docRef
        .update({
          [key]: "",
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      var ref = Firebase.db.collection("conti").doc(tab.id);
      ref.update({
        place: destination,
      });
    },
    setTableSelected: function(table) {
      table.status = Status.locked;
    },
    selectTable: function (table) {
      var destination = {
        areaId: this.currentArea.docId,
        areaName: this.currentArea.name,
        placeId: table.key,
        placeName: table.name,
      };
      if (this.movingTab != null) {
        this.moveTab(this.movingTab, destination);
      } else {
        this.$bus.trigger("loadConto", {
          place: {
                placeId: table.key,
                placeName: table.name,
                areaDocId: this.currentArea.docId,
                areaName: this.currentArea.name,
              },
          billId: table.contoId,
        });
      }
      this.setTableSelected(table);
    },
    setColor: function (color) {
      return "background-color: " + color;
    },
    getLastMod: function (t) {
      if (t.conto.size() > 0) {
        var now = new Date();
        var h = 0;
        var d = 0;
        var min = Math.floor(
          (now.getTime() / 1000 - t.conto.lastModified.toDate().getTime() / 1000) / 60
        );
        h = Math.floor(min / 60);
        if (h > 0) {
          min = min % 60;
        }
        d = Math.floor(h / 24);
        if (d > 0) {
          h = h % 24;
        }
        var time = "";
        if (d > 0) {
          time = d + " day\u2022";
        }
        if (h > 0) {
          time += h + " h\u2022";
        }
        time += min + " min";
        return time;
      } else {
        return "";
      }
    },
    getQuantity: function (t) {
      return t.conto.getQuantity();
    },
    getAmount: function (t) {
      return utils.formatPriceWithCurrency(t.conto.getTotaleNetto());
    },
    selectArea: function (c) {
      this.currentArea = c;
    },
    getNextAreaId: function () {
      var max = 0;
      for (var i = 0; i < this.areas.length; i++) {
        if (this.areas[i].id > max) {
          max = this.areas[i].id;
        }
      }
      return Number(max + 1);
    },
    addArea: function () {
      this.$prompt("", this.$t("floor.new_area"), {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
      })
        .then(({ value }) => {
          Firebase.db
            .collection("park")
            .add({
              id: this.getNextAreaId(),
              name: value,
              places: {},
            })
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        })
        .catch(() => {});
    },
    getButtonClass: function (areaId) {
      if (this.currentArea == null || areaId != this.currentArea.id) {
        return "button-idle";
      } else {
        return "button-active";
      }
    },
    getConto(id) {
      var selected = null;
      var conto = new Conto();
      for (var i = 0; i < this.contiAperti.length; i++) {
        if (this.contiAperti[i].id == id) {
          selected = this.contiAperti[i];
          break;
        }
      }
      conto.fillData(selected);
      return conto;
    },
    getParks: function () {
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
            for (var n in places) {
              if (places[n].contoId != "") {
                places[n].conto = this.getConto(places[n].contoId);
              }
              places[n].key = n;
            }
            self.areas.push(area);
          });
          self.currentArea = self.areas[0];
          console.log(self.currentArea.places);
        });
    },
  },
  mounted() {
    var self = this;
    repo.getOpenTabs(function (docs) {
      self.contiAperti = docs;
      //self.getParks();
      repo.getParks(function (data) {
        self.areas = [];
        self.areas.push({places: data});
        self.currentArea = self.areas[0];
      });
    });
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
  min-height: 120px;
  position: relative;
  top: 1px;
  left: 1px;
  background: #fff;
  border: 0px solid rgb(150, 155, 162);
  border-radius: 8px;
  padding: 0px;
}
.inner-table {
  margin-left: 12px;
  padding: 10px;
}

.table-name {
  font-weight: bold;
  font-size: 2.4em;
  position: absolute;
  top: 0px;
  right: 0px;
  border-radius: 8px;
  background: rgb(255, 255, 255);
  width: 50px;
  height: 40px;
  padding: 4px;
  text-align: center;
  color: var(--primary-color);
}

.table-order-quantity {
  position: absolute;
  font-size: 0.9em;
  bottom: 5px;
  left: 14px;
  min-width: 90px;
  text-align: left;
  color: var(--primary-color);
  text-transform: lowercase;
  border: solid 0px var(--primary-color);
  border-radius: 4px;
  background: #667acc30;
  padding: 1px 4px;
  font-weight: 500;
}
.table-order-amount {
  position: absolute;
  font-size: 0.9em;
  bottom: 30px;
  left: 14px;
  text-align: left;
  min-width: 90px;
  color: var(--success-color);
  text-transform: lowercase;
  border: solid 0px var(--success-color);
  border-radius: 4px;
  background: #fc6a8230;
  padding: 1px 4px;
  font-weight: 500;
}
.table-last-modification {
  position: absolute;
  font-size: 0.9em;
  top: 5px;
  left: 14px;
  color: #000;
  font-weight: normal;
}
.table-show-details {
  position: absolute;
  bottom: 5px;
  right: 15px;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(220, 151, 213, 0.473);
}
.button-icon {
  position:relative;
  top: calc(50% - 8px); /* 50% - 3/4 of icon height */
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
  font-weight: bold;
  min-width: 150px;
}
.button-idle {
  min-width: 150px;
  background-color: #fff;
  color: var(--primary-color);
  font-weight: bold;
  font-size: 1.2em;
  border: 0px solid var(--primary-color);
}
.button-new {
  min-width: 150px;
  font-weight: bold;
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

.color-indicator {
  width: 12px;
  height: 100%;
  background: rgb(232, 232, 232);
  margin-right: 10px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  position: absolute;
  top: 0px;
  left: 0px;
}
.moving-warning {
  position: absolute;
  text-align: left;
  bottom: 0px;
  margin-left: 12px;
  padding: 10px;
}
</style>
