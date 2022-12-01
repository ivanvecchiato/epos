const dbtype = 'firestore';
//const dbtype = 'couch';
import PouchDB from 'pouchdb'
import Firebase from "@/firebase.js"
import Conto from "@/data/Conto.js";


var repo = {
   contiAperti: [],

   addDoc(collection, obj, callback) {
      if (dbtype == 'couch') {
         var db = new PouchDB('http://localhost:5984/tables');
         db.put(obj).then(function (response) {
            if (callback != undefined) {
               callback(response);
            }
         }).catch(function (err) {
            console.log(err);
         });
      } else {
         Firebase.db.collection(collection).add(obj)
            .then((docRef) => {
               if (callback != undefined) {
                  callback(docRef);
               }
               //console.log("Document written with ID: ", docRef.id)
            })
            .catch((error) => {
               console.error("Error adding document: ", error)
            })
      }
   },

   setOrder(obj) {
      Firebase.db.collection('ordini').add(obj)
         .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
         })
         .catch((error) => {
            console.error("Error adding document: ", error)
         })
   },

   createConto(place, obj, callback) {
      Firebase.db.collection('conti').add(obj)
         .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

            // update del park con il riferimento del conto
            var ref = Firebase.db.collection('park').doc(place.areaDocId);
            var key = "places." + place.placeId + ".contoId";
            ref.update({
               [key]: docRef.id
            }).then(() => {
               console.log("Document successfully written!");
            }).catch((error) => {
               console.error("Error writing document: ", error);
            });

            if (callback != undefined) {
               callback(docRef.id)
            }
         })
         .catch((error) => {
            console.error("Error adding document: ", error)
         })
   },

   updateConto(obj, callback) {
      Firebase.db.collection('conti').doc(obj.id).set(obj)
         .then(() => {
            console.log("Document updated");
            if (callback != undefined) {
               callback()
            }
         })
         .catch((error) => {
            console.error("Error updating document: ", error)
         })
   },

   getConto(id) {
      var selected = null;
      var conto = new Conto;
      for (var i = 0; i < this.contiAperti.length; i++) {
         if (this.contiAperti[i].id == id) {
            selected = this.contiAperti[i];
            break;
         }
      }
      if (selected != null) {
         conto.fillData(selected);
      }
      return conto;
   },

   getParks(callback) {
      Firebase.db
         .collection("park")
         .orderBy("order")
         .onSnapshot((snapshotChange) => {
            var areas = [];
            snapshotChange.forEach((doc) => {
               var area = doc.data();
               area.docId = doc.id;
               var places = area.places;
               for (var n in places) {
                  if (places[n].contoId != '') {
                     places[n].conto = this.getConto(places[n].contoId);
                     places[n].showMenu = false;
                  }
                  places[n].key = n;
               }
               areas.push(area);
            });
            var currentArea = areas[0];
            console.log(currentArea.places);

            if (callback != undefined) {
               callback(areas);
            }
         });
   },

   getOpenTabs(callback) {
      Firebase.db
         .collection("conti")
         .where("chiusuraFiscale", "==", 0)
         .where("status", ">=", 0)
         .onSnapshot((snapshotChange) => {
            var docs = [];

            var size = snapshotChange.size;
            if (size == 0) {
               if (callback != undefined) {
                  callback(docs)
               }
            } else {
               var count = 0;
               snapshotChange.forEach((doc) => {
                  var record = doc.data();
                  record.id = doc.id;
                  docs.push(record);
                  if (count == size - 1) {
                     if (callback != undefined) {
                        callback(docs)
                     }
                     this.contiAperti = docs;
                  }
                  count++;
               });
            }
         });
   },

   resetConti(callback) {
      Firebase.db.collection("conti")
         .get()
         .then((querySnapshot) => {
            var size = querySnapshot.size;
            if (size == 0) {
               if (callback != undefined) {
                  callback()
               }
            } else {
               var count = 0;
               querySnapshot.forEach((doc) => {
                  var docId = doc.id;
                  Firebase.db.collection('conti')
                     .doc(docId)
                     .delete()
                     .then()
                     .catch();
                  if (count == size - 1) {
                     if (callback != undefined) {
                        callback()
                     }
                  }
                  count++;
               });
            }
         })
         .catch((error) => {
            console.log("Error getting documents: ", error);
         });
   },

   resetOrdini(callback) {
      Firebase.db.collection("ordini")
         .get()
         .then((querySnapshot) => {
            var size = querySnapshot.size;
            if (size == 0) {
               if (callback != undefined) {
                  callback()
               }
            } else {
               var count = 0;
               querySnapshot.forEach((doc) => {
                  var docId = doc.id;
                  Firebase.db.collection('ordini')
                     .doc(docId)
                     .delete()
                     .then()
                     .catch();
                  if (count == size - 1) {
                     if (callback != undefined) {
                        callback()
                     }
                  }
                  count++;
               });
            }
         })
         .catch((error) => {
            console.log("Error getting documents: ", error);
         });
   },

   resetParkReferences() {
      Firebase.db.collection("park")
      .get()
      .then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
            var docId = doc.id;
            var floor = doc.data().places;
            for(var key in floor) {
               var docRef = Firebase.db.collection('park').doc(docId);
               var place = "places." + key + ".contoId";
               docRef.update({
                  [place]: ''
               })
               .then(() => {
                 console.log("Document successfully written!");
               })
               .catch((error) => {
                 console.error("Error writing document: ", error);
               });
            }
            this.resetPendingOrders();
         });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
   },

   deleteConto(contoId, place, callback) {
      console.log(contoId, place);

      Firebase.db.collection('conti').doc(contoId).update(
         {
            status: -100
         }
      ).then(() => {
            console.log("Document updated");

            // rimozione del riferimento al conto
            var ref = Firebase.db.collection('park').doc(place.areaDocId);
            var key = "places." + place.placeId + ".contoId";
            ref.update({
               [key]: ''
            }).then(() => {
               console.log("Document successfully written!");
            }).catch((error) => {
               console.error("Error writing document: ", error);
            });
            
            if (callback != undefined) {
               callback()
            }
         })
         .catch((error) => {
            console.error("Error updating document: ", error)
         })
   }

}

export default repo;