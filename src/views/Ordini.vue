<template>
<div class="orders">
  <div class="title">{{$t('orders.orders')}}</div>
  <div class="title-2">{{$t('orders.pending-orders', {quantity: orders.length})}}</div>
  <div class="order-grid">
    <order-card v-for="order in orders" :key="order.id" :data="order"
      @checkOrder="checkOrder"/>
  </div>
</div>
</template>

<script>
import Firebase from "../firebase.js";
import OrderCard from "./Orders/OrderCard.vue"

export default {
  name: "Ordini",
  components: {OrderCard},
  data() {
    return {
      orders: []
    };
  },
  methods: {
    loadOrders: function() {
      Firebase.db
        .collection("ordini")
        .where("done", "==", false)
        .orderBy("timestamp")
        .onSnapshot((snapshotChange) => {
          this.orders = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.id = doc.id;
            this.orders.push(record);
          });
          console.log('loadOrders', this.orders);
        });
    },
    checkOrder: function(id) {
       var ref = Firebase.db.collection('ordini').doc(id);
       ref.set({
          done: true
       }, {merge: true})
    },
  },
  mounted() {
    this.loadOrders();
  },
};
</script>

<style scoped>
.orders {
  padding: 4px;
  overflow: scroll;
}
.order-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  grid-gap: 10px;
  padding: 10px;
}
.orders span {
   float: left;
   clear: left;
}
</style>
