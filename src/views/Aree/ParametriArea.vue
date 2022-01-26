<template>
  <div class="row">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-input id="f1" v-model="name" placeholder="name" />
      </el-col>
      <el-col :span="4">
        <el-input id="f2" v-model="printerAddress" placeholder="IP Stampante" />
      </el-col>
      <el-col :span="4">
        <el-button
          type="success"
          size="small"
          icon="el-icon-check"
          circle
          plain
          @click="saveArea"
        ></el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          circle
          plain
          @click="deleteArea"
        ></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ParametriArea",
  props: ["data"],
  data() {
    return {
      id: 0,
      name: "",
      printerAddress: "",
    };
  },
  methods: {
    saveArea() {
      this.$emit("saveArea", {
        id: this.id,
        name: this.name,
        printerAddress: this.printerAddress,
      });
    },
    deleteArea() {
      this.$emit("deleteArea", this);
    },
  },
  mounted() {
    if (this.data != undefined) {
      this.id = this.data.id;
      this.name = this.data.name;
      this.printerAddress = this.data.printerAddress;
    }
  },
};
</script>

<style scoped>
.row {
  margin-left: 10px;
}
</style>