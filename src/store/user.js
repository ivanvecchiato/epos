var user = {
    id: 0,
    loggedIn: false,
    name: '',
    admin: false,
    permissions: {},
    avatar: '',

    setUserLogged (newValue) {
      this.id = newValue.id;
      this.loggedIn = newValue.loggedIn;
      this.name = newValue.name;
      this.permissions = newValue.permissions;
      this.admin = newValue.admin;
      localStorage.setItem('user', JSON.stringify(this));
    },
    logoutUser () {
      this.id = -1;
      this.loggedIn = false;
      this.admin = false;
      this.username = '';
      this.password = '';
      localStorage.removeItem('user');
    },
    isAdmin() {
      return this.admin;
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