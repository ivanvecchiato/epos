<template>
  <div id="app">
    <div class="container">
      <div class="sidemenu" v-if="loggedIn == true">
        <div class="user">
          <el-dropdown trigger="click">
            <img src="@/assets/icons/avatar.png" v-if="avatarLength() > 0"/>
            <div class="avatar" v-else>{{operatorInitial()}}</div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-avatar">{{userName()}}</el-dropdown-item>
                <el-dropdown-item icon="el-icon-right" @click="logout">{{$t('login.logout')}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <el-menu
          mode="vertical"
          @select="handleSelect"
          :default-active="1"
          :collapse="isCollapse"
          style="text-align:left"
          active-text-color="#E65100">
          <el-menu-item index="1" @click="openFrontend">
            <i class="el-icon-house"></i>
            <span>{{ $t("cashier.cashier") }}</span>
          </el-menu-item>
          <el-menu-item index="2" @click="openFloor">
            <i class="el-icon-map-location"></i>
            <span>{{ $t("floor.floor") }}</span>
          </el-menu-item>
          <el-menu-item index="3" @click="openOrders">
            <i class="el-icon-document"></i>
            <span>{{ $t("orders.orders") }}</span>
          </el-menu-item>
          <el-menu-item index="4" @click="openBills">
            <i class="el-icon-data-line"></i>
            <span>{{ $t("bill.bills") }}</span>
          </el-menu-item>
          <el-menu-item index="5" @click="openProducts">
            <i class="el-icon-box"></i>
            <span>{{ $t("pricelist.products") }}</span>
          </el-menu-item>
          <el-menu-item index="6" @click="openSettings" :disabled="!admin()">
            <i class="el-icon-setting"></i>
            <span>{{ $t("config.settings") }}</span>
          </el-menu-item>
          <el-menu-item index="7" @click="openSettings" :disabled="!admin()">
            <i class="el-icon-magic-stick"></i>
            <span>{{ $t("config.extra") }}</span>
          </el-menu-item>
          <el-menu-item index="7" @click="openActions" :disabled="!admin()">
            <i class="el-icon-set-up"></i>
            <span>{{ $t("config.actions") }}</span>
          </el-menu-item>      

        </el-menu>
      </div>
      <div class="center">
        <router-view/>
      </div>
    </div>

    <el-dialog
      :title="$t('config.actions')"
      v-model="showActions"
      :center="false"
      width="40%"
      destroy-on-close>
      <frontend-actions>
      </frontend-actions>
      
    </el-dialog>

    <el-dialog
      v-model="loggedOut"
      :center="true"
      :fullscreen="true"
      :close-on-press-escape="false"
      :show-close="false"
      destroy-on-close>
      <authentication @auth="doAuth">
      </authentication>
      
    </el-dialog>
  </div>
</template>

<script>
import Operator from '../data/Operator.js';
import operator from "../store/user.js"
import FrontendActions from "./FrontendActions.vue"
import Authentication from "./Authentication.vue"
import geolocation from '../store/geolocation'
import Firebase from "../firebase.js";

export default {
  name: 'Home',
  components: {
    FrontendActions, Authentication
  },
  data() {
    return {
      isCollapse: false,
      loggedIn: false,
      showActions: false
    }
  },
  computed: {
    loggedOut() {
      return !this.loggedIn;
    }
  },
  methods: {
    doAuth(user) {
      operator.setUserLogged({
        loggedIn: true,
        operator: user
      });

      console.log("setOperator", operator);
      this.$message({
        message: 'Welcome ' + operator.getName(),
        type: 'success'
      });

      this.loggedIn = true;
      this.$bus.trigger('setOperator', operator)
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    operatorInitial: function() {
      return operator.getName().charAt(0);
    },
    avatarLength: function() {
      if(operator.getAvatar() == undefined) return 0
      else return operator.getAvatar().length
    },
    admin: function() {
      return operator.isAdmin();
    },
    logged: function() {
      return operator.isLogged();
    },
    logout: function() {
      this.loggedIn = false;
      operator.logoutUser();
      //this.$emit('logout')
    },
    userName: function() {
      return operator.getName();
    },
    openFloor: function() {
      this.$router.push("/floor");
    },
    openFrontend: function() {
      this.$router.push("/frontend");
    },
    openOrders: function() {
      this.$router.push("/ordini");
    },
    openBills: function() {
      this.$router.push("/conti");
    },
    openProducts: function() {
      this.$router.push("/prodconfig");
    },
    openSettings: function() {
      this.$router.push("/settings");
    },
    openActions: function() {
      this.showActions = true;
    },
    checkAuth: function() {
      var data = JSON.parse(localStorage.getItem('user'));
      if(data == null) {
        this.loggedIn = false;
        //this.$router.push("/login");
      } else {
        var op = new Operator;
        op.fillData(data);
        operator.setUserLogged({
          loggedIn: true,
          operator: op
        });
        this.loggedIn = true;
        this.$router.push("/frontend");
      }
    },
    getGeolocation() {
        this.gettingLocation = true;
      // get position
      navigator.geolocation.getCurrentPosition(pos => {
        this.gettingLocation = false;
        this.location = pos;
        geolocation.setGeoData(pos);
      }, err => {
        this.gettingLocation = false;
        this.errorStr = err.message;
      })
    },
    playSound() {
      var audio = new Audio(require('@/assets/bell.mp3'));
      audio.play();
    },
    startOrderMonitor() {
      Firebase.db
        .collection("ordini")
        .where("done", "==", false)
        .orderBy("timestamp")
        .onSnapshot((snapshotChange) => {
          this.playSound();
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            console.log('orderMonitor', record);
          });
        });
    }
  },
  mounted() {
    if(("geolocation" in navigator)) {
      console.log('geolocation available');
      this.getGeolocation();
    }

    this.checkAuth();
    console.log("Home", "setting event listener");

    this.startOrderMonitor();
  },
}
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
  text-align: left;
  flex: 0 0 60px;
  margin: 8px;
  background: #fff;
  border-radius: 10px;
  /*border-radius: 12px;*/
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
  text-align: center;
  line-height: 40px;
  width: 40px;
  height: 40px;
  color: #fff;
  margin: 2px;
  font-size: 2em;
  background-color: purple;
  border-radius: 50%;
  text-transform: capitalize;
}
</style>
