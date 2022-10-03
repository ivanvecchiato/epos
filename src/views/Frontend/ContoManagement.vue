<template>
  <div class="conto">
    <header>
      <div class="info-conto-2" v-if="billLoaded == true">
        <el-icon
          style="vertical-align: middle"
          :color="getAttentionColor()"
          :size="14"
        >
          <edit />
        </el-icon>
        <span style="vertical-align: middle">{{ billStart() }}</span>
      </div>
      <div class="bottom-header">
        <div class="note">
          <el-icon
            :size="24"
            v-on:click.stop
            :color="getNoteColor()"
            @click="setNote"
          >
            <edit />
          </el-icon>
        </div>
      </div>
    </header>

    <div style="text-align:center; padding:10px; border-top: dashed 1px #6f788d;">
      <el-button size="small" class="toggle-button"
        :type="currentView == 'order' ? 'info' : 'default'"
        color="#102A68" round @click="currentView='order'">
        {{$t('orders.order')}}
      </el-button>
      <el-button size="small" class="toggle-button"
        :type="currentView == 'order' ? 'default' : 'info'"
        color="#102A68" round @click="currentView='bill'">
        {{$t('bill.bill')}}
      </el-button>
    </div>
    <main ref="cart">
      <div v-if="currentView=='bill'">
        <shopping-cart
          @showItem="showItemDetails"
          :orderList="groupedList">
        </shopping-cart>
      </div>
      <div v-else>
        <order-cart
          @showItem="showItemDetails"
          :orderList="conto.orderList">
        </order-cart>
      </div>
    </main>

    <footer>
      <div v-if="currentView=='bill'">
        <div class="flat-card">
          <div class="subtotale-section">
            <span class="subtotale-label">
              {{ $t("bill.subtotal") }}
            </span>
            <span class="subtotale-amount">
              {{ subtotale }}
            </span>
          </div>

          <div class="sconto-section" @click="openDiscount">
            <div class="sconto-label">
              <span>
                <el-icon style="vertical-align: middle">
                  <edit />
                </el-icon>
                {{ $t("bill.discount") }}
              </span>
              <span v-if="conto.discount.value > 0" style="margin-left: 10px">
                {{ conto.discount.rate }}%
              </span>
            </div>
            <span class="sconto-amount">
              {{ formatAmount(conto.discount.value) }}
            </span>
          </div>

          <div class="totale-section">
            <span class="totale-label">
              {{ $t("bill.total") }}
            </span>
            <span class="totale-amount">
              {{ totale }}
            </span>
          </div>
        </div>
        <div class="flat-card">
          <div class="buttons">
            <el-button type="danger" plain style="width: 100%" @click="annullaConto">
              {{ $t("bill.clear") }}
            </el-button>
          </div>
          <div class="buttons" style="margin-top: 10px">
            <el-button type="danger" class="checkout" @click="checkout()">
              {{ $t("bill.cash") }}
            </el-button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flat-card">
          <div class="buttons">
            <el-button type="success" plain style="width: 50%" @click="inviaOrdine">
              {{ $t("bill.send") }}
            </el-button>
            <el-button type="success" plain style="width: 50%" @click="ristampaOrdine">
              {{ $t("bill.reprint") }}
            </el-button>
          </div>
          <div class="buttons" style="margin-top: 10px">
            <el-button type="primary" class="block" plain @click="parcheggiaConto">
              {{ $t("bill.save") }}
            </el-button>
          </div>
        </div>

      </div>
    </footer>

    <el-dialog
      :title="$t('bill.discount')"
      v-model="discountVisible"
      :center="false"
      width="40%"
      destroy-on-closeß>
      <discount-widget :amount="conto.totale" @applyDiscount="applyDiscount">
      </discount-widget>
    </el-dialog>

    <el-dialog
      :title="$t('bill.doPark')"
      v-model="placeSelectorVisible"
      width="70%"
      destroy-on-close>
      <place-selector @selectPlace="selectPlace"> </place-selector>
    </el-dialog>

    <el-dialog
      :title="currentItem.name"
      v-model="showModifications"
      :center="false"
      width="40%"
      destroy-on-close>
      <cart-item-details
        :data="currentItem"
        @onChange="onChange"
        @onDelete="onDelete">
      </cart-item-details>
      
    </el-dialog>
  </div>
</template>

<script>
import Firebase from "../../firebase.js";
import ShoppingCart from "../../components/ShoppingCart.vue";
import OrderCart from "../../components/OrderCart.vue";
import DiscountWidget from "../../components/DiscountWidget.vue";
import { Edit } from "@element-plus/icons";
import utils from "../../utils.js";
import Conto from "../../data/Conto.js";
import Table from "../../data/Table.js";
import printf from "../../fiscalprinter/printf.js";
import escposprinter from "../../escposprinter/escposprinter.js";
import Document from "../../documents/Document.js";
import operator from "../../store/user.js";
import Settings from "@/settings/Settings.js";
import PlaceSelector from "./PlaceSelector.vue";
import configs from '@/store/configs';
import counters from '@/store/counters';
import CartItemDetails from "@/components/CartItemDetails.vue"
import axios from 'axios'

export default {
  name: "ContoManagement",
  components: {
    ShoppingCart,
    OrderCart,
    DiscountWidget,
    Edit,
    PlaceSelector,
    CartItemDetails
  },
  props: ["currentPlace"],
  data() {
    return {
      billLoaded: false,
      discountVisible: false,
      conto: new Conto(),
      conf: new Settings(),
      placeSelectorVisible: false,
      currentView: 'bill',
      currentItem: {},
      showModifications: false,
      serverAddress: '127.0.0.1:8088',
    };
  },
  watch: {
    currentPlace: {
     // eslint-disable-next-line no-unused-vars
      handler(newPlace, oldPlace) {
        if(newPlace != null) {
          this.currentView = 'order';
        }
      }
    }
  },
  computed: {
    subtotale: function () {
      return utils.formatPrice(this.conto.getTotale());
    },
    totale: function () {
      return utils.formatPrice(this.conto.getTotaleNetto());
    },
    groupedList: function () {
      return this.conto.groupByItems();
    },
  },
  methods: {
    showItemDetails: function(item) {
      if(item.status == -100) return;
      this.currentItem = item;
      this.showModifications = true;

    },
    onDelete: function(ids) {
      this.showModifications = false;
      this.removeItems(ids);
    },
    onChange: function(item) {
      var delta = item.quantity - this.currentItem.quantity;
      this.currentItem.quantity = item.quantity;
      this.currentItem.note = item.note;
      this.currentItem.price = item.price;

      this.showModifications = false;
      this.changeCart(item, delta);
    },
    scroll: function () {
      var cart = this.$refs.cart;
      cart.scrollTop = cart.scrollHeight;
    },
    showError(text) {
        this.$message({
          type: 'error',
          message: text,
        })
    },
    stampaScontrino: function() {
      if(configs.fiscal == true) {
        this.stampaScontrinoFiscale((r) => {
          if(r.result == 'ok') {
            var data = r.data;
            var progressive = data.Service.Request[0].lastDocF[0];
            var zNum = data.Service.Request[0].lastZ[0];
            this.conto.setClosed(1, this.currentPlace, progressive, zNum);
          } else {
            this.showError(this.$t('cashier.print-error'));
          }
        });
      } else {
        this.stampaScontrinoNonFiscale((r) => {
          if(r.result == 'ok') {
            var progressive = counters.getProgressivoScontrino(true);
            var zNum = counters.getZNum();
            this.conto.setClosed(1, this.currentPlace, progressive, zNum);
          } else {
            this.showError(this.$t('cashier.print-error'));
          }
        });
      }
    },
    checkout: function () {
      if (this.conto.size() == 0) return;
        this.conto.addPayment(0, "contanti", this.conto.getTotale());
        console.log(this.conto);
        this.stampaScontrino();
/*
      var condition = this.conf.getSettingValue("allowQuickBill");
      if (condition) {
        this.conto.addPayment(0, "contanti", this.conto.getTotale());
        console.log(this.conto);
        this.stampaScontrino();
      } else {
        this.$emit("pagaConto", this.conto);
      }
      */
    },
    annullaConto: function () {
      this.conto.clear();
      this.$emit("annullaConto");
    },
    getNoteColor: function () {
      if (this.conto.note == "") return "#cccaaa";
      else return "#ff6b6b";
    },
    getAttentionColor: function () {
      return "#ff6b6b";
    },
    billStart: function () {
      if (this.billLoaded) return utils.toDateTime(this.conto.createdAt);
    },
    removeItems: function (ids) {
      for (var i = 0; i < this.conto.size(); i++) {
        if (ids.indexOf(this.conto.getInsertId(i)) != -1) {
          this.conto.removeItem(i);
        }
      }
    },
    changeCart: function (item, delta) {
      console.log("changeCart", item, delta);

      for (i = 0; i < this.conto.size(); i++) {
        if (item.insertIds.indexOf(this.conto.getInsertId(i)) != -1) {
          this.conto.setNote(i, item.note);
          this.conto.setPrice(i, item.price);
        }
      }

      if (delta < 0) {
        var count = 0;
        for (var i = 0; i < this.conto.size(); i++) {
          if (item.insertIds.indexOf(this.conto.getInsertId(i)) != -1) {
            this.conto.removeItem(i);
            count++;
            if (count == Math.abs(delta)) break;
          }
        }
      } else if (delta > 0) {
        for (i = 0; i < this.conto.size(); i++) {
          if (item.insertIds.indexOf(this.conto.getInsertId(i)) != -1) {
            this.conto.cloneItem(i, delta);
          }
        }
      }

      this.conto.saveCache();
    },
    openDiscount: function () {
      if (this.conto.size() == 0) return;
      this.discountVisible = true;
    },
    applyDiscount: function (discount) {
      this.conto.setDiscount(discount);
      this.discountVisible = false;
    },
    isPercentDiscount: function () {
      return this.conto.discount.type == this.$t("generic.percent");
    },
    formatAmount: function (amount) {
      return utils.formatPrice(amount);
    },
    getPzs: function () {
      return this.conto.getQuantity();
    },
    setNote: function () {
      this.$prompt("", this.$t("bill.note"), {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
      })
        .then(({ value }) => {
          this.conto.note = value;
          this.conto.saveCache();
        })
        .catch(() => {});
    },
    selectPlace: function (selectedPlace) {
      this.placeSelectorVisible = false;
      console.log("selectPlace", selectedPlace);
      var prevConto = new Conto();
      if(selectedPlace.conto != undefined) {
        prevConto.fillData(selectedPlace.conto);
        delete(selectedPlace.conto);
      }
      delete(selectedPlace.seats);        
      prevConto.append(this.conto, selectedPlace);

      //append
      var t = new Table();
      t.updateConto(selectedPlace, prevConto);
      this.$emit("contoParked");
    },
    parcheggiaConto: function () {
      if (this.conto == null) return;
      if (this.conto.size() == 0) return;

      if (this.currentPlace == null || this.currentPlace == undefined) {
        /*
        this.$router.push({
          name: 'floor',
          params: {
            suspendedOrder: JSON.stringify(this.conto)
          }
        })
        */
        this.placeSelectorVisible = true;
      } else {
        this.conto.update(this.currentPlace);
        var t = new Table();
        t.updateConto(this.currentPlace, this.conto);
        this.$emit("contoParked");
      }
    },
    stampaScontrinoFiscale(callback) {
      console.log("stampaScontrino");
      printf.document(
        this.groupedList,
        this.conto.payments,
        this.conto.customer,
        callback
      );
    },
    stampaScontrinoNonFiscale(callback) {
      if (this.conto.size() == 0) return;
      console.log("stampaScontrinoNonFiscale");
      const clone = Object.assign({}, this.conto);
      clone.groupedList = this.groupedList;
      clone.place = this.currentPlace;
      clone.headersString = localStorage.getItem("headers");

      axios.post('http://' + this.serverAddress + '/scontrino', JSON.stringify(clone))
        .then(function (response) {
          console.log('***', response.data);

          if (callback) callback(response.data);
        })
        .catch(function (error) {
           console.log(error);
        });
    },
    preconto() {
      if (this.conto.size() == 0) return;
      console.log("preconto");

      var doc = new Document();
      doc.preconto(this.groupedList, this.conto.getTotale(), this.place);

      escposprinter.stampa(doc);
    },
    checkPending(operator) {
      var pendingString = localStorage.getItem("cart");
      if (pendingString != null && pendingString.length > 0) {
        var ord = JSON.parse(pendingString);
        this.conto.fillData(ord);
        //this.groupedList = this.conto.groupByItems();
      } else {
        this.conto.place = this.currentPlace;
      }
      this.conto.operator = {
        id: operator.getId(),
        name: operator.getName(),
      };
    },
    reassignPark: function () {
      if (this.conto.hasUnsavedChanges()) {
        this.$confirm(
          this.$t("bill.ignore-changes"),
          this.$t("bill.reassign"),
          {
            confirmButtonText: this.$t("generic.ok"),
            cancelButtonText: this.$t("generic.cancel"),
            type: "warning",
          }
        )
          .then(() => {
            this.conto.clear();
            this.$emit("reassignedConto");
          })
          .catch(() => {});
      } else {
        this.conto.clear();
        this.$emit("reassignedConto");
      }
    },
    loadConto: function (place) {
      var docRef = Firebase.db.collection("park").doc(place.area.docId);
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (doc.data().places[place.id].conto != null) {
              if (doc.data().places[place.id].conto.orderList.length > 0) {
                this.conto.fillData(doc.data().places[place.id].conto);
                this.billLoaded = true;
              }
            }
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    readConfig() {
  
      console.log("configs", configs);
    }
  },
  mounted() {
    this.readConfig();
    counters.load();

    this.$bus.on("addItem", (e) => {
      this.conto.addItem(e);
      this.$nextTick(() => {
        this.scroll();
      });
    });
    this.$bus.on("addCustomer", (e) => {
      this.conto.addCustomer(e);
    });
    this.$bus.on("checkPending", (e) => {
      this.checkPending(e);
    });
    this.$bus.on("loadConto", (e) => {
      this.loadConto(e);
    });
    this.$bus.on("reassignPark", () => {
      this.reassignPark();
    });
    this.$bus.on("loadCart", (e) => {
      console.log("loadCart");
      this.conto = e;
    });
    this.$bus.on("setOperator", (e) => {
      this.conto.operator = {
        id: e.getId(),
        name: e.getName(),
      };
    });
    this.conto.operator = {
      id: operator.getId(),
      name: operator.getName(),
    };

    if(this.currentPlace == null || this.currentPlace == undefined) {
      this.currentView='bill';
    } else {
      this.currentView='order';
    }
  },
};
</script>

<style scoped>
.conto {
  height: 100%;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.info-conto-2 {
  color: var(--success-color);
  font-size: 0.8em;
  font-weight: bold;
  margin: 5px;
}
header {
  min-height: 80px;
}
main {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  flex: auto;
}
.subtotale-section {
  position: relative;
  color: var(--info-color);
  padding: 4px;
  margin-bottom: 20px;
  font-size: 1.2em;
}
.subtotale-label {
  text-align: left;
  display: inline-block;
  position: absolute;
  max-width: 300px;
  left: 2px;
  top: 0px;
}
.subtotale-amount {
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 0px;
  font-weight: bold;
}
.sconto-section {
  position: relative;
  color: var(--info2-color);
  padding: 4px;
  margin-bottom: 20px;
}
.sconto-label {
  text-align: left;
  display: inline-block;
  position: absolute;
  max-width: 300px;
  left: 2px;
  top: 0px;
}
.sconto-amount {
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 0px;
  font-weight: bold;
}
.totale-section {
  position: relative;
  color: var(--primary-color);
  padding: 4px;
  margin-bottom: 20px;
  font-size: 1.4em;
  font-weight: bold;
}
.totale-label {
  text-align: left;
  display: inline-block;
  position: absolute;
  max-width: 300px;
  left: 2px;
  top: 0px;
}
.totale-amount {
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 0px;
}
.bottom-header {
  display: flex;
  vertical-align: middle;
  flex-direction: row;
}
.bottom-header .note {
  margin: 5px;
}
.block {
  width: 100%;
}
.checkout {
  font-weight: bold;
  height: 70px;
  font-size: 2.0em;
  width: 100%;
  color: #B71C1C;
}
.buttons {
  display: flex;
  flex-direction: row;
}
.toggle-button {
  width: 40%;
}

</style>