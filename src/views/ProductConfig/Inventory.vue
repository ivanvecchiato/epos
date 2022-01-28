<template>
  <div class="inventory">
    <div class="title-2">{{$t('pricelist.products')}}</div>
    <div class="inventory-body">
      <el-row>
        <el-col :span="4">
          <el-button size="small" plain type="primary" @click="dialogVisible = true">
            {{$t("product.new")}}
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            type="success"
            size="small"
            plain
            @click="exportCSV">{{ $t("inventory.export") }}</el-button>
        </el-col>
        <el-col :span="6">
          <input :label="$t('inventory.import')" type="file" @change="loadTextFromFile"/>
        </el-col>
      </el-row>

      <div class="list">
        <el-table
          :data="tableData"
          height="800"
          style="width: 90%"
          @row-click="rowClick">
          <el-table-column
            prop="code"
            :label="$t('product.code')"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('product.name')"
            width="280">
          </el-table-column>
          <el-table-column
            prop="price"
            :label="$t('product.price')"
            width="180">
          </el-table-column>
          <el-table-column
            prop="inventory"
            :label="$t('inventory.availability')"
            width="180">
          </el-table-column>
          <el-table-column label="" width="100">
            <template #default="scope">
              <el-button
                type="primary"
                plain
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">
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
                @click="handleDuplicate(scope.$index, scope.row)"
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
//import Order from '../data/Order.js';
import Firebase from "../../firebase.js";
//import utils from "../utils.js";
import ProductForm from "./ProductForm.vue";
import Product from "../../data/Product.js";
//import Category from "../data/Category.js";

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
      products: [],
    };
  },
  methods: {
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
    handleEdit: function (index) {
      this.currentProduct = this.products[index];
      this.documentId = this.products[index].id;
      console.log("handleEdit", this.currentProduct);
      this.dialogVisible = true;
    },
    handleDuplicate: function (index) {
      var p = this.products[index];
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
      Firebase.db
        .collection("products")
        .where("status", "==", 1)
        .orderBy("name")
        .onSnapshot((snapshotChange) => {
          this.products = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            this.products.push(record);
          });
          this.handleProductTable();
        });
    },
    loadCategories: function () {
      Firebase.db
        .collection("categories")
        .orderBy("id")
        .onSnapshot((snapshotChange) => {
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
          code: this.products[i].code,
          name: this.products[i].name,
          price: Number(this.products[i].price).toFixed(2),
          inventory: Number(this.products[i].inventory.availability)
        });
      }
    },
    randKey: function () {
      return Math.random();
    },
    exportCSV: function () {
      var arrData = this.products;
      var CSV = '';

      //This condition will generate the Label/Header
      {
        var row = '';

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ';';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
      }

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
          row = '';

          //2nd loop will extract each column and convert it in string comma-seprated
          for (index in arrData[i]) {
              row += '"' + arrData[i][index] + '";';
          }

          row.slice(0, row.length - 1);

          //add a line break after each row
          CSV += row + '\r\n';
      }

      if (CSV === '') {
          alert('Invalid data');
          return;
      }

      var ReportTitle = "export";

      //Generate a file name
      var fileName = '';
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g, '_');

      //Initialize file format you want csv or xls
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
      // generate a temp <a /> tag
      var link = document.createElement('a');
      link.href = uri;

      //set the visibility hidden so it will not effect on your web-layout
      link.style = 'visibility:hidden';
      link.download = fileName + '.csv';

      //this part will append the anchor tag and remove it after automatic click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // console.log('finish download one file');
    },
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
//      console.log("loadTextFromFile", file);
      const reader = new FileReader();

      reader.onload = (e) => this.parseProducts(e.target.result);
      reader.readAsText(file);
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

.list {
  padding: 10px;
}
</style>
