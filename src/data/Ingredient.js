import Firebase from "../firebase.js";
import utils from "../utils.js";

export default class Ingredient {
  constructor() {
    this.id = '';
    this.code = 0;
    this.name = '';
    this.defaultprice = 0.0;
    this.type = 0;    // 0: default;
    this.status = 1;  // 1=active, 0=inactive; -1 deleted
    this.color = "#FFFFFF";
  }

  setData() {
    this.defaultprice = utils.formatPrice(this.defaultprice);
  }

  writeDoc() {
    var ret = 0;
    if(this.id == '') {
      console.log('writeDoc', Object.assign({}, this));
      Firebase.db.collection('ingredienti').add(Object.assign({}, this))
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
    } else {
      ret = 1;
      Firebase.db.collection('ingredienti').doc(this.id).set(Object.assign({}, this), { merge: true })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    }
    return ret;
  }

  fillData(data) {
    var keys = Object.keys(this);
    keys.forEach(element => {
        this[element] = data[element];
    });
  }
}
