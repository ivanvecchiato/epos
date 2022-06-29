<template>
  <div class="cart">
      <span class="summary">{{getNumRows}}&nbsp;{{$t('orders.items')}}</span>
    <div v-for="phase, index in phasesList" :key="index" class="phase-section">
      <span class="phase-datetime">{{formatDatetime(phase.timestamp)}}</span>
    <div v-for="item in phase.sublist" :key="item.id" class="cart-item">
      <span class="item-quantity">{{item.quantity}}</span>
      <span :class="getItemNameClass(item.status)">{{item.name}}</span>
      <div class="item-details">
        <span v-if="hasDetails(item)" class="item-specs">{{getItemDetails(item)}}</span>
        <span class="item-note">{{item.note}}</span>
      </div>
      <span class="item-price">{{formatPrice(item.quantity * item.price)}}</span>
    </div>
    </div>

  </div>
</template>

<script>
import utils from '../utils';
import Conto from '@/data/Conto.js';

export default {
  name: 'OrderCart',
  components: {
  },
  props: ['orderList'],
  data() {
    return {
      currentItem: {},
      currentIndex: -1,
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
  computed: {
    getNumRows: function() {
      var q = 0;
      for (var i = 0; i < this.orderList.length; i++) {
        if (this.orderList[i].status != -100) q++;
    }
    return q;

    },
    phasesList: function() {
      var list = this.separateByTimestamp(this.orderList);
      console.log('***', list);
      return list;
    }
  },
  methods: {
    formatDatetime: function(dt) {
      if(dt == undefined) return '. . .';
      return utils.toLocaleDateTimeString(dt);
    },
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
    getItemNameClass: function(item_status) {
      if(item_status == -100) {
        return "item-name-crossed";
      } else return "item-name";
    },
    onDelete: function(ids) {
      this.$emit('deleteItem', ids);
      this.showModifications = false;
    },
    onChange: function(item) {
      var delta = item.quantity - this.currentItem.quantity;
      this.currentItem.quantity = item.quantity;
      this.currentItem.note = item.note;
      this.currentItem.price = item.price;

      this.$emit('changeCart', item, delta);
      this.showModifications = false;
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
    },
    separateByTimestamp: function(list) {
      var pList = [];
      var prevT = 0;
      for(var i=0; i<list.length; i++) {
        if(list[i].insertTime != prevT) {
          prevT = list[i].insertTime;
          var phase = {
            timestamp: prevT,
            sublist: []
          }
          pList.push(phase);
        }
        pList[pList.length-1].sublist.push(list[i]);
      }

      // adjust/group
      for(var j=0; j<pList.length; j++) {
        var tmpBill = new Conto;
        tmpBill.orderList = pList[j].sublist;
        pList[j].sublist = tmpBill.groupByItems();
      }

      return pList;
    }
  },
  mounted() {
    console.log('---', this.orderList);
  },
}
</script>

<style scoped>
.cart {
  text-align: center;
}
.summary {
  font-weight: bold;
  color: var(--info-color);
}
.phase-section {
  border-radius: 12px;
  border: solid 1px rgb(225, 232, 235);
  /*background: rgb(232, 245, 249);*/
  padding: 4px;
  margin: 4px;
  text-align: center;
}
.phase-datetime {
  font-size: 0.8em;
  color: var(--info-color);
  border-radius: 4px;
  border: solid 1px var(--info-color);
  padding: 1px 4px 1px 4px;
}
.cart-item {
  display: flex;
  width: 100%;
  padding: 2px;
  max-height: 45px;
  min-height: 40px;
  position: relative;
  margin: 2px;
  vertical-align: middle;
  border-radius: 12px;
}

.item-quantity {
  display: inline-block;
  position: absolute;
  background: var(--light-secondary-color);
  border-radius: 6px;
  text-align: center;
  line-height: 24px;
  width: 24px;
  height: 24px;
  left: 4px;
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
  color: var(--info-color);
  font-size: 0.8em;
}
.item-unitary-price {
  color: var(--info-color);
  font-size: 0.9em;
  font-weight: bold;
}
.item-price {
  /*display: inline-block;*/
  display: none;
  position: absolute;
  right: 5px;
  font-size: 1.0em;
  color: var(--info-color);
  font-weight: bold;
}
</style>
