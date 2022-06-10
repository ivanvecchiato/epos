<template>
  <div class="categories">
    <div class="title-2">{{$t('pricelist.categories')}}</div>
    <div class="categories-body">
      <el-row>
        <el-col :span="4">
          <el-button type="primary" plain @click="newCategory">
            {{$t("category.new")}}
          </el-button>
        </el-col>
      </el-row>

      <div class="list">
        <el-table
          :data="tableData"
          height="800"
          style="width: 80%"
          @row-click="rowClick">
          <el-table-column
            prop="code"
            :label="$t('category.code')"
            width="100">
            <template #default="scope">
              <input class="form-input" size=4 v-model="scope.row.code">
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('category.name')"
            width="180">
            <template #default="scope">
              <input class="form-input" size=16 v-model="scope.row.name">
            </template>
          </el-table-column>
          <el-table-column
            prop="rate"
            :label="$t('category.rate')"
            width="100">
            <template #default="scope">
              <input class="form-input" size=4 v-model="scope.row.rate">
            </template>

          </el-table-column>
          <el-table-column label="" width="100">
            <template #default="scope">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete(scope.row.docId)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="" plain @click="annulla">
          {{$t("generic.cancel")}}
        </el-button>
        <el-button type="success" plain @click="saveCategories">
          {{$t("generic.save")}}
        </el-button>

      </div>
    </div>
  </div>
</template>

<script>
import Firebase from "../../firebase.js";
import Category from "../../data/Category.js";
import vats from "../../data/Vats";

export default {
  name: "Categories",
  components: {  },
  data() {
    return {
      tableData: [],
      currentVariant: new Category,
      documentId: "",
      categories: [],
    };
  },
  methods: {
    rowClick: function() {
    },
    newCategory() {
      this.categories.push(new Category);
      this.handleCategoryTable();
    },
    handleDelete: function (docId) {
      var self = this;
      Firebase.db.collection('categories')
        .doc(docId)
        .delete()
        .then(()=>{
          this.$message({
            message: self.$t('config.delete_ok'),
            type: 'warning'
           });
        })
        .catch();
      //this.categories.splice(index, 1);
      //this.handleCategoryTable();
    },
    loadCategories: function () {
      Firebase.db
        .collection("categories")
        .orderBy("code")
        .onSnapshot((snapshotChange) => {
          this.categories = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            if(record.vat == undefined) {
              record.vat = {
                id: 1,
                rate: 10
              }
            }
            this.categories.push(record);
          });
          this.handleCategoryTable();
        });
    },
    handleCategoryTable: function () {
      this.tableData = [];
      for (var i = 0; i < this.categories.length; i++) {
        this.tableData.push({
          docId: this.categories[i].id,
          code: this.categories[i].code,
          name: this.categories[i].name,
          rate: this.categories[i].vat.rate
        });
      }
    },
    getVatFromRate(rate) {
      console.log('getVatFromRate', vats.vats);
      for(var i=0; i<vats.vats.length; i++) {
        if(Number(rate) == Number(vats.vats[i].rate)) {
          return vats.vats[i];
        }
      }
      return vats.vats[0];
    },
    getRecord(data) {
      for(var i=0; i<this.categories.length; i++) {
        if(data.docId == this.categories[i].id) {
          return {
            id: data.docId,
            code: data.code,
            name: data.name,
            vat: this.getVatFromRate(data.rate)
          }
        }
      }
      return {}
    },
    saveCategories() {
      for(var t=0; t<this.tableData.length; t++) {
        var data = this.tableData[t];
        var record = this.getRecord(data);

        if(record.id == 0) {
          this.insertCategory(record)
        } else {
          this.updateCategory(record)
        }
      }
    },
    updateCategory(item) {
      console.log('updateCategory', item);
      var ref = Firebase.db.collection("categories").doc(item.id);
      ref.update(Object.assign({}, item))
        .then(() => {
          //this.handleCategoryTable();
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
      },
    insertCategory(item) {
      console.log('insertCategory', item);
      Firebase.db.collection('categories').add(Object.assign({}, item))
      .then(() => {
        //this.handleCategoryTable();
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
    },
    annulla() {
      this.loadCategories();
    }
  },
  mounted() {
    this.loadCategories();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.categories {
  text-align: left;
}
.categories-body {
  padding: 12px;
}

.list {
  padding: 10px;
}
</style>
