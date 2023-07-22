<template>
  <div id="app">
    <div class="container">
      <div class="sidemenu" v-if="loggedIn == true">
        <div class="control-bar-user">
          <el-dropdown trigger="click">
            <img src="@/assets/icons/avatar.png" v-if="avatarLength() > 0" />
            <div class="avatar" v-else>{{ operator() }}</div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-avatar">{{
                  operator()
                }}</el-dropdown-item>
                <el-dropdown-item icon="el-icon-right" @click="logout">{{
                  $t("login.logout")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div style="width: 100%; display: table">
          <div style="display: table-row">
            <div class="control-bar-item">
              <img
                class="indicator"
                :class="getPrinterIndicator"
                src="@/assets/icons/printer.png"
              />
            </div>
            <div class="control-bar-item">
              <el-popover
                placement="right"
                title="Server locale"
                :width="200"
                trigger="click"
                :content="getServerPopoverContent()"
              >
                <template #reference>
                  <img
                    class="indicator"
                    :class="getServerIndicator"
                    src="@/assets/icons/gear.png"
                  />
                </template>
              </el-popover>
            </div>
          </div>
        </div>
        <el-menu
          mode="vertical"
          @select="handleSelect"
          :default-active="1"
          :collapse="isCollapse"
          style="text-align: left"
          active-text-color="#E65100"
        >
          <el-menu-item index="1" @click="openDashboard">
            <i class="el-icon-house"></i>
            <span class="sidebar">{{ $t("cashier.dashboard") }}</span>
          </el-menu-item>
          <el-menu-item index="2" @click="openFrontend">
            <i class="el-icon-shopping-cart-full"></i>
            <span class="sidebar">{{ $t("cashier.cashier") }}</span>
          </el-menu-item>
          <el-menu-item index="3" @click="openFloor">
            <i class="el-icon-map-location"></i>
            <span class="sidebar">{{ $t("floor.floor") }}</span>
          </el-menu-item>
          <el-menu-item index="4" @click="openOrders">
            <i class="el-icon-document"></i>
            <span class="sidebar">{{ $t("orders.orders") }}</span>
          </el-menu-item>
          <el-menu-item index="5" @click="openBills">
            <i class="el-icon-data-line"></i>
            <span class="sidebar">{{ $t("bill.bills") }}</span>
          </el-menu-item>
          <el-menu-item index="6" @click="openProducts">
            <i class="el-icon-box"></i>
            <span class="sidebar">{{ $t("pricelist.products") }}</span>
          </el-menu-item>
          <el-menu-item index="7" @click="openSettings" :disabled="!admin()">
            <i class="el-icon-setting"></i>
            <span class="sidebar">{{ $t("config.settings") }}</span>
          </el-menu-item>
          <el-menu-item index="8" @click="openExtra" :disabled="!admin()">
            <i class="el-icon-magic-stick"></i>
            <span class="sidebar">{{ $t("config.extra") }}</span>
          </el-menu-item>
          <el-menu-item index="9" @click="openActions" :disabled="!admin()">
            <i class="el-icon-set-up"></i>
            <span class="sidebar">{{ $t("config.actions") }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="center">
        <router-view />
      </div>
    </div>

    <el-dialog
      :title="$t('config.actions')"
      v-model="showActions"
      :center="false"
      width="40%"
      destroy-on-close
    >
      <frontend-actions> </frontend-actions>
    </el-dialog>

    <el-dialog
      v-model="loggedOut"
      :center="true"
      :fullscreen="true"
      :close-on-press-escape="false"
      :show-close="false"
      destroy-on-close
    >
      <authentication @auth="doAuth"> </authentication>
    </el-dialog>
  </div>
</template>

<script>
import Operator from "../data/Operator.js";
import operator from "../store/user.js";
import FrontendActions from "./FrontendActions.vue";
import Authentication from "./Authentication.vue";
import geolocation from "../store/geolocation";
import Firebase from "../firebase.js";
import printf from "../fiscalprinter/printf.js";
import axios from "axios";

export default {
  name: "Home",
  components: {
    FrontendActions,
    Authentication,
  },
  data() {
    return {
      isCollapse: false,
      loggedIn: false,
      showActions: false,
      printfConnectedStatus: false,
      localServerStatus: false,
      localServerIP: "0.0.0.0",
    };
  },
  computed: {
    loggedOut() {
      return !this.loggedIn;
    },
    getPrinterIndicator() {
      if (this.printfConnectedStatus == true) return "indicator-green";
      else return "indicator-red";
    },
    getServerIndicator() {
      if (this.localServerStatus == true) return "indicator-green";
      else return "indicator-red";
    },
    operatorInitial: function () {
      return operator.getName().charAt(0);
    },
  },
  methods: {
    admin: function () {
      return operator.isAdmin();
    },
    getServerPopoverContent: function () {
      if (this.localServerStatus == true) {
        return this.localServerIP;
      } else {
        return "server non disponibile";
      }
    },
    doAuth(user) {
      operator.setUserLogged({
        loggedIn: true,
        operator: user,
      });

      console.log("setOperator", operator);
      this.$message({
        message: "Welcome " + operator.getName(),
        type: "success",
      });

      this.loggedIn = true;
      this.$bus.trigger("setOperator", operator);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    operator() {
      return operator.getName();
    },
    avatarLength: function () {
      if (operator.getAvatar() == undefined) return 0;
      else return operator.getAvatar().length;
    },
    logged: function () {
      return operator.isLogged();
    },
    logout: function () {
      this.loggedIn = false;
      operator.logoutUser();
      //this.$emit('logout')
    },
    openFloor: function () {
      this.$router.push("/floor");
    },
    openDashboard: function () {
      this.$router.push("/dashboard");
    },
    openFrontend: function () {
      this.$router.push("/frontend");
    },
    openOrders: function () {
      this.$router.push("/ordini");
    },
    openBills: function () {
      this.$router.push("/conti");
    },
    openProducts: function () {
      this.$router.push("/prodconfig");
    },
    openSettings: function () {
      this.$router.push("/settings");
    },
    openExtra: function () {
      this.$router.push("/extras");
    },
    openActions: function () {
      this.showActions = true;
    },
    checkAuth: function () {
      var data = JSON.parse(localStorage.getItem("user"));
      if (data == null) {
        this.loggedIn = false;
        //this.$router.push("/login");
      } else {
        var op = new Operator();
        op.fillData(data);
        operator.setUserLogged({
          loggedIn: true,
          operator: op,
        });
        this.loggedIn = true;
        this.$router.push("/dashboard");
      }
    },
    getGeolocation() {
      this.gettingLocation = true;
      // get position
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.gettingLocation = false;
          this.location = pos;
          geolocation.setGeoData(pos);
        },
        (err) => {
          this.gettingLocation = false;
          this.errorStr = err.message;
        }
      );
    },
    playSound() {
      var audio = new Audio(require("@/assets/bell.mp3"));
      audio.play();
    },
    startOrderMonitor() {
      Firebase.db
        .collection("ordini")
        .where("done", "==", false)
        .orderBy("timestamp")
        .onSnapshot((snapshotChange) => {
          this.playSound();
          // eslint-disable-next-line no-unused-vars
          snapshotChange.forEach((doc) => {
            //var record = doc.data();
            //console.log('orderMonitor', record);
          });
        });
    },
    testPrintf() {
      printf.init();
      printf.getStatus((resp) => {
        //console.log('testPrintf', resp)
        if (resp.result == "ok") {
          var data = resp.data;
          if (data.Service.ECRStatus[0].mode != "REG") {
            printf.setKey("REG");
          } else {
            printf.clear();
          }
          printf.setConnectedStatus(true);
          this.printfConnectedStatus = true;
        } else {
          printf.setConnectedStatus(false);
          this.printfConnectedStatus = false;
        }
      });
    },
    testLocalServer() {
      var self = this;

      axios
        .get("http://localhost:8088/test")
        .then(function (response) {
          //console.log('testLocalServer', response.data);
          self.localServerIP = response.data.ip;
          self.localServerStatus = true;
        })
        .catch(function (error) {
          //console.log(error);
          error;
          self.localServerStatus = false;
        });
    },
  },
  mounted() {
    if ("geolocation" in navigator) {
      console.log("geolocation available");
      this.getGeolocation();
    }

    this.checkAuth();
    console.log("Home", "setting event listener");
    this.testPrintf();
    setInterval(
      function () {
        this.testPrintf();
      }.bind(this),
      15000
    );

    this.testLocalServer();
    setInterval(
      function () {
        this.testLocalServer();
      }.bind(this),
      16000
    );

    this.startOrderMonitor();
  },
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
}
.container {
  display: flex;
}
.sidemenu {
  text-align: center;
  flex: 0 0 60px;
  margin: 8px;
  background: #fff;
  border-radius: 10px;
}
.center {
  flex: 1;
  margin-left: 2px;
  height: 100vh;
  overflow: scroll;
}
.user {
  margin-left: 20px;
}
.avatar {
  color: #a78658;
  margin: 2px;
  font-size: 1.1em;
  font-weight: normal;
  background: #efebe9;
  border: solid 0px white;
  border-radius: 4px;
  padding: 2px 10px 2px 10px;
}
.control-bar-user {
  margin: 4px;
}
.control-bar-item {
  margin-left: 5px;
  display: table-cell;
}

.indicator {
  width: 25px;
  height: 25px;
  margin: 2px;
  border-radius: 8px;
  padding: 4px;
}
.indicator-red {
  background-color: var(--danger-color);
}
.indicator-green {
  background-color: #4caf50;
}
.sidebar {
  font-size: 1.4em;
  font-weight: 500;
}
</style>
