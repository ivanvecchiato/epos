<template>
   <div>
      <el-button @click="generate">genera</el-button>
      <el-button @click="resetOrders" v-loading.fullscreen.lock="fullscreenLoading">reset conti</el-button>
      <el-button @click="resetStats" v-loading.fullscreen.lock="fullscreenLoading">reset dati</el-button>
   </div>
</template>

<script>
import Conto from "../../data/Conto.js"
import Firebase from "../../firebase.js"
//import utils from "../../utils.js"

export default {
   name: 'Admin',
   data() {
      return {
         fullscreenLoading: false
      }
   },
   methods: {
      resetOrders: function() {
         this.fullscreenLoading = true;

         Firebase.db.collection("park")
         .get()
         .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
               var docId = doc.id;
               var floor = doc.data().places;
               for(var key in floor) {
                  if(floor[key].conto != null && floor[key].conto != {}) {
                     if(floor[key].conto.orderList.length > 0) {
                        var docRef = Firebase.db.collection('park').doc(docId);
                        var place = "places." + key + ".conto";
                        docRef.update({
                           [place]: Object.assign({}, new Conto)
                        })
                        .then(() => {
                          console.log("Document successfully written!");
                        })
                        .catch((error) => {
                          console.error("Error writing document: ", error);
                        });
                     }
                  }
               }
               this.resetPendingOrders();
            });
            this.fullscreenLoading = false;
         })
         .catch((error) => {
             console.log("Error getting documents: ", error);
         });
      },
      resetPendingOrders: function() {
         this.fullscreenLoading = true;

         Firebase.db.collection("ordini")
         .get()
         .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
               var docId = doc.id;
               Firebase.db.collection('ordini')
                  .doc(docId)
                  .delete()
                  .then()
                  .catch();
            });
            this.fullscreenLoading = false;
         })
         .catch((error) => {
             console.log("Error getting documents: ", error);
         });
      },
      resetStats: function() {
         this.fullscreenLoading = true;

         Firebase.db.collection("conti")
         .get()
         .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
               var docId = doc.id;
               Firebase.db.collection('conti').doc(docId).delete().then().catch();
            });
            this.fullscreenLoading = false;
         })
         .catch((error) => {
             console.log("Error getting documents: ", error);
         });
      },
      randomColor() {
         let h = ~~(360 * Math.random());
         let s = 70;
         let l = 80;

         l /= 100;
         const a = s * Math.min(l, 1 - l) / 100;
         const f = n => {
           const k = (n + h / 30) % 12;
           const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
           return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
         };
         return `#${f(0)}${f(8)}${f(4)}`;
      },
      generate: function() {
        var tablesNum = [50, 20, 15, 0];
        for(var j=0; j<3; j++) {
          var roomObj = {
            id: Number(j+1),
            name: "Area " + (j+1),
            order: Number(j+1),
            color: this.randomColor(),
            places: {}
          };
          for(var i=0; i<tablesNum[j]; i++) {
            var obj = {
              name: (i+1).toString(),
              seats: 2,
//              conto: Object.assign({},new Conto)
              conto: null
            };
            var key = Number(i+1);
            roomObj.places[key] = (obj);
          }
          Firebase.db.collection('park').add(roomObj)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
        }

        // self remote order
         roomObj = {
           id: Number(4),
           name: "Self",
           order: 100,
           color: this.randomColor(),
           places: {}
         };
         Firebase.db.collection('park').add(roomObj)
         .then((docRef) => {
           console.log("Document written with ID: ", docRef.id)
         })
         .catch((error) => {
           console.error("Error adding document: ", error)
         })
      }
   },
}
</script>

<style scoped>

</style>