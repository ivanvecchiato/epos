<template>
<div class="orders">
  <div class="title">{{$t('orders.orders')}}</div>
  <div class="title-2">{{$t('orders.pending-orders', {quantity: orders.length})}}</div>
  <div class="order-grid">
    <order-card v-for="order in orders"
      :key="order.id"
      :data="order"
      :printable="productionArea"
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
      orders: [],
      productionArea: ''
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
            if(this.somethingToBePrinted(record.comanda)) {
              this.orders.push(record);
            }
          });
          console.log('loadOrders', this.orders);
        });
    },
    somethingToBePrinted(comanda) {
      var ret = false;
      for(var i=0; i<comanda.length; i++) {
        var areas = comanda[i].productionAreas;
        if(areas == undefined) continue;
        for(var j=0; j<comanda[i].productionAreas.length; j++) {
          if(comanda[i].productionAreas[j].id == this.productionArea) {
            return true;
          }
        }
      }
      return ret;
    },
    checkOrder: function(id) {
       var ref = Firebase.db.collection('ordini').doc(id);
       ref.set({
          done: true
       }, {merge: true})
    },
  },
  mounted() {
    var param = JSON.parse(localStorage.getItem('local_area'));
    if(param != null) {
      this.productionArea = param.id;
    }
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
