<template>
  <div>
  <el-tabs type="card" @tab-click="handleClick">
    <el-tab-pane :label="$t('config.operators')">
      <operators></operators>
    </el-tab-pane>
    <el-tab-pane label="Config">Config</el-tab-pane>
    <el-tab-pane label="Role">Role</el-tab-pane>
    <el-tab-pane :label="$t('config.admin')">
      <admin></admin>
    </el-tab-pane>
  </el-tabs>
      
  </div>
</template>

<script>
import Operators from "./Operators/Operators.vue"
import Admin from "./Admin/Admin.vue"

export default {
  name: "Settings",
  components: { Operators, Admin },
  data() {
    return {
    };
  },
  methods: {

  },
  mounted() {
  },
};
</script>

<style scoped>
</style>
