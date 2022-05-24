<template>
  <div class="frontend">
    <div class="flex-item">
      <div class="toolbar">
      <el-row align="middle" :gutter="20">
        <el-col :span="3">
          <img style="height: 60px;" src="@/assets/logo.png"/>
        </el-col>
        <el-col :span="6">
          <div class="search">
            <input class="search-input" :placeholder="$t('generic.search')"
              v-model="searchInput" :oninput="inputChange()"/>
            <i class="el-input__icon el-icon-search" @click="searchItem"></i>
          </div>
        </el-col>
        <el-col :span="8" class="text-align: right">
          <div v-if="currentPlace != null" class="title-2 info-conto">
            <span>{{currentPlace.area.name}}</span>            
            -
            <span>{{$t('bill.place', {description: currentPlace.name})}}</span>
            &nbsp;
            <el-icon :size="24" color="#000" @click="reassignPark">
              <circle-close />
            </el-icon>
      
          </div>
        </el-col>
        <el-col :span="6" class="text-align: right">
          <div class="customer" @click="selectCustomer">
            <el-avatar class="avatar" size="small" :src="userIconUrl"></el-avatar>
            <span class="customer-name" @click="addCustomer">{{customerName}}</span>
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
        <span v-if="products.length==0" class="none-found">{{$t('product.no_product_found')}}</span>
        <product-grid
          :data="products"
          @productSelected="productSelected">
        </product-grid>
      </div>
    </div>
    <div class="fixed">
      <div class="side">
        <conto-management
          ref="contoMgmt"
          :currentPlace="currentPlace"
          @annullaConto="annullaConto"
          @reassignedConto="reassignedConto"
          @contoParked="contoParked"
          @pagaConto="pagaConto">
        </conto-management>
      </div>
    </div>

    <el-dialog
      v-model="checkoutDialogVisibile"
      width="80%"
      destroy-on-close>
      <checkout-dialog>
      </checkout-dialog>
    </el-dialog>

    <el-dialog :title="$t('product.specify_price')"
      v-model="priceDialogVisibile"
      show-close="false"
      destroy-on-close>
      <ECRKeypad
        :extended="true"
        @cancel="cancelSelection"
        @selectPrice="selectPrice">
      </ECRKeypad>
    </el-dialog>

  </div>
</template>

<script>
import ProductGrid from "../components/ProductGrid.vue";
import Customer from "../data/Customer.js";
//import Product from "../data/Product.js";
import Firebase from "../firebase.js";
import operator from "../store/user.js";
import { CircleClose } from '@element-plus/icons';
import CheckoutDialog from "./Frontend/CheckoutDialog.vue";
import printf from "../fiscalprinter/printf.js";
import ContoManagement from './Frontend/ContoManagement.vue';
import ECRKeypad from '@/components/ECRKeypad.vue'


export default {
  name: "Frontend",
  components: {
    ProductGrid,
    CircleClose,
    CheckoutDialog,
    ContoManagement,
    ECRKeypad
  },
  props: ["place", "room"],
  data() {
    return {
      categories: [],
      products: [],
      currentCategory: null,
      //conto: new Conto,
      customer: null,
      currentPlace: null,
      search_pattern: '',
      checkoutDialogVisibile: false,
      priceDialogVisibile: false,
      currentHandledProduct: null,
      catalog: [],
      searchInput: ''
    };
  },
  computed: {
    customerName: function() {
      if(this.customer != null) {
        return this.customer.firstName + " " + this.customer.lastName;
      } else {
        return this.$t('customer.add_new');
      }
    },
    userIconUrl: function() {
      return require('@/assets/user.png');
    },
  },
  methods: {
    inputChange: function() {
       var input = this.searchInput;
       if(input.length<2) return;

      this.products = [];
      this.resultCount = 0;
      for(var p in this.catalog) {
        var name = this.catalog[p].name;
        if((name.toLowerCase()).startsWith(input.toLowerCase())) {
          this.products.push(this.catalog[p]);
          this.loadImage(this.products[this.products.length-1]);
        }
      }
    },
    contoParked: function() {
      this.currentPlace = null;
      var msg = "Conto parcheggiato";//this.$t('bill.parked');
      this.$message({
        type: 'success',
        message: msg,
      })
    },
    reassignedConto: function() {
      this.currentPlace = null;
      var msg = "Conto riassegnato";//this.$t('bill.reassigned');
      this.$message({
        type: 'success',
        message: msg,
      })
    },
    reassignPark: function() {
      this.$bus.trigger('reassignPark');
    },
    searchItem: function() {

    },
    selectCustomer: function() {

    },
    getButtonClass: function(catId) {
      if(this.currentCategory == null || catId != this.currentCategory.id) {
        return 'button-idle';
      } else {
        return 'button-active'
      }
    },
    selectFavorites: function() {
      this.loadPreferiti();
    },
    selectCategory: function(c) {
      this.currentCategory = c;
      this.products = this.getProducts(c);
    },
    productSelected: function(p) {
      if(p.properties.variable_price) {
        this.openPriceinput(p);
      } else {
        if (p.properties.add_note) {
          this.openNote(p);
        } else {
          this.addItem(p);
        }
      }
    },
    openPriceinput: function(p) {
      this.priceDialogVisibile = true;
      this.currentHandledProduct = p;
    },
    cancelSelection: function() {
      this.priceDialogVisibile = false;
      this.currentHandledProduct = null;
    },
    selectPrice: function(price, note) {
      this.priceDialogVisibile = false;
      this.currentHandledProduct.price = price;
      this.currentHandledProduct.note = note;
      console.log('selectPrice', price)
      this.addItem(this.currentHandledProduct);
    },
    subset(prod) {
      let tmp = JSON.stringify(prod, prod.replacer);
      return JSON.parse(tmp);
    },
    addItem: function(p) {
      this.$bus.trigger('addItem', this.subset(p));
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
    getAllProducts() {
      Firebase.db
        .collection("products")
        .where("status", "==", 1)
        .onSnapshot((snapshotChange) => {
          this.catalog = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            this.catalog.push(record);
          });
        });
    },
    getProducts: function(cat) {
      Firebase.db
        .collection("products")
        .where("category.id", "==", cat.id)
        .where("status", "==", 1)
        .where("type", "in", [0, 1, 2, 3])
        .onSnapshot((snapshotChange) => {
          this.products = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            this.products.push(record);
            this.loadImage(this.products[this.products.length-1]);
          });
        });
    },
    loadImage: function(item) {
      if(item.properties.imgUrl.length == 0) return;

      const storage = Firebase.storage.ref();
      var storageRef = storage.child(item.properties.imgUrl);
//      var pathReference = storage.ref(this.product.properties.imgUrl);

      storageRef.getDownloadURL()
        .then((url) => {
          //console.log("URL", url)
          item.properties.imgUrl = url;
        })
        .catch(() => {
          //console.log(error)
        });
    },
    annullaConto: function() {
      //this.conto.clear();
    },
    addCustomer() {
        this.customer = new Customer();
        this.customer.randomize();
        this.$bus.trigger('addCustomer', this.customer);
        //this.conto.addCustomer(c);
        //console.log('addCustomer', c);
    },
    showCheckoutDialog: function(conto) {
      this.checkoutDialogVisibile = true;
      this.$nextTick(() => {
        this.$bus.trigger('setConto', conto);
      })
    },
    pagaConto: function(conto) {
      this.showCheckoutDialog(conto);
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
        .where("properties.favorite", "==", true)
        .where("status", "==", 1)
        .onSnapshot((snapshotChange) => {
          this.products = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            this.products.push(record);
            this.loadImage(this.products[this.products.length-1]);
          });
        });
    },
    testPrintf() {
      printf.init();
      printf.getStatus((resp) => {
        console.log('testPrintf', resp)
        if(resp.result == 'ok') {
          var data = resp.data;
          if(data.Service.ECRStatus[0].mode != 'REG') {
            printf.setKey('REG');
          } else {
            printf.clear();
          }
        } else {
          alert('errore printf')
        }
      });
    }
  },
  beforeCreate() {
    this.$bus.reset();
  },
  mounted() {
    if (this.place != undefined) {
      this.currentPlace = JSON.parse(this.place);
      console.log("Frontend", this.currentPlace);
      this.$bus.trigger('loadConto', this.currentPlace)
    } else {
      this.$bus.trigger('checkPending', operator)
    }
    this.loadCategories();
    this.getAllProducts();
    //this.testPrintf();
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
  width: 400px;
}
.flex-item{
  flex-grow: 1;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  /*background: #81655427;*/
  border-radius: 16px;
}
.side {
  height: 100%;
  margin: 10px 10px 30px 10px;
  border: solid 0px rgb(134, 131, 131);
  border-radius: 12px;
  display: flex;
  padding: 5px;
  flex-direction: column;
  background: #FFF;
}
.categories {
  display: flex;
  flex: 1;
  overflow-x: auto;
  margin: 0px;
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
.info-conto {
  color: var(--success-color);
  margin: 5px;
}
.button-active {
  background-color: var(--secondary-color);
  font-weight: bold;
  font-family: 'Montserrat';
  font-size: 1.1em;
  border: 0px;
}
.button-idle {
  /*background-color: var(--lightest-main-color);*/
  background-color: #ffffff;
  color: var(--primary-color);
  font-weight: bold;
  font-family: 'Montserrat';
  font-size: 1.1em;
  border: 0px solid var(--primary-color);
}
.customer {
  text-align: right;
  color: var(--success-color);
}
.customer-name {
  margin: auto;
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
.none-found {
  font-size: 1.5em;
  margin: 40px;
}
</style>
