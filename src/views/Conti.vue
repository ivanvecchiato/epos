<template>
  <div>
    <div class="title">{{$t('bill.docs_bills')}}</div>
    <el-tabs class="conti-tab" @tab-click="handleTabClick" v-model="page">
      <el-tab-pane :label="$t('bill.parked')">
        <conti-parcheggiati></conti-parcheggiati>
      </el-tab-pane>
      <el-tab-pane :label="$t('bill.closed')">
        <conti-chiusi></conti-chiusi>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
//import Conto from '../data/Order.js';
//import Firebase from "../firebase.js";
//import utils from "../utils.js";
import ContiChiusi from "./ContiChiusi.vue";
import ContiParcheggiati from "./ContiParcheggiati.vue";

export default {
  name: "Conti",
  components: { ContiChiusi, ContiParcheggiati },
  data() {
    return {
      page: ''
    };
  },
  methods: {
    handleTabClick: function() {

    },
    goBack: function() {
      this.$router.push("/");
    },
    randKey: function() {
      return Math.random();
    },
  },
  mounted() {
  },
};
</script>

<style>
.conti-tab {
  margin: 10px;
  background: transparent;
}
.stat-card-title {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 1.2em;
  margin-bottom: 20px;
}
.stats-totale {
  font-weight: normal;
  font-size: 1.5em;
}
.stats-amount {
  color: var(--secondary-color);
  font-size: 1.5em;
  font-weight: bold;
  margin: 10px;
}
.stat-card {
  border: 0px solid rgb(223, 223, 223);
  border-radius: 16px;
  padding: 24px;
  text-align: left;
  margin: 5px;
  background: white;
  position: relative;
}
.stat-card:hover {
  box-shadow: 3px 3px 16px 0 rgba(59, 59, 59, 0.1);
}
.stat-card-header {
  font-weight: bold;
  font-size: 1.5em;
  color: var(--primary-color);
  text-align: left;
}
</style>
