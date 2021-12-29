<template>
  <div>
    <div class="title">{{$t('bill.docs_bills')}}</div>
    <el-tabs class="conti-tab" type="card" @tab-click="handleTabClick">
      <el-tab-pane :label="$t('bill.closed')">
        <conti-chiusi></conti-chiusi>
      </el-tab-pane>
      <el-tab-pane :label="$t('bill.parked')">
        <conti-parcheggiati></conti-parcheggiati>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
//import Order from '../data/Order.js';
//import Firebase from "../firebase.js";
//import utils from "../utils.js";
import ContiChiusi from "./ContiChiusi.vue";
import ContiParcheggiati from "./ContiParcheggiati.vue";

export default {
  name: "Conti",
  components: { ContiChiusi, ContiParcheggiati },
  data() {
    return {
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

<style scoped>
.conti-tab {
  margin: 10px;
}
</style>
