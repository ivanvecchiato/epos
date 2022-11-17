import Conto from "./Conto.js";
import Firebase from "../firebase.js";
import repo from "../db/repo.js";

export default class Table {
  constructor() {
    this.id = '';
    this.room = {
      id: 0,
      name: ''
    };
    this.name = '';
    this.places = 2;
    this.contoId = '';
  }

  clearConto(place) {
    console.log('updateConto', place)

    // TODO prelevare il doc corrispondente a contoId
    var docRef = Firebase.db.collection('park').doc(place.area.docId);
    var key = "places." + place.id + ".conto";
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

    conto.place = place;
    if(conto.id.length == 0) {
      repo.createConto(
        place,
        Object.assign({}, conto),
        function(id) {
          console.log('updateConto id', id)
          conto.id = id;
        }
      )
    } else {
      repo.updateConto(
        Object.assign({}, conto),
        function() {
          console.log('updateConto')
        }
      )
    }

    /*
    var docRef = Firebase.db.collection('park').doc(place.area.docId);
    var key = "places." + place.id + ".conto";
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
    */
  }
}
