import Firebase from "../firebase.js";
import utils from "../utils.js";

export default class Variant {
  constructor() {
    this.id = '';
    this.code = 0;
    this.name = '';
    this.defaultprice = 0.0;
    this.type = 0;    // 0: attribute;
    this.status = 1;  // 1=active, 0=inactive; -1 deleted
    this.color = "#FFFFFF";
    this.values = [];   //{attribute: '', price: 0.0}
  }

  setData() {
    this.defaultprice = utils.formatPrice(this.defaultprice);
    for(var i=0; i<this.values.length; i++) {
      this.values[i].price = utils.formatPrice(this.values[i].price);
    }
  }

  writeDoc() {
    var ret = 0;
    if(this.id == '') {
      console.log('writeDoc', Object.assign({}, this));
      Firebase.db.collection('varianti').add(Object.assign({}, this))
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
    } else {
      ret = 1;
      Firebase.db.collection('varianti').doc(this.id).set(Object.assign({}, this), { merge: true })
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

  mockdata() {
    this.code = '101';
    this.name = 'gusto';
    this.values.push({'attribute':'cioccolato', price: 0.0});
    this.values.push({'attribute':'fragola', price: 0.0});
    this.values.push({'attribute':'vaniglia', price: 0.});

    this.writeDoc();

    this.values = [];
    this.code = '102';
    this.name = 'aggiungi';
    this.values.push({'attribute':'latte freddo', price: 0.0});
    this.values.push({'attribute':'latte caldo', price: 0.0});
    this.values.push({'attribute':'aggiunta 1', price: 1.5});
    this.values.push({'attribute':'aggiunta 2', price: 2.0});
    this.writeDoc();
  }
}
