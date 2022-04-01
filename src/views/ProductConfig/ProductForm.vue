<template>
  <div class="product-form">
    <el-form ref="product" :model="product" label-width="150px">
      <el-tabs class="conti-tab" type="card">
        <el-tab-pane :label="$t('product.settings')">
          <el-form-item :label="$t('product.name')">
            <input class="form-input" v-model="product.name"/>
          </el-form-item>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('product.code')">
                <input class="form-input" v-model="product.code"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('product.category') + ':'">
                <div class="form-input">
                <el-dropdown trigger="click" @command="handleCategorySelection">
                  <span class="el-dropdown-link">
                    {{product.category.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="cat in categories"
                        :key="cat.id"
                        :command="cat">
                          <span class="dropdown-category">{{cat.name}}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('product.price')">
                <input class="form-input" v-model="product.price"/>
              </el-form-item>
            </el-col>
            <el-form-item :label="$t('product.vat')">
              <el-col :span="10">
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
                  :initialColor="product.properties.color"
                  @colorPicked='colorPicked'>
                </color-selector>
              </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('product.type')">
                <el-radio-group v-model="product.properties.type">
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

          <el-row v-if="product.properties.type == 1">
            <el-col :span="24">
              <el-form-item :label="$t('product.composition')">
                <div v-if="product.components == undefined || product.components.length==0">
                  {{$t('product.no_components')}}
                </div>
                <ul>
                  <li class="component-list" v-for="c in product.components" :key="c.id">
                    <el-tag>{{c.name}}</el-tag>
                  </li>
                </ul>
                <el-icon :size='24' @click="editComposition()"><edit /></el-icon>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label="$t('product.short-description')">
            <textarea class="text-area" rows="3" cols="60" v-model="product.properties.short_description"/>
          </el-form-item>

          <el-form-item :label="$t('product.long-description')">
            <textarea class="text-area" rows="6"  cols="60" v-model="product.properties.long_description"/>
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
                <input class="form-input"
                  size="10"
                  v-model="product.inventory.availability"
                  :disabled="product.inventory.enabled == false"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('inventory.alarm')">
                <input class="form-input"
                  size="10"
                  v-model="product.inventory.alarm"
                  :disabled="product.inventory.enabled == false"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane :label="$t('product.options')">
          <el-row>
            <el-form-item :label="$t('product.cost')">
              <el-col :span="11">
                <input class="form-input" v-model="product.cost"/>
              </el-col>
            </el-form-item>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.available_for_takeaway')}}</div>
                <el-switch v-model="product.properties.takeaway"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.available_for_remote_order')}}</div>
                <el-switch v-model="product.properties.remote_order"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.add_variant')}}</div>
                <el-switch v-model="product.properties.add_variant"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.add_note')}}</div>
                <el-switch v-model="product.properties.add_note"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.specify_price_at_insert')}}</div>
                <el-switch v-model="product.properties.variable_price"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div>{{$t('product.specify_price_before_closing')}}</div>
                <el-switch v-model="product.properties.price_to_be_confirmed"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

        </el-tab-pane>

        <el-tab-pane :label="$t('product.production')">
          <el-row>
            <el-col :span="6">
              <el-form-item>
                <el-checkbox-group v-model="checkedProductions">
                  <el-checkbox v-for="dest in productions" :label="dest.id"
                    :key="dest.id"
                    @change="setDestinations">
                    {{dest.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane :label="$t('product.images')">
          <el-row>
            <el-col :span="6">
              <el-form-item>
                <div v-if="imgUrl.length == 0">
                  <p>{{$t('generic.select_image')}}</p>
                  <input type="file" @change="onFileChange">
                </div>
                <div v-else>
                  <el-image :src="imgUrl" class="thumbnail"/>
                  <el-button @click="removeImage">{{$t('generic.delete_image')}}</el-button>
                </div>
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

    <el-dialog v-model="editBundle">
      <product-composition
        v-if="isMounted"
        :product="product"
        :catalog="catalog"
        @componentsUpdate="componentsUpdate">
      </product-composition>
    </el-dialog>
  </div>
</template>

<script>
import Firebase from "../../firebase";
import Product from "../../data/Product.js";
import utils from "../../utils.js";
import ColorSelector from '../../components/ColorSelector.vue'
import ProductComposition from './ProductComposition.vue'
import { Edit }from '@element-plus/icons-vue'

export default {
  name: "ProductForm",
  props: ["data", "documentId", "categories", "catalog"],
  data() {
    return {
      product: new Product(),
      suckerCanvas: null,
      suckerArea: [],
      isSucking: false,
      isMounted: false,
      productions: [],
      checkedProductions: [],
      imgUrl: '',
      currentCategory: {},
      editBundle: false
    };
  },
  components: { ColorSelector, ProductComposition, Edit},
  methods: {
    editComposition: function() {
      this.editBundle = true
    },
    componentsUpdate: function(components) {
      this.product.components = components;
    },
    handleCategorySelection(selected) {
      console.log(selected)
      this.product.category = selected;
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;

      const storage = Firebase.storage.ref();
      var storageRef = storage.child('images/' + files[0].name);

      storageRef.put(files[0]).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
        this.product.properties.imgUrl = 'images/' + files[0].name;
      });
      this.createImage(files[0]);
    },
    createImage(file) {
      //var image = new Image();
      var reader = new FileReader();

      reader.onload = (e) => {
        this.imgUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
      console.log(e);
      this.imgUrl = '';
      this.product.properties.imgUrl = ''
    },
    setDestinations() {
      this.product.productionAreas = [];
      for(var i=0; i<this.productions.length; i++) {
        if(this.checkedProductions.indexOf(this.productions[i].id) != -1) {
          this.product.productionAreas.push(this.productions[i]);
        }
      }
    },
    onSubmit: function() {
      console.log("onSubmit", this.product);
      this.product.price = this.product.price.replace(',', '.');
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
    loadProductionAreas() {
      Firebase.db
        .collection("aree")
        .orderBy("id")
        .onSnapshot((snapshotChange) => {
          this.productions = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            this.productions.push(record);
          });

          if(this.product.productionAreas != undefined) {
            for(var i=0; i<this.product.productionAreas.length; i++) {
              this.checkedProductions.push(this.product.productionAreas[i].id);
            }
          }
        });
    },
    loadImage: function() {
      if(this.product.properties.imgUrl.length == 0) return;

      const storage = Firebase.storage.ref();
      var storageRef = storage.child(this.product.properties.imgUrl);
//      var pathReference = storage.ref(this.product.properties.imgUrl);

      storageRef.getDownloadURL()
        .then((url) => {
              console.log("URL", url)
              this.imgUrl = url;
        })
        .catch((error) => {
              console.log(error)
        });
    }
  },
  mounted() {
    console.log("mounted", this.data);
    this.product = new Product;
    this.product.fillData(this.data);
    this.isMounted = true;
    this.loadProductionAreas();
    this.loadImage();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.product-form {
  text-align: left;
}
.thumbnail {
  width: 60px;
}
.dropdown-category {
  font-size: 1.2em;
  font-family: "Montserrat", sans-serif;
  color: var(--primary-color);
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.component-list {
  float: left;
  margin: 5px;
}
</style>
