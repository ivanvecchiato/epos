<template>
  <div class="ingredients">
    <div class="title-2">{{$t('pricelist.ingredients')}}</div>
    <div class="ingredients-body">
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">{{
            $t("ingredient.new")
          }}</el-button>
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
            :label="$t('ingredient.code')"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('ingredient.name')"
            width="180">
          </el-table-column>
          <el-table-column
            prop="price"
            :label="$t('ingredient.price')"
            width="250">
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
          <ingredient-form
            :data="currentingredient"
            :documentId="documentId"
            :key="randKey"
            @ingredientUpdated="ingredientUpdated"
            @ingredientCreated="ingredientCreated"
            @ingredientCanceled="ingredientCanceled"
          />
        </el-dialog>
      </div>

    </div>
  </div>
</template>

<script>
import Firebase from "../../firebase.js";
import IngredientForm from "./IngredientForm.vue";
import Ingredient from "../../data/Ingredient.js";

export default {
  name: "ingredients",
  components: { IngredientForm },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      currentingredient: new Ingredient,
      documentId: "",
      ingredients: [],
    };
  },
  methods: {
    rowClick: function() {
    },
    ingredientCreated: function (event) {
      console.log("ingredientCreated", event);
      this.resetDialog();
    },
    ingredientCanceled: function () {
      console.log("ingredientCanceled");
      this.resetDialog();
    },
    resetDialog: function () {
      this.currentingredient = new Ingredient();
      this.documentId = "";
      this.dialogVisible = false;
    },
    handleClose: function () {
      this.resetDialog();
    },
    ingredientUpdated: function (event) {
      console.log("ingredientUpdated", event);
      this.resetDialog();
    },
    handleEdit: function (index) {
      this.currentingredient = this.ingredients[index];
      this.documentId = this.ingredients[index].id;
      console.log("handleEdit", this.currentingredient);
      this.dialogVisible = true;
    },
    handleDelete: function (index) {
      this.documentId = this.ingredients[index].id;

      this.$confirm(this.$t("ingredient.ask_delete_ingredient"), "Warning", {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
        type: "warning",
      }).then(() => {
        var docRef = Firebase.db.collection("ingredienti").doc(this.documentId);
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
    loadingredients: function () {
      Firebase.db
        .collection("ingredienti")
        .where("status", "==", 1)
        //.orderBy("name")
        .onSnapshot((snapshotChange) => {
          this.ingredients = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            var v = new Ingredient;
            v.fillData(record);
            this.ingredients.push(v);
          });
          this.handleingredientTable();
        });
    },
    handleingredientTable: function () {
      this.tableData = [];
      for (var i = 0; i < this.ingredients.length; i++) {
        var values = '';
        for(var j=0; j<this.ingredients[i].values.length; j++) {
          if(j>0) values += ';';
          values += this.ingredients[i].values[j].attribute;
          if(values.length > 100) {
            values += '...';
            break;
          }
        }
        this.tableData.push({
          code: this.ingredients[i].code,
          name: this.ingredients[i].name,
          price: Number(this.ingredients[i].defaultprice).toFixed(2),
          values: values
        });
      }
    },
    randKey: function () {
      return Math.random();
    },

    loadTextFromFile(ev) {
      const file = ev.target.files[0];
//      console.log("loadTextFromFile", file);
      const reader = new FileReader();

      reader.onload = (e) => this.parseingredients(e.target.result);
      reader.readAsText(file);
    },
    parseingredients: function(json) {
      var objs = JSON.parse(json);
      console.log('parseingredients', objs.length);

      Firebase.db.collection('ingredients').get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(snapshot => {
            snapshot.ref.delete();
          })

          for(var i=0; i<objs.length; i++) {
            Firebase.db.collection('ingredients').doc(objs[i].id).set(objs[i].data);
          }
        })
    },
    getHeader: function() {
      if(this.currentingredient.name.length > 0)
        return this.currentingredient.name;
      else
        return this.$t('ingredient.ingredient');
    }
  },
  mounted() {
    this.loadingredients();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ingredients {
  text-align: left;
}
.ingredients-body {
  padding: 12px;
}

.list {
  padding: 10px;
}
</style>
