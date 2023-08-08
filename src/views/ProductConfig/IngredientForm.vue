<template>
  <div class="ingredient-form">
    <el-form ref="ingredient" :model="ingredient" label-width="150px">
      <el-row>
        <el-form-item :label="$t('ingredient.name')">
          <input class="form-input" v-model="ingredient.name">
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('ingredient.price')">
            <input class="form-input" v-model="ingredient.defaultprice">
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
          <el-col :span="6">
            <color-selector
              :initialColor="color"
              @colorPicked='colorPicked' v-if="isMounted"></color-selector>
          </el-col>
      </el-row>

      <div>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">
            {{$t("generic.ok")}}
          </el-button>
          <el-button @click="onCancel">
            {{ $t("generic.cancel") }}
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
//import Firebase from "../../firebase";
import Ingredient from "../../data/Ingredient.js";
import utils from "../../utils.js"
import ColorSelector from '../../components/ColorSelector.vue'

export default {
  name: "ProductForm",
  props: ["data", "documentId"],
  data() {
    return {
      isMounted: false,
      ingredient: new Ingredient(),
      color: "",
      inputVisible: false,
      inputValue: '',
    };
  },
  components: { ColorSelector},
  methods: {
    getPrice: function(p) {
      return utils.formatPrice(p)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    onSubmit: function() {
      console.log("onSubmit", this.ingredient);
      console.log("onSubmit", this.documentId);
      this.ingredient.setData();
      var ret = this.ingredient.writeDoc();
      if(ret == 0) this.$emit("ingredientCreated", this.ingredient);
      else this.$emit("ingredientUpdated", this.ingredient);
    },
    onCancel: function() {
      this.$emit("ingredientCanceled", this.ingredient);
    },
    colorPicked: function(color) {
      this.ingredient.color = color;
    },
    randKey: function () {
      return Math.random();
    }
  },
  mounted() {
    console.log("mounted", this.data);
    this.ingredient = this.data;
    this.color = this.ingredient.color;
    this.isMounted = true;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ingredient-form {
  text-align: left;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.attributes {
  overflow: scroll;
}
ul {
  list-style-type: none;
	list-style: none;
	padding: 0;
	width: 100%;
}
ul li {
   margin: 15px;
	padding: .5em 0;
	border-bottom: 1px solid #CCC;
   text-align: left;
}
ul li:last-child {
	border-bottom: 0;
}
.row-index {
  width: 50px;
}
.add-row {
  margin:20px;
}
</style>
