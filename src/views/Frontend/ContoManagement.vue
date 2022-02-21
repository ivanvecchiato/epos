<template>
  <div class="conto">
    <header>
        <div class="info-conto-2" v-if="billLoaded == true">
          <el-icon style="vertical-align: middle;" :color="getAttentionColor()" :size="14">
            <edit />
          </el-icon>
          <span style="vertical-align: middle;">{{billStart()}}</span>
        </div>
        <div class="bottom-header">
          <div class="note">
            <el-icon :size="24" v-on:click.stop :color="getNoteColor()" @click="setNote">
              <edit />
            </el-icon>
          </div>
        </div>
    </header>

    <main ref='cart'>
          <div>
            <shopping-cart
              :orderList="groupedList"
              @changeCart="changeCart"
              @deleteItem="removeItem">
            </shopping-cart>
          </div>
    </main>

    <footer>
        <div class="flat-card">

        <div class="subtotale-section">
          <span class="subtotale-label">
            {{$t('bill.subtotal')}}
          </span>
          <span class="subtotale-amount">
            {{subtotale}}
          </span>
        </div>

        <div class="sconto-section" @click="openDiscount">
          <div class="sconto-label">
          <span>
            <el-icon style="vertical-align: middle;">
              <edit />
            </el-icon>
            {{$t('bill.discount')}}
          </span>
          <span v-if="conto.discount.value>0" style="margin-left: 10px">
            {{conto.discount.rate}}%
          </span>
          </div>
          <span class="sconto-amount">
            {{formatAmount(conto.discount.value)}}
          </span>
        </div>

        <div class="totale-section">
          <span class="totale-label">
            {{$t('bill.total')}}
          </span>
          <span class="totale-amount">
            {{totale}}
          </span>
        </div>
        </div>

        <div class="flat-card">
          <div class="buttons">
            <el-button
              type="danger"
              plain
              class="annulla"
              @click="annullaConto">
              {{ $t("bill.clear") }}
            </el-button>
            <el-button
              type="primary"
              class="block"
              plain
              @click="parcheggiaConto">
              {{ $t("bill.save") }}
            </el-button>
          </div>
          <div class="buttons" style="margin-top: 10px">
            <el-button
              type="success"
              class="block bold"
              @click="pagaConto">
              {{ $t("bill.cash") }}
            </el-button>
          </div>
        </div>
    </footer>

    <el-dialog
      :title="$t('bill.discount')"
      v-model="discountVisible"
      :center="false"
      width="40%"
      destroy-on-close>
      <discount-widget
        :amount="conto.totale"
        @applyDiscount="applyDiscount">
      </discount-widget>
    </el-dialog>
  </div>
</template>

<script>
import Firebase from "../../firebase.js";
import ShoppingCart from "../../components/ShoppingCart.vue";
import DiscountWidget from "../../components/DiscountWidget.vue";
import { Edit } from '@element-plus/icons';
import utils from "../../utils.js";
import Conto from "../../data/Conto.js";
import Table from "../../data/Table.js";
import printf from "../../fiscal/printf.js";
import operator from "../../store/user.js";
import Settings from "@/settings/Settings.js";

export default {
  name: 'ContoManagement',
  components: {
   ShoppingCart,
   DiscountWidget,
   Edit,
  },
  props: ['currentPlace'],
  data() {
     return {
       billLoaded: false,
       discountVisible: false,
       conto: new Conto,
       conf: new Settings
     }
  },
  computed: {
     subtotale: function() {
        return utils.formatPrice(this.conto.getTotale());
     },
     totale: function() {
        return utils.formatPrice(this.conto.getTotaleNetto());
     },
     groupedList: function () {
       return this.conto.groupByItems();
     },
  },
  methods: {
    scroll: function() {
      var cart = this.$refs.cart;
      cart.scrollTop = cart.scrollHeight;
    },
    pagaConto: function() {
      if(this.conto.size() == 0)
        return;

      var condition = this.conf.getSettingValue('allowQuickBill');
      if(condition) {
        this.conto.addPayment(0, "contanti", this.conto.getTotale());
        console.log(this.conto);
        this.conto.setClosed(1, this.currentPlace, this.stampaScontrino);
      } else {
        this.$emit('pagaConto', this.conto);
      }
    },
    annullaConto: function() {
      this.conto.clear();
      this.$emit('annullaConto');
    },
    getNoteColor: function() {
      if(this.conto.note == '')
        return "#cccaaa"
      else
        return "#ff6b6b"
    },
    getAttentionColor: function() {
      return "#ff6b6b";
    },
    billStart: function() {
      if(this.billLoaded)
        return utils.toDateTime(this.conto.createdAt);
    },
    removeItem: function(index) {
      this.conto.removeItem(index);
    },
    incrementItem: function(index) {
      this.conto.incrementItem(index);
    },
    decrementItem: function(index) {
      this.conto.decrementItem(index);
    },
    changeCart: function(item ,delta) {
      console.log('changeCart', item, delta);
      this.conto.saveCache();
    },
    openDiscount: function() {
      if(this.conto.size() == 0)
        return;
      this.discountVisible = true;
    },
    applyDiscount: function(discount) {
      this.conto.setDiscount(discount);
      this.discountVisible = false;
    },
    isPercentDiscount: function() {
      return (this.conto.discount.type == this.$t('generic.percent'));
    },
    formatAmount: function(amount) {
      return utils.formatPrice(amount);
    },
    getPzs: function() {
      return this.conto.getQuantity();
    },
    setNote: function() {
      this.$prompt('', this.$t('bill.note'), {
          confirmButtonText: this.$t('generic.ok'),
          cancelButtonText: this.$t('generic.cancel')
        })
        .then(({ value }) => {
          this.conto.note = value;
          this.conto.saveCache();
        })
        .catch(() => {
        })
    },
    parcheggiaConto: function() {
      this.conto.update(this.currentPlace);

      if (this.currentPlace == null || this.currentPlace == undefined)
        this.$router.push("/floor");
      else {
        var t = new Table();
        t.updateConto(this.currentPlace, this.conto);
      }
    },
    stampaScontrino() {
      console.log('stampaScontrino');
      printf.document(
        this.conto.orderList,
        this.conto.payments,
        this.conto.customer
      );
    },
    checkPending(operator) {
      var pendingString = localStorage.getItem('cart');
      if(pendingString != null && pendingString.length > 0) {
        var ord = JSON.parse(pendingString);
        this.conto.fillData(ord);
        //this.groupedList = this.conto.groupByItems();
      } else {
        this.conto.place = this.currentPlace;
      }
      this.conto.operator = {
        id: operator.getId(),
        name: operator.getName()
      }
    },
    reassignPark: function() {
      if(this.conto.hasUnsavedChanges()) {
        this.$confirm(
          this.$t('bill.ignore-changes'),
          this.$t('bill.reassign'),
          {
            confirmButtonText: this.$t("generic.ok"),
            cancelButtonText: this.$t("generic.cancel"),
            type: 'warning',
          }
        )
        .then(() => {
          this.conto.clear();
          this.$emit('reassignedConto')
        })
        .catch(() => {
        })
      } else {
        this.conto.clear();
        this.$emit('reassignedConto', )
      }
    },
    loadConto: function(place) {
      var docRef = Firebase.db
        .collection("park")
        .doc(place.area.docId);
      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("loadConto", doc.data().places[place.place].conto);
          if(doc.data().places[place.place].conto.orderList.length > 0) {
            this.conto.fillData(doc.data().places[place.place].conto);
            this.billLoaded = true;
          }
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },
  },
  mounted() {
    this.$bus.on('addItem', e => {
      this.conto.addItem(e);
      this.$nextTick(() => {
        this.scroll();
      })
    });
    this.$bus.on('addCustomer', e => {
      this.conto.addCustomer(e);
    });
    this.$bus.on('checkPending', e => {
      this.checkPending(e);
    });
    this.$bus.on('loadConto', e => {
      this.loadConto(e);
    });
    this.$bus.on('reassignPark', () => {
      this.reassignPark();
    });
    this.$bus.on('loadCart', e => {
      console.log('loadCart')
      this.conto = e;
    })
    this.$bus.on('setOperator', e => {
    this.conto.operator = {
      id: e.getId(),
      name: e.getName()
    }
    })
    this.conto.operator = {
      id: operator.getId(),
      name: operator.getName()
    }
  },
}
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
  min-height: 90px;
  border-bottom: solid 1px lightblue;
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
  color: var(--secondary-color);
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
.bold {
  font-weight: bold;
}
.buttons {
  display: flex;
  flex-direction: row;
}
.annulla {
}

</style>