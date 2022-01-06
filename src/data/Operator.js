
import permissions from "./Permissions.js"
import Firebase from "../firebase.js";

export default class Operator {
  constructor() {
    this.id = 0;
    this.name = '';
    this.pin = '0000';
    this.admin = false;
    this.permissions = permissions;
    this.avatar = ''
  }

  save(id) {
    this.id = id;

    Firebase.db
      .collection("operators")
      .add(Object.assign({}, this))
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
}
