<template>
  <div class="cart">
    <div class="place">
      {{order.place}}
    </div>
    <div class="totale">
      <span class="totale-label">{{$t('bill.total')}}</span>
      &nbsp;
      <span class="totale-amount">{{getTotale()}}</span>
    </div>

    <el-tabs class="conti-tab" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="$t('bill.detailed')">
        <ul>
          <li v-for="group in detailedList" :key="group.timestamp" class="list-item">
            <span class="item-time">{{getDateTime(group.timestamp)}}</span>
            <ul>
              <li v-for="item in group.list" :key="item.id">
                <span class="item-quantity">{{item.quantity}}</span>
                <span :class="getItemNameClass(item.status)">{{item.name}}</span>
                <span class="item-price">{{formatPrice(item)}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane :label="$t('bill.grouped')">
        <div class="order-time">{{$t('bill.started')}} {{getDateTimeFromFirebase(order.createdAt)}}</div>
        <ul class="list">
          <li v-for="item in groupedList" :key="item.id" class="list-item">
            <span class="item-quantity">{{item.quantity}}</span>
            <span :class="getItemNameClass(item.status)">{{item.name}}</span>
            <span class="item-price">{{formatPrice(item)}}</span>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>

    <el-button type="primary" plain round icon="el-icon-upload">{{$t('generic.send-to-cloud')}}</el-button>
    <el-button type="success" plain round icon="el-icon-bank-card">{{$t('generic.cash-out')}}</el-button>
    <el-button type="" plain round icon="el-icon-printer">{{$t('generic.print')}}</el-button>
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
      detailedList: [],
      groupedList: []
    }
  },
  methods: {
    getItemNameClass: function(item_status) {
      if(item_status == -100) {
        return "item-name-crossed";
      } else return "item-name";
    },
    getTotale: function() {
      return utils.formatPrice(this.order.getTotale());
    },
    getDateTime: function(t) {
      return utils.toLocaleDateTimeString(t);
    },
    getDateTimeFromFirebase: function(t) {
      return utils.toDateTime(t);
    },
    formatPrice(p) {
      return utils.formatPrice(p.quantity * p.price);
    }
  },
  mounted() {
    console.log('OrderList', this.order);
    this.detailedList = this.order.groupByTimestamp({groupNote: false});
    console.log('OrderList', this.detailedList);
    this.groupedList = this.order.groupByItems({groupNote: false});
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
.list-item {
  margin: 15px;
	padding: .5em 0;
	border-bottom: 1px solid #CCC;
  text-align: left;
}
.list-item li:last-child {
	border-bottom: 0;
}
.item-quantity {
  margin-right: 10px;
  min-width: 40px;
}
.item-price {
  float: right;
}
.totale {
  padding: 10px;
  font-size: 1.2em;
  color: var(--primary-color);
}
.totale-label {
  font-weight: bold;  
  text-transform: capitalize;
}
.totale-amount {
  font-weight: bold;  
}
</style>
