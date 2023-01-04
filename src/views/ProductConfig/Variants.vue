<template>
  <div class="variants">
    <div class="title-2">{{$t('pricelist.variants')}}</div>
    <div class="variants-body">
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">{{
            $t("variant.new")
          }}</el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            type="success"
            size="small"
            plain
            @click="exportJson">{{ $t("variant.export") }}</el-button>
        </el-col>
        <el-col :span="6">
          <input :label="$t('variant.import')" type="file" @change="loadTextFromFile"/>
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
            :label="$t('variant.code')"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('variant.name')"
            width="180">
          </el-table-column>
          <el-table-column
            prop="values"
            :label="$t('variant.attributes')"
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
          <variant-form
            :data="currentVariant"
            :documentId="documentId"
            :key="randKey"
            @variantUpdated="variantUpdated"
            @variantCreated="variantCreated"
            @variantCanceled="variantCanceled"
          />
        </el-dialog>
      </div>

    </div>
  </div>
</template>

<script>
import Firebase from "../../firebase.js";
import VariantForm from "./VariantForm.vue";
import Variant from "../../data/Variant.js";

export default {
  name: "variants",
  components: { VariantForm },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      currentVariant: new Variant,
      documentId: "",
      variants: [],
    };
  },
  methods: {
    rowClick: function() {
    },
    variantCreated: function (event) {
      console.log("variantCreated", event);
      this.resetDialog();
    },
    variantCanceled: function () {
      console.log("variantCanceled");
      this.resetDialog();
    },
    resetDialog: function () {
      this.currentVariant = new Variant();
      this.documentId = "";
      this.dialogVisible = false;
    },
    handleClose: function () {
      this.resetDialog();
    },
    variantUpdated: function (event) {
      console.log("variantUpdated", event);
      this.resetDialog();
    },
    handleEdit: function (index) {
      this.currentVariant = this.variants[index];
      this.documentId = this.variants[index].id;
      console.log("handleEdit", this.currentVariant);
      this.dialogVisible = true;
    },
    handleDelete: function (index) {
      this.documentId = this.variants[index].id;

      this.$confirm(this.$t("variant.ask_delete_variant"), "Warning", {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
        type: "warning",
      }).then(() => {
        var docRef = Firebase.db.collection("varianti").doc(this.documentId);
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
    loadVariants: function () {
      Firebase.db
        .collection("varianti")
        .where("status", "==", 1)
        //.orderBy("name")
        .onSnapshot((snapshotChange) => {
          this.variants = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            var v = new Variant;
            v.fillData(record);
            this.variants.push(v);
          });
          this.handleVariantTable();
        });
    },
    handleVariantTable: function () {
      this.tableData = [];
      for (var i = 0; i < this.variants.length; i++) {
        var values = '';
        for(var j=0; j<this.variants[i].values.length; j++) {
          if(j>0) values += ';';
          values += this.variants[i].values[j].attribute;
          if(values.length > 100) {
            values += '...';
            break;
          }
        }
        this.tableData.push({
          code: this.variants[i].code,
          name: this.variants[i].name,
          price: Number(this.variants[i].defaultprice).toFixed(2),
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

      reader.onload = (e) => this.parseVariants(e.target.result);
      reader.readAsText(file);
    },
    parseVariants: function(json) {
      var objs = JSON.parse(json);
      console.log('parseVariants', objs.length);

      Firebase.db.collection('variants').get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(snapshot => {
            snapshot.ref.delete();
          })

          for(var i=0; i<objs.length; i++) {
            Firebase.db.collection('variants').doc(objs[i].id).set(objs[i].data);
          }
        })
    },
    getHeader: function() {
      if(this.currentVariant.name.length > 0)
        return this.currentVariant.name;
      else
        return this.$t('variant.variant');
    }
  },
  mounted() {
    this.loadVariants();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.variants {
  text-align: left;
}
.variants-body {
  padding: 12px;
}

.list {
  padding: 10px;
}
</style>
