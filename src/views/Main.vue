<template>
  <div id="main">
    <el-container>
      <el-main>
        <div class="header">
          <button class="radio lg" :class="{'selected': currentComponent == 'Frontend'}" @click="setCurrentComponent('Frontend')">prodotti</button>
          <button class="radio lg" :class="{'selected': currentComponent == 'Floor'}" @click="setCurrentComponent('Floor')">tavoli</button>
          <button class="radio lg" :class="{'selected': currentComponent == 'Rooms'}" @click="setCurrentComponent('Rooms')">camere</button>
          <button class="radio lg">asporto</button>
        </div>
        <div class="divider"></div>
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
import Rooms from "./Rooms.vue";
import ContoManagement from "./Frontend/ContoManagement.vue";
import operator from "../store/user.js";
import { CircleClose } from "@element-plus/icons";
import Customer from "../data/Customer.js";

export default {
  name: "Main",
  components: {
    Frontend,
    Floor,
    Rooms,
    CircleClose,
    ContoManagement
  },
  data() {
    return {
      currentComponent: "Frontend",
      customer: null,
      checkoutDialogVisibile: false,
    };
  },
  computed: {
    customerName: function () {
      if (this.customer != null) {
        return this.customer.firstName + " " + this.customer.lastName;
      } else {
        return this.$t("customer.add_new");
      }
    },
  },
  methods: {
    setCurrentComponent: function(comp) {
      this.currentComponent = comp
    },
    selectCustomer: function () {},
    addCustomer() {
      this.customer = new Customer();
      this.customer.randomize();
      this.$bus.trigger("addCustomer", this.customer);
      //this.conto.addCustomer(c);
      //console.log('addCustomer', c);
    },
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
  beforeCreate() {
    this.$bus.reset();
  },
  mounted() {
    if(this.currentPlace != undefined) {
      this.contoId = this.currentPlace.contoId;
      delete this.currentPlace.contoId;
      console.log("Main", this.currentPlace);

      this.$bus.trigger("loadConto", {
        place: this.currentPlace,
        billId: this.contoId,
      });
    } else {
      this.$bus.trigger("checkPending", operator);
    }
  },
};
</script>

<style scoped>
.header {
  text-align: left;
  background-color: transparent;
  border-radius: 8px;
  /*padding: 4px 10px;*/
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
.customer {
  text-align: right;
  color: var(--success-color);
}
.customer-name {
  margin: auto;
}
</style>
