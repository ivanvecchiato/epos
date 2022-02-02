import Conto from "./Conto.js";
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
    this.conto = new Conto;
  }

  clearConto(place) {
    console.log('updateConto', place)

    var docRef = Firebase.db.collection('park').doc(place.area.docId);
    var key = "places." + place.place + ".conto";
    docRef.update({
        [key]: Object.assign({}, new Conto)
      })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  }

  updateConto(place, conto) {
    console.log('updateConto', place)

    var docRef = Firebase.db.collection('park').doc(place.area.docId);
    var key = "places." + place.place + ".conto";
    docRef.update({
        [key]: Object.assign({}, conto)
      })
    .then(() => {
      console.log("Document successfully written!");
      if(conto != null)
        conto.clear();
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  }
}
