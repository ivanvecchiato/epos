<template>
  <div class="variant-form">
    <el-form ref="variant" :model="variant" label-width="150px">
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('variant.code')">
            <el-input v-model="variant.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item :label="$t('variant.name')">
            <el-input v-model="variant.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('variant.price')">
            <el-input v-model="variant.defaultprice"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
          <el-col :span="6">
            <color-selector @colorPicked='colorPicked'></color-selector>
          </el-col>
      </el-row>

      <el-row v-for="item, index in variant.values" :key="index" align="middle" :gutter="20">
        <span class="row-index">{{index+1}}</span>
        <el-col :span="6">
          <el-input v-model="item.attribute" placeholder="attributo"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="item.price" placeholder=""></el-input>
        </el-col>
        <el-col :span="2">
          <el-icon color="#F44336" size="24" @click="deleteVariant(index)"><CircleClose/></el-icon>
        </el-col>
      </el-row>

      <div class="add-row">
        <el-button @click="addVariant()">+ {{$t('variant.new')}}</el-button>
      </div>

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
import Product from "../../data/Product.js";
import utils from "../../utils.js"
import ColorSelector from '../../components/ColorSelector.vue'
import {CircleClose} from '@element-plus/icons'

export default {
  name: "ProductForm",
  props: ["data", "documentId"],
  data() {
    return {
      variant: new Product(),
      color: "",
      inputVisible: false,
      inputValue: '',
    };
  },
  components: { ColorSelector, CircleClose},
  methods: {
    addVariant: function() {
      this.variant.values.push({'attribute': '', price: 0.0})
    },
    deleteVariant: function(index) {
      this.variant.values.splice(index, 1);
    },
    getPrice: function(p) {
      return utils.formatPrice(p)
    },
    handleRemove: function(tag) {
      console.log('handleRemove', tag)
      this.variant.values.splice(this.variant.values.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.variant.values.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    onSubmit: function() {
      console.log("onSubmit", this.variant);
      console.log("onSubmit", this.documentId);
      this.variant.setData();
      var ret = this.variant.writeDoc();
      if(ret == 0) this.$emit("variantCreated", this.variant);
      else this.$emit("variantUpdated", this.variant);
    },
    onCancel: function() {
      this.$emit("variantCanceled", this.variant);
    },
    colorPicked: function(color) {
      this.variant.color = color;
    },
    randKey: function () {
      return Math.random();
    }
  },
  mounted() {
    console.log("mounted", this.data);
    this.variant = this.data;
    this.color = this.variant.color;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.variant-form {
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
