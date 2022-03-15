<template>
  <div class="row">
    <el-row :gutter="20" align="middle">
      <el-col :span="2">
        <el-input id="f1" v-model="name" placeholder="name" />
      </el-col>
      <el-col :span="2">
        <el-input id="f2" v-model="seats" placeholder="seats" />
      </el-col>
      <el-col :span="4">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          circle
          plain
          @click="deletePlace">
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AccountsConfigItem",
  props: ["data"],
  data() {
    return {
      id: 0,
      name: '',
      seats: 0
    };
  },
  methods: {
    deletePlace: function() {

    }
  },
  mounted() {
    if (this.data != undefined) {
      this.id = this.data.id;
      this.name = this.data.name;
      this.seats = this.data.seats;
    }
  },
};
</script>

<style scoped>
.row {
  margin-left: 10px;
}
</style>