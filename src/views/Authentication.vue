<template>
  <div id="login">
    <div class="logo">
      <img src="@/assets/logo.png"/>
    </div>

    <div class="container">
      <div class="pin">{{maskPin()}}</div>
      <div class="keypad">
        <button
        class="regular-circle-button"
          v-for="key in keys"
          :key="key"
          @click="press(key)">
            {{ key }}
        </button>
        <button class="action-circle-button" plain @click="clear">&larr;</button>
        <button class="action-circle-button" plain @click="enter"
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
#login {
  text-align: center;
  padding: 20px;
}
.logo {
  margin: 20px;
  float: left;
}
.pin {
  border: solid 1px var(--secondary-color);
  color: var(--secondary-color);
  font-weight: bold;
  padding: 5px;
  width: 200px;
  margin: auto;
  min-height: 20px;
  margin-bottom: 10px;
  border-radius: 10px;
}
.keypad {
  display: grid;
  grid-template-columns: 20px 20px 20px;
  grid-template-rows: auto;
  grid-gap: 10px;
  padding: 10px;
  justify-content: space-evenly;
  justify-items: center;
  align-content: space-evenly;
  align-items: center;
}
.container {
  background: #fff;
  border-radius: 20px;
  padding: 10px;
  float: right;
  width: 30%;
  margin: auto;
}
.regular-button {
  width: 100px;
  height: 40px;
  font-size: 1.5em;
  font-weight: bold;
  background: #fff;
  color: var(--secondary-color);
  border: solid 1px var(--secondary-color);
  border-radius: 8px;
  box-shadow: 3px 3px 4px 0 rgba(0,0,0,0.4);
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
  background: var(--secondary-color);
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
  height: 40px;
  font-size: 1.5em;
  font-weight: bold;
  background: var(--secondary-color);
  border: 0px;
  color: #fff;
  border-radius: 8px;
  box-shadow: 3px 3px 4px 0 rgba(0,0,0,0.4);
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
  border: solid 1px var(--secondary-color);
  transform: scale(1.02);
}
.action-circle-button:focus {
  background: #fff;
  color: var(--secondary-color);
  transform: scale(1.02);
}

</style>
