import Operator from "../data/Operator"

var user = {
    id: 0,
    operator: new Operator,

    setUserLogged (newValue) {
      this.loggedIn = newValue.loggedIn;
      this.operator = newValue.operator;
      localStorage.setItem('user', JSON.stringify(this.operator));
    },
    logoutUser () {
      this.loggedIn = false;
      this.operator = null;
      localStorage.removeItem('user');
    },
    isAdmin() {
      return this.operator.admin;
    },
    isLogged() {
      return this.loggedIn;
    },
    getName() {
      return this.operator.name;
    },
    getId() {
      return this.operator.id;
    },
    getAvatar() {
      return this.operator.avatar;
    }
  }

  export default user;