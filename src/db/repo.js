const dbtype = 'firestore';
//const dbtype = 'couch';
import PouchDB from 'pouchdb'
import Firebase from "@/firebase.js"
import Conto from "@/data/Conto.js";


var repo = {
   contiAperti: [],
   catalog: [],
   variants: [],

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
   },

   // eslint-disable-next-line no-unused-vars
   collectSospesi(dateRange, callback) {
      var docs = [];
//        var start = firebase.firestore.Timestamp.fromDate(this.dateRange[0]);
//        var end = firebase.firestore.Timestamp.fromDate(this.dateRange[1]);

      Firebase.db
      .collection("conti")
      .where('status', "==", 0)
      .onSnapshot((querySnapshot) => {            
         var size = querySnapshot.size;
         if (size == 0) {
            if (callback != undefined) {
               callback()
            }
         } else {
            var count = 0;
            querySnapshot.forEach((doc) => {
               var bill = doc.data();
               var conto = new Conto;
               conto.fillData(bill);
               conto.id = doc.id;
               docs.push(conto);
               if (count == size - 1) {
                  if (callback != undefined) {
                     callback(docs)
                  }
               }
               count++;
            });
         }
      });   
   },

   collectConti(dateRange, callback) {
      var docs = [];
//        var start = firebase.firestore.Timestamp.fromDate(this.dateRange[0]);
//        var end = firebase.firestore.Timestamp.fromDate(this.dateRange[1]);

      Firebase.db
      .collection("conti")
      .where('status', "==", -1)
      .orderBy("lastModified", "desc")
      .onSnapshot((querySnapshot) => {            
         var size = querySnapshot.size;
         if (size == 0) {
            if (callback != undefined) {
               callback()
            }
         } else {
            var count = 0;
            querySnapshot.forEach((doc) => {
               var bill = doc.data();
               var conto = new Conto;
               conto.fillData(bill);
               conto.id = doc.id;
               docs.push(conto);
               if (count == size - 1) {
                  if (callback != undefined) {
                     callback(docs)
                  }
               }
               count++;
            });
         }
      });   
   },
   getCategories(callback) {
      var categorie = [];

      Firebase.db.collection("categories")
         .orderBy("code")
         .onSnapshot((querySnapshot) => {
            var size = querySnapshot.size;
            if (size == 0) {
               if (callback != undefined) {
                  callback(categorie)
               }
            } else {
               var count = 0;
               querySnapshot.forEach((doc) => {
               var record = doc.data();
               categorie.push(record);
               if (count == size - 1) {
                  if (callback != undefined) {
                     callback(categorie)
                  }
               }
               count++;
             });
            }
        });
   },
   getVariants() {
      var vars = [];
      Firebase.db.collection('varianti')
      .where("status", "==", 1)
      .onSnapshot(querySnapshot => {
        const documents = querySnapshot.docs;
        for (const doc of documents) {
          var item = doc.data();
          item.id = doc.id;
          vars.push(item);
        }
    
        this.variants = vars;
      })
   },
   applyVariant(record) {
      var variantArray = []
      if(record.variants != undefined) {
        //console.log('getProductList', products[i].name, products[i].variants);
        for(var varindex=0; varindex<record.variants.length; varindex++) {
          var varcode = record.variants[varindex];
          console.log('varcode', varcode);
          for(var j=0; j<this.variants.length; j++) {
            if(this.variants[j].code == varcode) {
              variantArray.push(this.variants[j]);
            }
          }
        }  
      }
      record.variants = variantArray;
      return record;
   },
   getProducts(catId, callback) {
      var prodotti = [];

      var query = Firebase.db.collection("products");
      if(catId == 'favorites') {
         query = query.where("properties.favorite", "==", true);
      } else if(catId != '') {
         query = query.where("category.id", "==", catId);
      }
      query = query.where("status", "==", 1)
      .where("type", "in", [0, 1, 2, 3]);

      query.onSnapshot((querySnapshot) => {
         var size = querySnapshot.size;
         if (size == 0) {
            if (callback != undefined) {
               callback(prodotti)
            }
         } else {
            var count = 0;
            querySnapshot.forEach((doc) => {
               var record = doc.data();
               record.id = doc.id;
               //record = this.applyVariant(record);

               prodotti.push(record);
               // rimosso in quanto asincrono
               //this.loadImageUrl(this.prodotti[this.prodotti.length - 1]);
               if (count == size - 1) {
                  if (callback != undefined) {
                     callback(prodotti)
                     // se la richiesta è per tutti i prodotti ne tengo una copia
                     if(catId == '') this.products = prodotti;
                  }
               }
               count++;
            });
         }
      });
   },
   loadImageUrl: function (index, imgUrl, callback) {
      if (imgUrl.length == 0) return;

      const storage = Firebase.storage.ref();
      var storageRef = storage.child(imgUrl);
      storageRef
        .getDownloadURL()
        .then((url) => {
         if (callback != undefined) {
            callback(url, index)
         }
        })
        .catch((error) => {
         console.log(error)
         if (callback != undefined) {
            callback('', index)
         }
        });
    },
    getAllProducts(callback) {
      var self = this;
      this.catalog = [];

      Firebase.db.collection("products")
      .where("status", "==", 1)
      .where("type", "in", [0, 1, 2, 3])
      .onSnapshot((querySnapshot) => {
         var size = querySnapshot.size;
         if (size == 0) {
            if (callback != undefined) {
               callback(this.catalog)
            }
         } else {
            var count = 0;
            querySnapshot.forEach((doc) => {
               var record = doc.data();
               record.id = doc.id;
               //if(record.imgUrl == undefined) record.imgUrl = '';
               self.catalog.push(record);
               
               var index = self.catalog.length - 1
               self.loadImageUrl(
                 index,
                 this.catalog[index].properties.imgUrl,
                 function(url, ind) {
                   self.catalog[ind].properties.imgUrl = url;                
                 }
               )

               if (count == size - 1) {
                  if (callback != undefined) {
                     callback(this.catalog);
                  }
               }
               count++;
            });
         }
      });
   }

}

export default repo;