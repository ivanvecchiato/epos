<template>
  <div class="cart">
    <div v-for="item, index in orderList" :key="item.id" :class="getItemClass(item)" @click="showItemDetails(index, item)">
      <span class="item-quantity">{{item.quantity}}</span>
      <span :class="getItemNameClass(item.status)">{{item.name}}</span>
      <div class="item-details">
        <span class="item-unitary-price" v-if="item.quantity>1">
          {{item.quantity}} x {{formatPrice(item.price)}}
        </span>
        <span v-if="hasDetails(item)" class="item-specs">{{getItemDetails(item)}}</span>
        <span class="item-note">{{item.note}}</span>
      </div>
      <span class="item-price">{{formatPrice(item.quantity * item.price)}}</span>
    </div>
  </div>
</template>

<script>
//import CartItemDetails from "./CartItemDetails.vue"

export default {
  name: 'ShoppingCart',
  components: {
    //CartItemDetails
  },
  props: ['orderList'],
  data() {
    return {
      showModifications: false,
      currentItem: {},
      currentIndex: -1
    }
  },
  watch: {
    orderList: {
     // eslint-disable-next-line no-unused-vars
      handler(newList, oldList) {
        //console.log(newList, oldList)
      },
      deep: true
    }
  },
  methods: {
    getItemDetails: function(item) {
      if(item.components == undefined) return '';
      if(item.components.length == 0) return '';
      
      var details = ''
      for(var i=0; i<item.components.length; i++) {
        if(i > 0) details += '; ';
        details += item.components[i].name;
      }
      return details;
    },
    hasDetails: function(item) {
      return (item.type == 1 || item.type == 3);
    },
    getItemClass: function(item) {
      if(item.status == -100) {
        return 'cart-item';
      } else {
        if(item.insertTime == undefined) {
          return 'cart-item-new';
        } else {
          return 'cart-item';
        }
      }
    },
    getItemNameClass: function(item_status) {
      if(item_status == -100) {
        return "item-name-crossed";
      } else return "item-name";
    },
    showItemDetails: function(index, item) {
      if(item.status == -100) return;

      this.$emit('showItem', item);
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
  },
  mounted() {
  },
}
</script>

<style scoped>
.cart {
  margin-right: 15px;
}
.cart-item {
  display: flex;
  width: 100%;
  padding: 4px;
  max-height: 55px;
  min-height: 55px;
  position: relative;
  margin: 4px;
  vertical-align: middle;
  background: rgb(250, 250, 250);
  border-radius: 12px;
}
.cart-item-new {
  display: flex;
  width: 100%;
  padding: 4px;
  max-height: 55px;
  min-height: 55px;
  position: relative;
  margin: 4px;
  /*border-right: solid 5px rgba(155, 201, 155);*/
  vertical-align: middle;
  background: rgb(246, 248, 255);
  border-radius: 12px;
}

.item-quantity {
  display: inline-block;
  position: absolute;
  background: var(--secondary-light-color);
  border-radius: 6px;
  text-align: center;
  line-height: 24px;
  width: 24px;
  height: 24px;
  left: 4px;
  top: 18px;
}
.item-name {
  text-align: left;
  display: inline-block;
  position: absolute;
  max-width: 300px;
  left: 40px;
  font-weight: bold;
}
.item-name-crossed {
  text-align: left;
  display: inline-block;
  position: absolute;
  max-width: 300px;
  left: 40px;
  color: var(--danger-color);
  font-weight: normal;
  text-decoration: line-through;
}
.item-details {
  display: flex;
  position: absolute;
  left: 40px;
  top: 25px;
  flex-direction: column;
}
.item-note {
  color: var(--info-color);
  font-size: 0.9em;
}
.item-specs {
  color: var(--info2-color);
  font-size: 0.8em;
}
.item-unitary-price {
  color: var(--info-color);
  font-size: 0.9em;
  font-weight: bold;
}
.item-price {
  display: inline-block;
  position: absolute;
  right: 5px;
  font-size: 1.0em;
  color: var(--info2-color);
  font-weight: bold;
}
</style>
