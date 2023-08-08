<template>
  <div class="login">
    <div style="text-align:center;margin: auto;">
    <div class="pin">{{maskPin()}}</div>
    <div class="keypad">
      <button
        class="regular-button"
        v-for="key in keys"
        :key="key"
        @click="press(key)">
          {{ key }}
      </button>
      <button class="action-button" plain @click="clear">&larr;</button>
      <button class="action-button" plain @click="enter"
        v-loading.fullscreen.lock="fullscreenLoading">Ok</button>
    </div>
    </div>
  </div>
</template>

<script>
//import operator from "../store/user.js"
import Firebase from "../firebase.js"
//import Log from "../data/Log.js"
import Operator from '../data/Operator.js'

export default {
  name: 'Authentication',
  components: {
    //Frontend
  },
  data() {
    return {
      pin: '',
      keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      fullscreenLoading: false
    }
  },
  methods: {
    maskPin: function() {
      var masked = '';
      for(var i=0; i<this.pin.length; i++) {
        masked += '\u25CF';
      }
      return masked;
    },
    press: function(key) {
      this.pin += key;
    },
    clear: function() {
      this.pin = this.pin.substring(0, this.pin.length - 1);
    },
    enter: function() {
      this.userLogin();
    },
    loginFail: function() {
        this.$message({
          message: this.$t('login.wrong_login'),
          type: 'error'
        });
        this.pin = '';
    },
    loginSuccess: function (op) {
      /*
      var event = {
        type: Log.EVENT_LOGIN,
        description: op.name + " " + this.$t("login.loggedin"),
        comment: ''
      }
      new Log(event, 0).writeLog();
      */
      this.$emit('auth', op)
    },
    userLogin: function() {
      this.fullscreenLoading = true;

      Firebase.db.collection('operators')
      .where('pin', '==', this.pin)
      .get()
      .then((querySnapshot) => {
        this.fullscreenLoading = false;
        if(querySnapshot.empty) {
          this.loginFail();
        } else {
          querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
              var op = new Operator;
              op.fillData(doc.data());
              this.loginSuccess(op);
          });
        }
      })
      .catch((error) => {
        this.fullscreenLoading = false;
        console.log("Error getting documents: ", error);
        this.loginFail();
      })
    }
  },
  mounted() {
  },
}
</script>

<style scoped>
.login {
  text-align: center;
  padding: 20px;
  width: 100%;
  height: 100vh;
  --login-color: rgba(187, 149, 80, 0.767)!important;
}
.pin {
  /*border: solid 1px var(--login-color);*/
  background: transparent;
  color: var(--login-color);
  font-weight: bold;
  padding: 5px;
  width: 200px;
  margin: auto;
  min-height: 20px;
  margin-bottom: 10px;
  border-radius: 8px;
}
.keypad {
  display: grid;
  grid-template-columns: 120px 120px 120px;
  grid-template-rows: auto;
  grid-gap: 5px;
  padding: 10px;
  margin: auto;
}
.regular-button {
  width: 100px;
  height: 60px;
  font-size: 2em;
  font-weight: 900;
  background: #fff;
  color: var(--login-color);
  border: solid 2px var(--login-color);
  border-radius: 8px;
}
.regular-circle-button {
  width: 70px;
  height: 70px;
  font-size: 1.5em;
  font-weight: bold;
  background: #fff;
  color: var(--secondary-color);
  border: solid 1px var(--secondary-color);
  border-radius: 50%;
}
.regular-button:focus {
  background: var(--login-color);
  transform: scale(1.02);
  color: #fff;
}
.regular-circle-button:focus {
  background: var(--secondary-color);
  transform: scale(1.02);
  color: #fff;
}
.action-button {
  width: 100px;
  height: 60px;
  font-size: 2em;
  font-weight: 900;
  background: var(--login-color);
  border: 0px;
  color: #fff;
  border-radius: 8px;
}
.action-circle-button {
  width: 70px;
  height: 70px;
  font-size: 1.5em;
  font-weight: bold;
  background: var(--secondary-color);
  border: solid 1px var(--secondary-color);
  color: #fff;
  border-radius: 50%;
}
.action-button:focus {
  background: #fff;
  color: var(--login-color);
  border: solid 1px var(--login-color);
  transform: scale(1.02);
}
.action-circle-button:focus {
  background: #fff;
  color: var(--secondary-color);
  transform: scale(1.02);
}

</style>
