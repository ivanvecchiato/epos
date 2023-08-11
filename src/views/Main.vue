<template>
  <div id="main">
    <el-container>
      <el-main>
        <div class="header">
          <el-button @click="currentComponent='Frontend'">cassa</el-button>
          <el-button @click="currentComponent='Floor'">tavoli</el-button>
        </div>
        <component :is="currentComponent"></component>
      </el-main>
      <el-aside width="400px">
        <div style="min-height: 100vh;">
          <div class="side">
            <conto-management
              ref="contoMgmt"
              :data="currentPlace"
              @annullaConto="annullaConto"
              @reassignedConto="reassignedConto"
              @contoParked="contoParked"
              @pagaConto="pagaConto"
            >
            </conto-management>
          </div>
        </div>
      </el-aside>
    </el-container>

  </div>
</template>

<script>
import Frontend from "./Frontend.vue";
import Floor from "./Floor.vue";
import ContoManagement from "./Frontend/ContoManagement.vue";

export default {
  name: "Main",
  components: {
    Frontend,
    Floor,
    ContoManagement
  },
  data() {
    return {
      currentComponent: "Frontend"
    };
  },
  computed: {

  },
  methods: {
    annullaConto: function () {
      //this.conto.clear();
    },
    pagaConto: function (conto) {
      this.showCheckoutDialog(conto);
    },
    contoParked: function () {
      this.currentPlace = null;
      var msg = "Conto parcheggiato"; //this.$t('bill.parked');
      this.$message({
        type: "success",
        message: msg,
      });
    },
    reassignedConto: function (size) {
      this.currentPlace = null;
      if (size > 0) {
        var msg = this.$t("bill.reassigned");
        this.$message({
          type: "success",
          message: msg,
        });
      }
    },
  },
  mounted() {
  },
};
</script>

<style scoped>
.header {
  text-align: left;
  background-color: #fff;
  border-radius: 8px;
  padding: 4px 10px;
}
.side {
  height: 96vh;
  margin: 20px 10px 30px 10px;
  border: solid 0px rgb(134, 131, 131);
  border-radius: 12px;
  display: flex;
  padding: 5px;
  flex-direction: column;
  background: #fff;
}
</style>
