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
          <el-icon :size="20" v-on:click.stop>
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
      <div class="card-body">
        <el-image v-if="item.imgUrl.length>0" :src="item.imgUrl" class="thumbnail"/>
        <p v-if="item.imgUrl.length>0" class="product-img-name">{{ item.name }}</p>
        <p v-else class="product-name">{{ item.name }}</p>
      </div>
    </div>

    <div class="card-bottom">
      <div class="icons" v-if="atLeastOneProp(item)">
        <img
          v-if="isToComplete(item.type)"
          class="indicator indicator-red"
          src="@/assets/icons/steps.png"/>
        <img
          v-if="isMeasure(item.type)"
          class="indicator indicator-gray"
          src="@/assets/icons/scale.png"/>
        <el-icon v-if="isBundle(item.type)" :size="14" color="#ffffff" class="indicator indicator-red">
          <coin />
        </el-icon>
        <el-icon v-if="isFavorite(item)" :size="14" color="#ffffff" class="indicator indicator-yellow">
          <star-filled />
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
import { StarFilled } from '@element-plus/icons'
import Firebase from '../firebase.js'
//import utils from '../utils.js'

export default {
  name: "ProductGrid",
  props: {
    data: Array,
  },
  components: { Coin, Setting, StarFilled },
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
    },
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
  background: #fff;
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
  padding: 0px;
}
.card-body {
  text-align: center;
}
.card-bottom {
  padding: 5px;
}
.color-indicator {
  width: 10px;
  height: 100%;
  background: white;
  /*
  border-bottom-right-radius: 100%;
  border-top-left-radius: 8px;
  */
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  position: absolute;
  top: 0px;
  left: 0px;
}
.icons {
  display: flex;
  position: absolute;
  bottom: 2px;
  min-width: 30px;
  left: 12px;
}
.product-name {
  font-size: 18px;
  font-weight: normal;
  margin: auto;
  line-height: 90%;
  /*color: rgb(68, 68, 68);*/
  color: var(--info2-color);
  box-sizing: border-box;
  letter-spacing: -0.05em;
}
.product-img-name {
  position: absolute;
  bottom: 25px;
  right: 10px;
  font-size: 18px;
  font-weight: normal;
  margin: auto;
  line-height: 90%;
  /*color: rgb(68, 68, 68);*/
  color: var(--info2-color);
  box-sizing: border-box;
  letter-spacing: -0.05em;
}

.product-price {
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  position: absolute;
  bottom: -8px;
  right: 8px;
  color: #fff;
  border: 0px solid var(--primary-color);
  background: var(--info2-color);
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
  width: 14px;
  height: 14px;
  margin-left: 2px;
  margin-right: 2px;
  border-radius: 4px;
  padding: 2px;
}
.indicator-red {
  background-color: var(--info2-color);
}
.indicator-yellow {
  background-color: var(--warning-color);
}
.indicator-gray {
  background-color: var(--info-color);
}
.settings {
  text-align: right;
}
.thumbnail {
  height: 70px;
  position: absolute;
  top: -10px;
  left: 20px;
}
</style>
