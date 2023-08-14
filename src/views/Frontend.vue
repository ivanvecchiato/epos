<template>
  <div class="">
    <div class="categories">
      <el-button
        type="warning"
        circle
        plain
        size="medium"
        icon="el-icon-star-on"
        @click="selectFavorites()"
      >
      </el-button>

      <el-button
        type="info"
        round
        v-for="cat in categories"
        :key="cat.id"
        :class="getButtonClass(cat.id)"
        @click="selectCategory(cat)"
      >
        {{ cat.name }}
      </el-button>
      <div class="search">
          <input
            class="search-input"
            :placeholder="$t('generic.search')"
            v-model="searchInput"
            :oninput="inputChange()"/>
        </div>

    </div>
    <div class="center">
      <span v-if="products.length == 0" class="none-found">{{
        $t("product.no_product_found")
      }}</span>
      <product-grid :data="products" @productSelected="productSelected"> </product-grid>
    </div>

    <el-dialog v-model="checkoutDialogVisibile" width="80%" destroy-on-close>
      <checkout-dialog> </checkout-dialog>
    </el-dialog>

    <el-dialog
      :title="$t('product.specify_price')"
      v-model="priceDialogVisibile"
      :show-close="false"
      destroy-on-close
    >
      <ECRKeypad :extended="true" @cancel="cancelSelection" @selectPrice="selectPrice">
      </ECRKeypad>
    </el-dialog>

    <el-dialog v-model="wizardActivated" :show-close="false" destroy-on-close>
      <ProductWizard
        :prod="currentHandledProduct"
        @undoWizard="undoWizard"
        @finalizeWizard="finalizeWizard"
      >
      </ProductWizard>
    </el-dialog>
  </div>
</template>

<script>
import ProductGrid from "../components/ProductGrid.vue";
import CheckoutDialog from "./Frontend/CheckoutDialog.vue";
import printf from "../fiscalprinter/printf.js";
import ECRKeypad from "@/components/ECRKeypad.vue";
import ProductWizard from "./Frontend/ProductWizard.vue";
import repo from '@/db/repo.js'

export default {
  name: "Frontend",
  components: {
    ProductGrid,
    CheckoutDialog,
    ECRKeypad,
    ProductWizard,
  },
  props: ["place", "room"],
  data() {
    return {
      categories: [],
      products: [],
      currentCategory: null,
      priceDialogVisibile: false,
      currentHandledProduct: null,
      searchInput: "",
      wizardActivated: false,
      contoId: "",
    };
  },
  computed: {
    userIconUrl: function () {
      return require("@/assets/user.png");
    },
  },
  methods: {
    undoWizard: function () {
      this.wizardActivated = false;
    },
    finalizeWizard: function (items, note) {
      this.wizardActivated = false;
      console.log(items);
      var p = JSON.parse(JSON.stringify(this.currentHandledProduct));
      for (var i = 0; i < items.length; i++) {
        p.price += Number(items[i].delta_price);
        p.components.push(items[i]);
      }
      if (note != undefined && note.length > 0) {
        p.note = note;
      }
      this.addItem(p);
    },
    inputChange: function () {
      var input = this.searchInput;
      if (input.length < 2) return;

      this.products = [];
      this.resultCount = 0;
      for (var p in repo.catalog) {
        var name = repo.catalog[p].name;
        if (name.toLowerCase().startsWith(input.toLowerCase())) {
          this.products.push(repo.catalog[p]);
        }
      }
    },
    reassignPark: function () {
      this.$bus.trigger("reassignPark");
    },
    searchItem: function () {},
    getButtonClass: function (catId) {
      if (this.currentCategory == null || catId != this.currentCategory.id) {
        return "button-idle";
      } else {
        return "button-active";
      }
    },
    selectFavorites: function () {
      this.loadPreferiti();
    },
    selectCategory: function (c) {
      this.currentCategory = c;
      this.products = this.getProducts(c);
    },
    productSelected: function (p) {
      if (p.properties.variable_price) {
        this.openPriceinput(p);
      } else if (p.type == 3) {
        //product to be completed
        this.currentHandledProduct = p;
        this.wizardActivated = true;
      } else {
        if (p.properties.add_note) {
          this.openNote(p);
        } else {
          this.addItem(p);
        }
      }
    },
    openPriceinput: function (p) {
      this.priceDialogVisibile = true;
      this.currentHandledProduct = p;
    },
    cancelSelection: function () {
      this.priceDialogVisibile = false;
      this.currentHandledProduct = null;
    },
    selectPrice: function (price, note) {
      this.priceDialogVisibile = false;
      this.currentHandledProduct.price = price;
      this.currentHandledProduct.note = note;
      console.log("selectPrice", price);
      this.addItem(this.currentHandledProduct);
    },
    subset(prod) {
      let tmp = JSON.stringify(prod, prod.replacer);
      return JSON.parse(tmp);
    },
    addItem: function (p) {
      this.$bus.trigger("addItem", this.subset(p));
    },
    openNote: function (p) {
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
    getProducts: function (cat) {
      var self = this;
      repo.getProducts(
        cat.id,
        function(data) {
          self.products = data;
          for(var i=0; i<self.products.length; i++) {
            repo.loadImageUrl(
              i,
              self.products[i].properties.imgUrl,
              function(url, index) {
                self.products[index].properties.imgUrl = url;                
              }
            )
          }
        });
    },
    showCheckoutDialog: function (conto) {
      this.checkoutDialogVisibile = true;
      this.$nextTick(() => {
        this.$bus.trigger("setConto", conto);
      });
    },
    loadCategories: function () {
      var self = this;
      repo.getCategories(
        function(data) {
          self.categories = data;
        }
      )
    },
    loadPreferiti: function () {
      var self = this;
      this.products = [];
      repo.getProducts(
        'favorites',
        function(data) {
          self.products = data;
          for(var i=0; i<self.products.length; i++) {
            //self.loadImage(self.products[i]);
            repo.loadImageUrl(
              i,
              self.products[i].properties.imgUrl,
              function(url, index) {
                self.products[index].properties.imgUrl = url;                
              }
            )
          }
        });
    },
    testPrintf() {
      printf.init();
      printf.getStatus((resp) => {
        console.log("testPrintf", resp);
        if (resp.result == "ok") {
          var data = resp.data;
          if (data.Service.ECRStatus[0].mode != "REG") {
            printf.setKey("REG");
          } else {
            printf.clear();
          }
        } else {
          alert("errore printf");
        }
      });
    },
  },
  mounted() {
    this.loadCategories();
    this.loadPreferiti();
  },
};
</script>

<style scoped>
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
  font-size: 1.1em;
  border: 0px;
}
.button-idle {
  /*background-color: var(--lightest-main-color);*/
  background-color: var(--primary-light-color);
  color: var(--primary-color);
  font-weight: bold;
  font-size: 1.1em;
  border: 0px solid var(--primary-color);
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
