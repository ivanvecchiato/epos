
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

  call(f) {
    f();
  }

  update(docId, successCbk, errorCbk) {
    var ref = Firebase.db.collection("operators").doc(docId);
    ref.update(Object.assign({}, this))
      .then(() => {
        this.call(successCbk);
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
        this.call(errorCbk)
      });
  }

  checkPermission (permission, position) {
    var found = false;
    for(var m=0; m<this.permissions.length; m++) {
       if(this.permissions[m].id == permission.id) {
          found = true;
          break;
       }
    }
    if(!found) {
      var newPermission = JSON.parse(JSON.stringify(permission))
      if(this.admin) {
        newPermission.enabled = true;
      }
//      this.permissions.push(newPermission);
      this.permissions.splice(position, 0, newPermission);
    }
  }

  checkPermissions() {
    for(var j=0; j<permissions.length; j++) {
      this.checkPermission(permissions[j], j)
    }
  }

  fillData(data) {
    var keys = Object.keys(this);
    keys.forEach(element => {
      if(data[element] == undefined) data[element] = '';
      this[element] = data[element];
    });
  }
}
