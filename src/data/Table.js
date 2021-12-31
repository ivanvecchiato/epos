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

  updateConto(place, order) {
    console.log('updateConto', place)

    var docRef = Firebase.db.collection('park').doc(place.area.docId);
    var key = "places." + place.place + ".order";
    docRef.update({
        [key]: Object.assign({}, order)
      })
    .then(() => {
      console.log("Document successfully written!");
      order.clear();
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  }
}
