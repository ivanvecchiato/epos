<template>
  <div class="product-form">
    <el-form ref="product" :model="product" label-width="150px">
      <el-tabs class="conti-tab" type="card">
        <el-tab-pane :label="$t('product.settings')">
          <el-form-item :label="$t('product.name')">
            <el-input v-model="product.name"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('product.code')">
                <el-input v-model="product.code"></el-input>
              </el-form-item>
            </el-col>
            <el-form-item :label="$t('product.category')">
              <el-col :span="11">
                <el-select
                  v-model="product.category"
                  :placeholder="$t('product.category')">
                  <el-option label="none" value="none"></el-option>
                  <el-option
                    v-for="cat in categories"
                    :key="cat.id"
                    :label="cat.name"
                    value="cat.name">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="11">
                <el-button
                  type="primary"
                  plain
                  size="small"
                  @click="newCategory"
                  >{{ $t("product.new_category") }}</el-button
                >
              </el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('product.price')">
                <el-input v-model="product.price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-form-item :label="$t('product.vat')">
              <el-col :span="8">
                <el-select
                  v-model="product.vat.vatRate"
                  :placeholder="$t('product.vat')">
                  <el-option label="none" value="none"></el-option>
                  <el-option label="10%" value="10.00"></el-option>
                  <el-option label="22%" value="22.00"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
              <el-col :span="6">
                <color-selector
                  v-if="isMounted"
                  :key="product.id"
                  :initialColor="product.color"
                  @colorPicked='colorPicked'>
                </color-selector>
              </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('product.type')">
                <el-radio-group v-model="product.type">
                  <el-radio :label="0">{{$t('product_type.normal')}}</el-radio>
                  <el-radio :label="1">{{$t('product_type.bundle')}}</el-radio>
                  <el-radio :label="2">{{$t('product_type.measure')}}</el-radio>
                  <el-radio :label="3">{{$t('product_type.compose')}}</el-radio>
                  <el-radio :label="-1">{{$t('product_type.variant')}}</el-radio>
                  <el-radio :label="-2">{{$t('product_type.ingredient')}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label="$t('product.description')">
            <el-input type="textarea" v-model="product.description"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane :label="$t('inventory.inventory')">
          <el-row>
            <el-col :span="6">
              <el-form-item>
                <el-checkbox v-model="product.inventory.enabled">{{
                  $t("inventory.enabled")
                }}</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('inventory.availability')">
                <el-input
                  v-model="product.inventory.availability"
                  :disabled="product.inventory.enabled == false">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('inventory.alarm')">
                <el-input
                  v-model="product.inventory.alarm"
                  :disabled="product.inventory.enabled == false">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane :label="$t('product.options')">
          <el-row>
            <el-form-item :label="$t('product.cost')">
              <el-col :span="11">
                <el-input v-model="product.cost"></el-input>
              </el-col>
            </el-form-item>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.available_for_takeaway')}}</div>
                <el-switch v-model="product.takeaway"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.available_for_remote_order')}}</div>
                <el-switch v-model="product.remote_order"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.add_variant')}}</div>
                <el-switch v-model="product.add_variant"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.add_note')}}</div>
                <el-switch v-model="product.add_note"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.specify_price')}}</div>
                <el-switch v-model="product.price_to_be_confirmed"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          {{$t("generic.ok")}}
        </el-button>
        <el-button @click="onCancel">
          {{ $t("generic.cancel") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Firebase from "../../firebase";
import Product from "../../data/Product.js";
import utils from "../../utils.js";
import ColorSelector from '../../components/ColorSelector.vue'

export default {
  name: "ProductForm",
  props: ["data", "documentId", "categories"],
  data() {
    return {
      product: new Product(),
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false,
      isMounted: false
    };
  },
  components: { ColorSelector},
  methods: {
    onSubmit: function() {
      console.log("onSubmit", this.product);
      console.log("onSubmit", this.documentId);
      var obj = Object.assign({}, this.product);
      if (this.documentId == "") {
        console.log("onSubmit", obj);
        Firebase.db
          .collection("products")
          .add(obj)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            this.$emit("productCreated", this.product);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else {
        Firebase.db
          .collection("products")
          .doc(this.documentId)
          .set(obj, { merge: true })
          .then(() => {
            console.log("Document successfully written!");
            this.$emit("productUpdated", this.product);
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      }
    },
    onCancel: function() {
      this.$emit("productCanceled", this.product);
    },
    newCategory: function() {
      var self = this;
      this.$prompt(this.$t("product.new_category"), this.$t("product.name"), {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
      })
        .then(({ value }) => {
          self.insertNewCategory(value);
        })
        .catch(() => {
          /*
        this.$message({
          type: "info",
          message: "Input canceled",
        });
        */
        });
    },
    colorPicked: function(color) {
      this.product.color = color;
    },
    insertNewCategory: function(value) {
      Firebase.db
        .collection("categories")
        .add({
          id: utils.uuidv4(),
          name: value,
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    },
  },
  mounted() {
    console.log("mounted", this.data);
    this.product = this.data;
    this.isMounted = true;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.product-form {
  text-align: left;
}
</style>
