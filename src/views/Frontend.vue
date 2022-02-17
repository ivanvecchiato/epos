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
        <el-col :span="8" class="text-align: right">
          <div v-if="currentPlace != null" class="title-2 info-conto">
            <span>{{currentPlace.area.name}}</span>            
            -
            <span>{{$t('bill.place', {description: currentPlace.place})}}</span>
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
          @pagaConto="pagaConto">
        </conto-management>
      </div>
    </div>

    <el-dialog
      v-model="paymentDialogVisibile"
      width="80%"
      destroy-on-close>
      <payment-dialog
        :data="conto">
      </payment-dialog>
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
import PaymentDialog from "./Frontend/PaymentDialog.vue";
import printf from "../fiscal/printf.js";
import ContoManagement from './Frontend/ContoManagement.vue';

export default {
  name: "Frontend",
  components: {
    ProductGrid,
    CircleClose,
    PaymentDialog,
    ContoManagement
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
      paymentDialogVisibile: false
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
      if (p.add_note) {
        this.openNote(p);
      } else {
        this.addItem(p);
      }
    },
    addItem: function(p) {
      this.$bus.trigger('addItem', p);
      /*
      this.conto.addItem(p);
      this.$nextTick(() => {
        var cart = this.$refs.contoMgmt;
        cart.scroll();
        })
      */
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
            this.loadImage(this.products[this.products.length-1]);
          });
        });
    },
    loadImage: function(item) {
      if(item.imgUrl.length == 0) return;

      const storage = Firebase.storage.ref();
      var storageRef = storage.child(item.imgUrl);
//      var pathReference = storage.ref(this.product.imgUrl);

      storageRef.getDownloadURL()
        .then((url) => {
          //console.log("URL", url)
          item.imgUrl = url;
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
    showPaymentDialog: function() {
      this.paymentDialogVisibile = true;
    },
    pagaConto: function() {
      this.showPaymentDialog();
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
            this.loadImage(this.products[this.products.length-1]);
          });
        });
    },
    testPrintf() {
      printf.getStatus((resp) => {
        console.log('testPrintf', resp)
        if(resp.Service.ECRStatus[0].mode != 'REG') {
          printf.setKey('REG');
        }
      });
    }
  },
  beforeCreate() {
    this.$bus.reset();
  },
  mounted() {
    if (this.place != undefined && this.place.length != 0) {
      this.currentPlace = {
        area: JSON.parse(this.room),
        place: this.place
      }
//      console.log("Frontend", this.currentPlace);
      this.$bus.trigger('loadConto', this.currentPlace)
//      this.loadConto();
    } else {
      this.$bus.trigger('checkPending', operator)
    }

    this.$bus.trigger('login', operator)

    this.loadCategories();

    this.testPrintf();
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
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  background: #fff;
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
  border: 0px;
}
.button-idle {
  /*background-color: var(--lightest-main-color);*/
  background-color: #ffffff;
  color: var(--primary-color);
  font-weight: bold;
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
</style>
