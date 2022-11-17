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

   getContoID(place, callback) {
      var docRef = Firebase.db.collection("park").doc(place.area.docId);
      var key = "places." + place.id + ".contoId"

      docRef.get().then((doc) => {
         if (doc.exists) {
            console.log("getContoId:", doc.data()[key]);

            if (callback != undefined) {
               callback(doc.data()[key])
            }
         } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
         }
      }).catch((error) => {
         console.log("Error getting document:", error);
      });
   },

   createConto(place, obj, callback) {
      Firebase.db.collection('conti').add(obj)
         .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

            // update del park con il riferimento del conto
            var ref = Firebase.db.collection('park').doc(place.area.docId);
            var key = "places." + place.id + ".contoId";
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
      for(var i=0; i<this.contiAperti.length; i++) {
        if(this.contiAperti[i].id == id) {
          selected = this.contiAperti[i];
          break;
        }
      }
      conto.fillData(selected);
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
            for(var n in places) {
              if(places[n].contoId != '') {
               places[n].conto = this.getConto(places[n].contoId);
               places[n].showMenu = false;
              }
              places[n].key = n;
            }
            areas.push(area);
          });
          var currentArea = areas[0];
          console.log(currentArea.places);

          if(callback != undefined) {
            callback(areas);
          }
        });
    },

    getOpenTabs(callback) {
      Firebase.db
        .collection("conti")
        .where("chiusuraFiscale", "==", 0)
        .onSnapshot((snapshotChange) => {
          var docs = [];

          if(snapshotChange.size == 0) {
            if(callback != undefined) {
               callback(docs)
             }   
          } else {
            var count = 0;
            snapshotChange.forEach((doc) => {
               var record = doc.data();
               record.id = doc.id;
               docs.push(record);
               count++;
               if(count == snapshotChange.size -1) {
                  if(callback != undefined) {
                     callback(docs)
                  }
                  this.contiAperti = docs;
               }
             });   
          }
        });
    }
}

export default repo;