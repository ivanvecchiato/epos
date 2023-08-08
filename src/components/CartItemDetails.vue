<template>
  <div class="details">
    <p class="title-2">{{ data.name }}</p>

    <el-tabs class="conti-tab">
      <el-tab-pane :label="$t('product.product')">
        <el-row :gutter="20" align="middle">
          <el-col :span="4">
            {{ $t("bill.quantity") }}
          </el-col>
          <el-col :span="8">
            <el-input-number v-model="item.quantity" size="small" :min="1" :max="99">
            </el-input-number>
          </el-col>
          <el-col :span="2">
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="deleteItem"
            ></el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" align="middle">
          <el-col :span="4">
            {{ $t("product.price") }}
          </el-col>
          <el-col :span="4">
            <input class="form-input" size="5" v-model="item.price" />
          </el-col>
          <el-col :span="4" v-if="hasVariants(item)">
            {{ $t("product.variants") }}
          </el-col>
          <el-col :span="4" v-if="hasVariants(item)">
            <span> {{ itemVariantsAmount(item) }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" align="middle">
          <el-col :span="4">
            {{ $t("product.note") }}
          </el-col>
          <el-col :span="12">
            <textarea class="text-area" cols="40" rows="5" v-model="item.note" />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="$t('product.variants')">
        <div class="container">
          <div v-if="variants.length > 0" class="fixed">
            <div v-for="variant in variants" :key="variant.id">
              <span class="variant-name">{{ variant.name }}</span>
              <ul class="flat-card">
                <li
                  v-for="value in variant.values"
                  :key="value.attribute"
                  @click="handleVariant(value)"
                >
                  <span class="item-name">{{ value.attribute }}</span>
                  <span class="item-price">{{ value.price }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="flex-item" v-if="item.variantsApplied != undefined">
            <ul class="simple-list">
              <li v-for="(vars, index) in item.variantsApplied" :key="vars.attribute">
                <el-row>
                  <el-col :span="12">
                    <span class="item-name">{{ vars.attribute }}</span>
                  </el-col>
                  <el-col :span="4">
                    <span class="item-price"
                      ><input class="form-input" size="5" v-model="item.price"
                    /></span>
                  </el-col>
                  <el-col :span="4">
                    <el-icon color="#F44336" :size="24" @click="deleteVariant(index)"
                      ><CircleClose
                    /></el-icon>
                  </el-col>
                </el-row>
              </li>
            </ul>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-button type="primary" plain round class="block" @click="saveModifications">{{
      $t("generic.save")
    }}</el-button>
  </div>
</template>

<script>
import repo from "@/db/repo.js";
import { CircleClose } from "@element-plus/icons";

export default {
  name: "CartItemDetail",
  props: ["data"],
  data() {
    return {
      item: {},
      variants: [],
    };
  },
  components: { CircleClose },
  computed: {},
  methods: {
    getVarPrice: function (variant) {
      return Number(variant.price).toFixed(2);
    },
    hasVariants: function (item) {
      return item.variantsApplied != undefined && item.variantsApplied.length > 0;
    },
    itemVariantsAmount: function (item) {
      var price = 0;
      for (var i = 0; i < item.variantsApplied.length; i++) {
        price += Number(item.variantsApplied[i].price);
      }
      return price.toFixed(2);
    },
    deleteVariant: function (index) {
      this.item.variantsApplied.splice(index, 1);
    },
    handleVariant: function (variant) {
      console.log(variant);
      if (this.item.variantsApplied == undefined) {
        this.item.variantsApplied = [];
      }
      var applied = Object.assign({}, variant);
      this.item.variantsApplied.push(applied);
      console.log(this.item.variantsApplied);
    },
    deleteItem: function () {
      this.$emit("onDelete", this.item.insertIds);
    },
    saveModifications: function () {
      this.$emit("onChange", this.item);
    },
    loadVariants: function () {
      if (this.item.variants == undefined) return;

      for (var j = 0; j < this.item.variants.length; j++) {
        for (var i = 0; i < repo.variants.length; i++) {
          if (repo.variants[i].code == this.item.variants[j]) {
            this.variants.push(repo.variants[i]);
          }
        }
      }
    },
  },
  mounted() {
    this.item = Object.assign({}, this.data);
    this.loadVariants();
  },
};
</script>

<style scoped>
.details {
  text-align: left;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.block {
  width: 100%;
  font-weight: bold;
}
.container {
  display: flex;
}
.fixed {
  width: 350px;
}
.flex-item {
  flex-grow: 1;
}
ul {
  padding: 0px;
}

li {
  padding: 12px 12px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(225, 242, 252);
}
li:last-child {
  border-bottom: 0;
}
.item-name {
  font-weight: 500;
  color: var(--info-color);
}
.item-quantity {
  font-weight: 500;
  color: var(--info-color);
  margin-right: 10px;
}

.item-price {
  font-size: 0.8em;
  float: right;
  font-weight: 500;
  color: var(--secondary-color);
}
.item-remove {
  float: right;
}
.variant-name {
  font-size: 1.2em;
  font-weight: bold;
  color: var(--primary-color);
}
</style>
