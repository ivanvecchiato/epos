<template>
   <div>
      <el-button @click="generate">genera</el-button>
      <el-button @click="resetConti" v-loading.fullscreen.lock="fullscreenLoading">reset conti</el-button>
      <el-button @click="resetStats" v-loading.fullscreen.lock="fullscreenLoading">reset dati</el-button>
   </div>
</template>

<script>
import Firebase from "../../firebase.js"
//import utils from "../../utils.js"
import PouchDB from 'pouchdb'
import repo from '@/db/repo.js'

export default {
   name: 'Admin',
   data() {
      return {
         db: null,
         fullscreenLoading: false
      }
   },
   methods: {
      resetConti: function() {
         var self = this;
         this.fullscreenLoading = true;

         repo.resetConti(
            function() {
               repo.resetOrdini();
               repo.resetParkReferences();
               self.fullscreenLoading = false;
            }
         );
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
            _id: "area_" + Number(j+1),
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
              contoId: ''
            };
            var key = Number(i+1);
            roomObj.places[key] = (obj);
          }
          repo.addDoc(
            'park',
            roomObj,
            function(response) {
               console.log('addDoc', response.id);
            }
          )
          /*
          this.db.put(roomObj);
          ----
          Firebase.db.collection('park').add(roomObj)
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
          */
        }

        /* self remote order
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
         */
      }
   },
   mounted() {
      this.db = new PouchDB('http://localhost:5984/tables');
      this.db.info().then(function (info) {
         console.log(info);
      })
   },
}
</script>

<style scoped>

</style>