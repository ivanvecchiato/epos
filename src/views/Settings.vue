<template>
  <div class="settings">
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane :label="$t('config.operators')">
        <operators></operators>
      </el-tab-pane>
      <el-tab-pane :label="$t('config.accounts')">
        <accounts-config></accounts-config>
      </el-tab-pane>
      <el-tab-pane :label="$t('config.settings')">
        <configs></configs>
      </el-tab-pane>
      <el-tab-pane :label="$t('config.production')">
        <aree-produzione></aree-produzione>
      </el-tab-pane>
      <el-tab-pane :label="$t('config.admin')">
        <admin></admin>
      </el-tab-pane>
      <el-tab-pane :label="$t('config.fiscal-printer')">
        <fiscal-printer></fiscal-printer>
      </el-tab-pane>
    </el-tabs>  
  </div>
</template>

<script>
import Operators from "./Operators/Operators.vue"
import Admin from "./Admin/Admin.vue"
import Configs from "./Admin/Configs.vue"
import FiscalPrinter from "./Admin/FiscalPrinter.vue"
import AreeProduzione from "./Aree/AreeProduzione.vue"
import AccountsConfig from "./Aree/AccountsConfig.vue"

export default {
  name: "Settings",
  components: { Operators, Admin, AreeProduzione, FiscalPrinter, Configs, AccountsConfig },
  data() {
    return {
    };
  },
  methods: {
    handleClick: function() {
      
    }
  },
  mounted() {
  },
};
</script>

<style scoped>
.settings {
  background-color: white;
}
</style>
