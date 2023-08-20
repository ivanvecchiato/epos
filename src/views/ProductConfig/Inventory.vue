<template>
  <div class="inventory">
    <div class="title-2">{{$t('pricelist.products')}}</div>
    <div class="inventory-body">
      <el-row>
        <el-col :span="2">
          <el-button size="small" plain type="primary" @click="dialogVisible = true">
            {{$t("product.new")}}
          </el-button>
        </el-col>
        <el-col :span="6">
          <button
            type="success"
            size="small"
            plain
            @click="exportJSON">{{ $t("inventory.export") }}
          </button>
          <input ref="fileInput" type="file" style="display:none;" @change="readFile" />
          <button
            size="small"
            plain
            v-on:click="this.$refs.fileInput.click();">{{ $t("inventory.import") }}
          </button>
          <button
              size="small"
              plain
              @click="deleteAllProducts()">{{ $t("inventory.delete") }}
          </button>
        </el-col>
      </el-row>

      <div class="list">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 90%"
          @row-click="rowClick">
          <el-table-column
            prop="code"
            :label="$t('product.code')"
            width="100">
          </el-table-column>
          <el-table-column
            :label="$t('product.img')"
            width="100">
            <template #default="scope">
              <div class="thumbnail-bgnd">
                <img :src="scope.row.imgUrl" class="thumbnail"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            :label="$t('product.name')"
            width="280">
              <template #default="scope">
                <span class="prod-name">{{ scope.row.name }}</span>
              </template>
          </el-table-column>
          <el-table-column
            :label="$t('product.type')"
            width="60">
            <template #default="scope">
              <img
                class="indicator" :class="getTypeIndicator(scope.row.type)"
                :src="getIndicator(scope.row.type)"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="category"
            sortable
            :label="$t('product.category')"
            width="200">
          </el-table-column>
          <el-table-column
            :label="$t('product.price')"
            width="100">
            <template #default="scope">
                <span class="prod-price">{{ scope.row.price }}</span>
              </template>
          </el-table-column>
          <el-table-column
            prop="inventory"
            :label="$t('inventory.availability')"
            width="120">
          </el-table-column>
          <el-table-column label="" width="110">
            <template #default="scope">
              <el-button
                type="primary"
                plain
                size="mini"
                @click="handleEdit(scope.row)">
                {{ $t("product.edit") }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="" width="100">
            <template #default="scope">
              <el-button
                type="warning"
                plain
                size="mini"
                @click="handleDuplicate(scope.row)"
                >{{ $t("product.duplicate") }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="" width="100">
            <template #default="scope">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div>
        <el-dialog
          :title="getHeader()"
          v-model="dialogVisible"
          :before-close="handleClose"
          destroy-on-close
          width="80%">
          <product-form
            :data="currentProduct"
            :documentId="documentId"
            :categories="categories"
            :catalog="products"
            :key="randKey"
            @productUpdated="productUpdated"
            @productCreated="productCreated"
            @productCanceled="productCanceled"
          />
        </el-dialog>
      </div>

    </div>
  </div>
</template>

<script>
import Firebase from "../../firebase.js";
//import utils from "../utils.js";
import ProductForm from "./ProductForm.vue";
import Product from "../../data/Product.js";
//import Category from "../data/Category.js";
import repo from '@/db/repo.js'

export default {
  name: "Inventory",
  components: { ProductForm },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      currentProduct: new Product(),
      documentId: "",
      categories: [],
      products: []
    };
  },
  methods: {
    deleteAllProducts: function() {
      Firebase.db.collection('products').get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(snapshot => {
            snapshot.ref.delete();
          })
        })
    },
    importProducts: function(data) {
      //var categories = data.categories;
      var products = data.products;
      /*
      Firebase.db.collection('categories').get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(snapshot => {
            snapshot.ref.delete();
          })

          for(var i=0; i<categories.length; i++) {
            Firebase.db.collection('categories').doc(categories[i].id).set(categories[i]);
          }
        })
        */

      Firebase.db.collection('products').get()
        .then(querySnapshot => {
          var size = querySnapshot.size;
          if(size == 0) {
            for(var i=0; i<products.length; i++) {
              Firebase.db.collection('products').doc(products[i].id).set(products[i]);
            }            
          } else {
            var count = 0;
            querySnapshot.docs.forEach(snapshot => {
              snapshot.ref.delete();
              count++;
              if(count == size) {
                for(var i=0; i<products.length; i++) {
                  if(products[i].type == undefined || products[i].type == '') {
                    products[i].type = 0;
                  }
                  Firebase.db.collection('products').doc(products[i].id).set(products[i]);
                }
              }
            })
          }
        })
    },
    readFile: function(event) {
      var file = event.target.files[0];
      const reader = new FileReader();
      if (file.name.includes(".json")) {
        reader.onload = (res) => {
          var data = JSON.parse(res.target.result)
          this.importProducts(data);
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(file);
      }
    },
    getIndicator(type) {
      if(type == -2) {
        return require('@/assets/icons/ingredient.png');
      } else if(type == 1) {
        return require('@/assets/icons/collection.png');
      } else if(type == 3) {
        return require('@/assets/icons/steps.png');
      }
    },
    getTypeIndicator(type) {
      var style = '';
      if(type == -2) {
        //ingrediente
        style = 'indicator-orange';
      } else if(type == 1) {
        //bundle
        style = 'indicator-purple';
      } else if(type == 3) {
        //to complete
        style = 'indicator-green';
      }

      return style;
    },
    rowClick: function() {

    },
    productCreated: function (event) {
      console.log("productCreated", event);
      this.resetDialog();
    },
    productCanceled: function () {
      console.log("productCanceled", event);
      this.resetDialog();
    },
    resetDialog: function () {
      console.log("resetDialog");

      this.currentProduct = new Product();
      this.documentId = "";
      this.dialogVisible = false;
    },
    handleClose: function () {
      this.resetDialog();
    },
    productUpdated: function (event) {
      console.log("productUpdated", event);
      this.resetDialog();
    },
    handleEdit: function (row) {
      for(var i=0; i<this.products.length; i++) {
        if(this.products[i].id == row.id) {
          this.currentProduct = this.products[i];
          this.documentId = this.products[i].id;
        }
      }
      //console.log("handleEdit", row);
      this.dialogVisible = true;
    },
    handleDuplicate: function (row) {
      var p=null;
      for(var i=0; i<this.products.length; i++) {
        if(this.products[i].id == row.id) {
          p = this.products[i];
        }
      }
      var obj = Object.assign({}, p);
      obj.name = obj.name + " (copia)";
      Firebase.db
        .collection("products")
        .add(obj)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    },
    handleDelete: function (index) {
      this.documentId = this.products[index].id;

      this.$confirm(this.$t("inventory.ask_delete_product"), "Warning", {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
        type: "warning",
      }).then(() => {
        var docRef = Firebase.db.collection("products").doc(this.documentId);
        console.log(this.documentId, docRef);
        docRef
          .update({
            status: -1,
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "Delete completed",
            });
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: "Delete error: " + error,
            });
          });
      });
    },
    loadProducts: function () {
      this.products = repo.getAllProducts();
      this.handleProductTable();
      /*
      Firebase.db
        .collection("products")
        .where("status", "==", 1)
        .orderBy("name")
        .onSnapshot((snapshotChange) => {
          this.products = [];
          var size = snapshotChange.size;
          var count = 0;
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            this.products.push(record);
            count++;

            if(count == size){
              this.handleProductTable();
            }
          });
        });
        */
    },
    loadCategories: function () {
      Firebase.db
        .collection("categories")
        .orderBy("id")
        .onSnapshot((snapshotChange) => {
          this.categories = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            this.categories.push(record);
            this.loadProducts();
          });
        });
    },
    handleProductTable: function () {
      this.tableData = [];
      for (var i = 0; i < this.products.length; i++) {
        this.tableData.push({
          id: this.products[i].id,
          code: this.products[i].code,
          name: this.products[i].name,
          type: this.products[i].type,
          imgUrl: this.products[i].properties.imgUrl,
          category: this.products[i].category.name,
          price: Number(this.products[i].price).toFixed(2),
          inventory: Number(this.products[i].inventory.availability)
        });
      }
    },
    randKey: function () {
      return Math.random();
    },
    exportJSON: function() {
      var arrData = {
        categories: this.categories,
        products: this.products
      }
      var fileName = "export";
      var json = JSON.stringify(arrData);

      var uri = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);
      // generate a temp <a /> tag
      var link = document.createElement('a');
      link.href = uri;

      //set the visibility hidden so it will not effect on your web-layout
      link.style = 'visibility:hidden';
      link.download = fileName + '.json';

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    parseProducts: function(json) {
      var objs = JSON.parse(json);
      console.log('parseProducts', objs.length);

      Firebase.db.collection('products').get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(snapshot => {
            snapshot.ref.delete();
          })

          for(var i=0; i<objs.length; i++) {
            Firebase.db.collection('products').doc(objs[i].id).set(objs[i].data);
          }

        })
    },
    getHeader: function() {
      if(this.currentProduct.name.length > 0)
        return this.currentProduct.name;
      else
        return this.$t('product.product');
    }
  },
  mounted() {
    this.loadCategories();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inventory {
  text-align: left;
}
.inventory-body {
  padding: 12px;
}
.indicator {
  width: 20px;
  margin-left: 2px;
  margin-right: 2px;
  border-radius: 6px;
  padding: 3px;
}
.list {
  padding: 10px;
  height: 100vh;
}
.thumbnail-bgnd {
  background: var(--gray6-color); /* rgb(248, 239, 227);*/
  border-radius: 12px;
  width: 60px;
  height: 60px;
  text-align: center;
}
.thumbnail {
  margin-top: 5px;
  height: 50px;
}
.prod-name {
  font-weight: bold;
  color: var(--primary-color);
}
.prod-price {
  font-weight: bold;
  color: var(--danger-color);
}
</style>
