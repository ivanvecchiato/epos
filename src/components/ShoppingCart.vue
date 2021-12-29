<template>
  <div class="cart">
    <div v-for="item, index in orderList" :key="item.id" class="cart-item" @click="showItemDetails(index, item)">
      <span class="item-quantity">{{item.quantity}}</span>
      <span class="item-name">{{item.name}}</span>
      <span class="item-note">{{item.note}}</span>
      <span class="item-price">{{formatPrice(item.price)}}</span>
      <!--
      <div class="quantity">
        <span class="quantity-btn" @click="incrementItem(index)">+</span>
        <span class="quantity-value">{{item.quantity}}</span>
        <span class="quantity-btn" @click="decrementItem(item, index)">-</span>
      </div>
      -->
    </div>

    <el-dialog
      :title="currentItem.name"
      v-model="showModifications"
      :center="false"
      width="40%"
      destroy-on-close>
      <cart-item-details
        :data="currentItem"
        @onChange="onChange"
        @onDelete="onDelete">
      </cart-item-details>
      
    </el-dialog>
  </div>
</template>

<script>
import CartItemDetails from "./CartItemDetails.vue"

export default {
  name: 'ShoppingCart',
  components: {
    CartItemDetails
  },
  props: ['orderList'],
  data() {
    return {
      showModifications: false,
      currentItem: {},
      currentIndex: -1
    }
  },
  methods: {
    onDelete: function() {
      this.$emit('deleteItem', this.currentIndex);
      this.showModifications = false;
    },
    onChange: function(item) {
      this.currentItem.quantity = item.quantity;
      this.currentItem.note = item.note;
      this.currentItem.price = item.price;

      this.$emit('changeCart');
      this.showModifications = false;
    },
    showItemDetails: function(index, item) {
      this.currentItem = item;
      this.currentIndex = index;
      this.showModifications = true;
    },
    formatPrice: function(price) {
      return Number(price).toFixed(2)
    },
    incrementItem: function(index) {
      this.$emit('incrementItem', index);
    },
    decrementItem: function(index) {
        this.$emit('decrementItem', index);
    },
    removeItem: function(index) {
      this.$emit('removeItem', index);
    }
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  width: 100%;
  padding: 5px;
  max-height: 60px;
  min-height: 60px;
  position: relative;
  vertical-align: middle;
}
.quantity {
  display: inline-block;
  position: absolute;
  right: 10px;
  font-weight: bold;
}
.quantity-value {
  display: inline-block;
  min-width: 16px;
  margin-left: 8px;
  margin-right: 8px;
}
.quantity-btn {
  border: solid 2px var(--danger-color);
  color: var(--danger-color);
  border-radius: 8px;
  display: inline-block;
  width: 25px;
  height: 25px;
  margin: auto;
}
.item-quantity {
  display: inline-block;
  position: absolute;
  background: var(--light-secondary-color);
  border-radius: 6px;
  text-align: center;
  width: 24px;
  height: 24px;
  left: 2px;
}
.item-name {
  text-align: left;
  display: inline-block;
  position: absolute;
  max-width: 300px;
  left: 40px;
  font-weight: bold;
}
.item-note {
  display: inline-block;
  position: absolute;
  left: 40px;
  top: 25px;
  font-size: 0.9em;
}
.item-price {
  display: inline-block;
  position: absolute;
  right: 15px;
  font-size: 1.0em;
  color: var(--info2-color);
  font-weight: bold;
}
</style>
