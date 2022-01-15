<template>
  <div class="frontend">
    <div class="flex-item">
      <div class="toolbar">
      <el-row align="middle" :gutter="20">
        <el-col :span="3">
          <img style="height: 40px;" src="@/assets/logo.png"/>
        </el-col>
        <el-col :span="6">
          <div class="search">
            <input class="search-input" :placeholder="$t('generic.search')"
              v-model="search_pattern"/>
            <i class="el-input__icon el-icon-search" @click="searchItem"></i>
          </div>
        </el-col>
        <el-col :span="6" class="text-align: right">
          <div v-if="place != undefined" class="title-2 info-conto">
            <span>{{currentPlace.area.name}}</span>            
            -
            <span>{{$t('bill.place', {description: currentPlace.place})}}</span>
          </div>
        </el-col>
        <el-col :span="6" class="text-align: right">
          <div class="customer" @click="selectCustomer">
            <el-avatar class="avatar" size="small" :src="userIconUrl"></el-avatar>
            <span class="customer-name">{{customerName}}</span>
          </div>
        </el-col>
      </el-row>
      </div>

      <div class="categories">
        <el-button
          type="warning"
          circle
          plain
          size="medium"
          icon="el-icon-star-on"
          @click="selectFavorites()">
        </el-button>

        <el-button
          type="info"
          round
          v-for="cat in categories"
          :key="cat.id"
          :class="getButtonClass(cat.id)"
          @click="selectCategory(cat)">
          {{ cat.name }}
        </el-button>
      </div>
      <div class="center">
        <product-grid
          :data="products"
          @productSelected="productSelected">
        </product-grid>
      </div>
    </div>
    <div class="fixed">
      <div class="side">
        <header>
          <div class="info-conto-2" v-if="billLoaded == true">
            <el-icon style="vertical-align: middle;" :color="getAttentionColor" size="14">
              <edit />
            </el-icon>
            <span style="vertical-align: middle;">{{billStart()}}</span>
          </div>
          <div class="bottom-header">
            <div class="note">
              <el-icon :size="24" v-on:click.stop :color="getNoteColor" @click="setNote">
                <edit />
              </el-icon>
            </div>
          </div>
        </header>

        <main ref='cart'>
            <div>
              <shopping-cart
                :orderList="order.orderList"
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
            <span v-if="order.discount.value>0" style="margin-left: 10px">
              {{order.discount.rate}}%
            </span>
            </div>
            <span class="sconto-amount">
              {{formatAmount(order.discount.value)}}
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
      </div>
    </div>

    <el-dialog
      :title="$t('bill.discount')"
      v-model="discountVisible"
      :center="false"
      width="40%"
      destroy-on-close>
      <discount-widget
        :amount="order.totale"
        @applyDiscount="applyDiscount">
      </discount-widget>
    </el-dialog>

  </div>
</template>

<script>
import ProductGrid from "../components/ProductGrid.vue";
import ShoppingCart from "../components/ShoppingCart.vue";
import DiscountWidget from "../components/DiscountWidget.vue";
import Table from "../data/Table.js";
import Customer from "../data/Customer.js";
import Product from "../data/Product.js";
import Order from "../data/Order.js";
import Firebase from "../firebase.js";
import operator from "../store/user.js";
import utils from "../utils.js";
import { Edit } from '@element-plus/icons'

export default {
  name: "Frontend",
  components: {
    ProductGrid,
    ShoppingCart,
    DiscountWidget,
    Edit
  },
  props: ["place", "room"],
  data() {
    return {
      categories: [],
      products: [],
      currentCategory: null,
      order: new Order(),
      currentPlace: {
        area: {},
        place: ''
      },
      discountVisible: false,
      billLoaded: false,
      search_pattern: ''
    };
  },
  computed: {
    customerName: function() {
      if(this.order.customer != null) {
        return this.order.customer.name;
      } else {
        return this.$t('customer.add_new');
      }
    },
    getNoteColor: function() {
      if(this.order.note == '')
        return "#cccaaa"
      else
        return "#ff6b6b"
    },
    getAttentionColor: function() {
      return "#ff6b6b";
    },
    userIconUrl: function() {
      return require('@/assets/user.png');
    },
    subtotale: function() {
      return utils.formatPrice(this.order.getTotale());
    },
    totale: function() {
      return utils.formatPrice(this.order.getTotaleNetto());
    },
  },
  methods: {
    searchItem: function() {

    },
    selectCustomer: function() {

    },
    billStart: function() {
      if(this.billLoaded)
        return utils.toDateTime(this.order.createdAt);
    },
    setNote: function() {
      this.$prompt('', this.$t('bill.note'), {
          confirmButtonText: this.$t('generic.ok'),
          cancelButtonText: this.$t('generic.cancel')
        })
          .then(({ value }) => {
            this.order.note = value;
            this.order.saveCache();
          })
          .catch(() => {
          })
    },
    openDiscount: function() {
      if(this.order.size() == 0)
        return;
      this.discountVisible = true;
    },
    getButtonClass: function(catId) {
      if(this.currentCategory == null || catId != this.currentCategory.id) {
        return 'button-idle';
      } else {
        return 'button-active'
      }
    },
    formatAmount: function(amount) {
      return utils.formatPrice(amount);
    },
    getPzs: function() {
      return this.order.getQuantity();
    },
    selectCategory: function(c) {
      this.currentCategory = c;
      this.products = this.getProducts(c);
    },
    productSelected: function(p) {
      if (p.add_note) {
        this.openNote(p);
      } else {
        this.addItem(p);
      }
    },
    addItem: function(p) {
      var n = this.order.addItem(p);
      console.log("productSelected", n);
      this.$nextTick(() => {
        var cart = this.$refs.cart;
        cart.scrollTop = cart.scrollHeight;
        })
    },
    openNote: function(p) {
      this.$prompt(this.$t("product.note"), p.name, {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
      })
        .then(({ value }) => {
          p.note = value;
          this.addItem(p);
        })
        .catch(() => {
          this.addItem(p);
        });
    },
    removeItem: function(index) {
      this.order.removeItem(index);
    },
    incrementItem: function(index) {
      this.order.incrementItem(index);
    },
    decrementItem: function(index) {
      this.order.decrementItem(index);
    },
    changeCart: function() {
      this.order.saveCache();
    },
    getProducts: function(cat) {
      Firebase.db
        .collection("products")
        .where("category.id", "==", cat.id)
        .where("status", "==", 1)
        .onSnapshot((snapshotChange) => {
          this.products = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            this.products.push(record);
          });
        });
    },
    getFakeProducts: function() {
      var n = 20;
      var list = [];
      for (var i = 0; i < n; i++) {
        var p = new Product();
        p.randomize();
        //console.log(p);
        list.push(p);
      }
      return list;
    },
    annullaConto: function() {
      this.order.clear();
    },
    pagaConto: function() {
      this.order.addPayment(0, "contanti", this.order.getTotale());
      var c = new Customer();
      c.randomize();
      this.order.addCustomer(c);
      console.log(this.order);
      this.order.setClosed(1);
    },
    loadCategories: function() {
      Firebase.db
        .collection("categories")
        .orderBy("id")
        .onSnapshot((snapshotChange) => {
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            this.categories.push(record);
            //this.selectCategory(this.categories[0]);
            this.loadPreferiti();
          });
        });
    },
    loadPreferiti: function() {
      Firebase.db
        .collection("products")
        .where("favorite", "==", true)
        .where("status", "==", 1)
        .onSnapshot((snapshotChange) => {
          this.products = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            this.products.push(record);
          });
        });
    },
    parcheggiaConto: function() {
      this.order.update();

      if (this.place == undefined || this.place.length == 0)
        this.$router.push("/floor");
      else {
        var t = new Table();
        t.updateConto(this.currentPlace, this.order);
      }
    },
    loadConto: function() {
      var docRef = Firebase.db
        .collection("park").doc(this.currentPlace.area.docId);
      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("loadConto", doc.data().places[this.currentPlace.place].order);
          if(doc.data().places[this.currentPlace.place].order.orderList.length > 0) {
            this.order.fillData(doc.data().places[this.currentPlace.place].order);
            this.billLoaded = true;
          }
        } else {
          console.log("No such document!");
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },
    applyDiscount: function(discount) {
      this.order.setDiscount(discount);
      this.discountVisible = false;
    },
    isPercentDiscount: function() {
      return (this.order.discount.type == this.$t('generic.percent'));
    }
  },
  mounted() {
    if (this.place != undefined && this.place.length != 0) {
      this.currentPlace = {
        area: JSON.parse(this.room),
        place: this.place
      }
      console.log("Frontend", this.currentPlace);
      this.loadConto();
    } else {
      var pendingString = localStorage.getItem('cart');
      if(pendingString != null && pendingString.length > 0) {
        var ord = JSON.parse(pendingString);
        this.order.fillData(ord);
      } else {
        this.order.place = this.currentPlace;
        this.order.operator = {
          id: operator.id,
          name: operator.name
        }
      }
    }

    console.log("Frontend", "emitting event");
    this.$bus.trigger('login', operator)

    this.loadCategories();
  },
};
</script>

<style scoped>
.frontend {
  text-align: left;
  display: flex;
  min-height: 100vh;
  max-height: 100vh;
}
.fixed{
  width: 500px;
}
.flex-item{
  flex-grow: 1;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  background: #81585427;
  border-radius: 16px;
}
.side {
  height: 100%;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.categories {
  display: flex;
  flex: 1;
  overflow-x: auto;
  margin: 4px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
  flex-flow: row nowrap;
  align-items: center;
  background: transparent;
  border-radius: 12px;
  vertical-align: middle;
}
.categories::-webkit-scrollbar {
  display: none;
}
.center {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  flex: auto;
}
.buttons {
  display: flex;
  flex-direction: row;
}
.annulla {
}
.block {
  width: 100%;
}
.bold {
  font-weight: bold;
}
.info-conto {
  color: var(--success-color);
  margin: 5px;
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
.button-active {
  background-color: var(--secondary-color);
  border: 0px;
}
.button-idle {
  background-color: var(--lightest-main-color);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}
.customer {
  text-align: right;
  color: var(--danger-color);
}
.customer-name {
  margin: auto;
}

.bottom-header {
  display: flex;
  vertical-align: middle;
  flex-direction: row;
}
.bottom-header .note {
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
  border: solid 0px var(--primary-color);
  padding-left: 10px;
  padding-right: 10px;
}
.toolbar {
  padding: 10px;
}
</style>
