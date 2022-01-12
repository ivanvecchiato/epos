<template>
  <div id="login">
    <div class="logo">
      <img src="@/assets/logo.png"/>
    </div>

    <div class="container">
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
import operator from "../store/user.js"
import Firebase from "../firebase.js"
import Log from "../data/Log.js"

export default {
  name: 'Login',
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
    setOperator: function(user) {
      console.log("setOperator", user);
      this.$message({
        message: 'Welcome ' + user.name,
        type: 'success'
      });
      this.$router.push("/frontend");
    },
    loginSuccess: function (id, data) {
      operator.setUserLogged({
        loggedIn: true,
        id: id,
        name: data.name,
        permissions: data.permissions,
        admin: data.admin
      });

      var event = {
        type: Log.EVENT_LOGIN,
        description: operator.name + " " + this.$t("login.loggedin"),
        comment: ''
      }
      new Log(event, 0).writeLog();
      this.setOperator(operator);
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
              this.loginSuccess(doc.id, doc.data());
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
  margin: 20px
}
.pin {
  background: #FED59E;
  color: #815854;
  font-family: "Montserrat-Bold", sans-serif;
  padding: 5px;
  width: 300px;
  margin: auto;
  min-height: 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  text-security: disc;
}
.keypad {
  display: grid;
  grid-template-columns: 100px 100px 100px;
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
  border: solid 1px #FED59E;
  border-radius: 20px;
  padding: 10px;
  width: 30%;
  margin: auto;
}
.regular-button {
  width: 100px;
  height: 40px;
  font-size: 1.5em;
  font-family: "Montserrat-Bold", sans-serif;
  background: #fff;
  color: #815854;
  border: solid 1px #815854;
  border-radius: 8px;
  box-shadow: 3px 3px 4px 0 rgba(0,0,0,0.4);
}
.regular-button:focus {
  background: #815854;
  transform: scale(1.02);
  color: #fff;
}
.action-button {
  width: 100px;
  height: 40px;
  font-size: 1.5em;
  font-family: "Montserrat-Bold", sans-serif;
  background: #815854;
  border: 0px;
  color: #fff;
  border-radius: 8px;
  box-shadow: 3px 3px 4px 0 rgba(0,0,0,0.4);
}
.action-button:focus {
  background: #d1b3b0;
  transform: scale(1.02);
}

</style>
