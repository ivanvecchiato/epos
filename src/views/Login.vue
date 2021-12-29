<template>
  <div id="login">
    <div class="container">
      <div class="pin">{{pin}}</div>
      <div class="keypad">
        <button
        class="button"
          v-for="key in keys"
          :key="key"
          @click="press(key)">
            {{ key }}
        </button>
        <button class="button" plain @click="clear">&larr;</button>
        <button class="button" plain @click="enter">Ok</button>
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
    }
  },
  methods: {
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
        permissions: data.permissions
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
      Firebase.db.collection('operators')
      .where('pin', '==', this.pin)
      .get()
      .then((querySnapshot) => {
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
  padding: 40px;
}
.pin {
  background: #fff;
  padding: 5px;
  width: 300px;
  margin: auto;
  min-height: 20px;
  margin-bottom: 10px;
  border-radius: 12px;
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
  background: #ECEFF1;
  border-radius: 20px;
  padding: 10px;
  width: 30%;
  margin: auto;
}
.button {
  width: 100px;
  height: 40px;
  font-size: 1.5em;
  font-family: "Montserrat", sans-serif;
}
</style>
