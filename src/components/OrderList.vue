<template>
  <div class="cart">
    <ul>
    <li v-for="item in order.orderList" :key="item.id" class="cart-item">
      <span class="item-quantity">{{item.quantity}}</span>
      <span class="item-name">{{item.name}}</span>
      <span class="item-price">{{formatPrice(item.price)}}</span>
    </li>
    </ul>

  </div>
</template>

<script>
import utils from '../utils.js'

export default {
  name: 'OrderList',
  components: {},
  props: ['order'],
  data() {
    return {
    }
  },
  methods: {
    formatPrice(p) {
      return utils.formatPrice(p);
    }
  },
  mounted() {
    console.log(this.order);
  },
}
</script>

<style scoped>
.cart {
  text-align: left;
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
.item-quantity {
  margin-right: 10px;
  min-width: 40px;
}
.item-price {
  float: right;
}
</style>
