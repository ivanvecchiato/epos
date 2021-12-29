import Order from "./Order.js";
import Firebase from "../firebase.js";

export default class Table {
  constructor() {
    this.id = '';
    this.room = {
      id: 0,
      name: ''
    };
    this.name = '';
    this.places = 2;
    this.order = new Order;
  }

  updateConto(id, order) {

    Firebase.db.collection('park').doc(id).set({
        order: Object.assign({}, order)
      }, { merge: true }
      )
    .then(() => {
      console.log("Document successfully written!");
      order.clear();
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  }
}
