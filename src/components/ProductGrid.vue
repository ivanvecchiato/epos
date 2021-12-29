<template>
  <div class="grid">
    <div
      class="card"
      v-for="item in data"
      :key="item.id"
      @click="selectProduct(item)"
    >
    <div class="card-top">
      <div class="color-indicator" :style="getBgc(item)"/>
      <div class="settings">
        <el-dropdown trigger="click">
          <el-icon :size="18" v-on:click.stop>
            <setting />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="item.favorite == false" icon="el-icon-star-off" @click="heartProduct(item)">{{$t('product.favorite')}}</el-dropdown-item>
              <el-dropdown-item v-else icon="el-icon-star-on" @click="deheartProduct(item)">{{$t('product.unfavorite')}}</el-dropdown-item>
              <el-dropdown-item icon="el-icon-edit" @click="editProduct(item)">{{$t('product.edit')}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="product-name">{{ item.name }}</div>
    </div>

    <div class="card-bottom">
      <div class="icons" v-if="atLeastOneProp(item)">
        <img
          v-if="isToComplete(item.type)"
          class="indicator"
          src="@/assets/icons/steps.png"
        />
        <img
          v-if="isMeasure(item.type)"
          class="indicator"
          src="@/assets/icons/scale.png"
        />
        <el-icon v-if="isBundle(item.type)" :size="18" color="#409EFC">
          <coin />
        </el-icon>
        <el-icon v-if="isFavorite(item)" :size="18" color="#eab676">
          <star />
        </el-icon>
      </div>
      <div class="product-price">{{ formatPrice(item.price) }}</div>
    </div>
    </div>
  </div>
</template>

<script>
import { Coin } from "@element-plus/icons";
import { Setting } from '@element-plus/icons'
import { Star } from '@element-plus/icons'
import Firebase from '../firebase.js'
//import utils from '../utils.js'

export default {
  name: "ProductGrid",
  props: {
    data: Array,
  },
  components: { Coin, Setting, Star },
  data() {
    return {
      bgc: {
        backgroundColor: '#fff'
      }
    };
  },
  methods: {
    getBgc: function(item) {
      if(item.color != '') {
        return "background: " + item.color;
//        this.bgc.backgroundColor = item.color;
      }
//      return this.bgc;
      return '';
    },
    atLeastOneProp: function(item) {
      return (this.isBundle(item.type) || this.isToComplete(item.type) || this.isMeasure(item.type) || this.isFavorite(item));
    },
    formatPrice: function(price) {
      return Number(price).toFixed(2)
    },
    selectProduct: function(prod) {
      this.$emit("productSelected", prod);
    },
    isToComplete: function(type) {
      return type == 3;
    },
    isBundle: function(type) {
      return type == 1;
    },
    isMeasure: function(type) {
      return type == 2;
    },
    isFavorite: function(item) {
      return item.favorite;
    },
    heartProduct: function(item) {
      var ref = Firebase.db.collection('products').doc(item.id);
      ref.set({
        favorite: true
      }, {merge: true})
    },
    deheartProduct: function(item) {
      var ref = Firebase.db.collection('products').doc(item.id);
      ref.set({
        favorite: false
      }, {merge: true})
    },
    editProduct: function(item) {
      console.log('editProduct', item.name);
    }
  },
  mounted() {
    //this.products = this.data;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: auto;
  grid-gap: 10px;
  padding: 10px;
}
.card {
  border: 0px solid lightgray;
  background: white;
  border-radius: 8px;
  min-height: 90px;
  position: relative;
  transition: 0.4s;
  box-shadow: 3px 8px 8px -4px rgb(151, 114, 114, 0.4);
}
.card-top {
  min-height: 50px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 5px;
}
.card-bottom {
  padding: 5px;
}
.color-indicator {
  width: 20px;
  height: 20px;
  background: white;
  border-bottom-right-radius: 100%;
  border-top-left-radius: 8px;
  position: absolute;
  top: 0px;
  left: 0px;
}
.icons {
  display: inline-block;
  position: absolute;
  bottom: 0px;
  min-width: 30px;
  left: 4px;
}
.product-name {
  font-size: 20px;
  margin: auto;
  line-height: 90%;
  letter-spacing: -0.05em;
}
.product-price {
  font-size: 14px;
  display: inline-block;
  position: absolute;
  bottom: -8px;
  right: 8px;
  color: #fff;
  border: 0px solid var(--primary-color);
  background: var(--primary-color);
  border-radius: 30px;
  padding-left: 5px;
  padding-right: 5px;
  box-shadow: 3px 8px 8px -4px rgb(151, 114, 114, 0.4);
}
.card:hover {
  box-shadow: 3px 3px 16px 0 rgba(230, 23, 23, 0.1);
  transform: scale(1.02);
}
.indicator {
  width: 18px;
  margin-left: 4px;
  margin-right: 4px;
}
.settings {
  text-align: right;
}
</style>
