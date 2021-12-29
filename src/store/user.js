var user = {
    id: 0,
    loggedIn: false,
    name: '',
    permissions: {},

    setUserLogged (newValue) {
      this.id = newValue.id;
      this.loggedIn = newValue.loggedIn;
      this.name = newValue.name;
      this.permissions = newValue.permissions;
      localStorage.setItem('user', JSON.stringify(this));
    },
    logoutUser () {
      this.id = -1;
      this.loggedIn = false;
      this.username = '';
      this.password = '';
      localStorage.removeItem('user');
    },
    isLogged() {
      return this.loggedIn;
    },
    getUsername() {
      return this.username;
    },
    getName() {
      return this.name;
    },
    getId() {
      return this.id;
    }
  }

  export default user;