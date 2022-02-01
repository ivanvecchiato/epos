<template>
   <div>
      <qr-code
      text="https://goo.gl/9eIWP9"
      size="160"></qr-code>
      <el-button @click="generate">genera</el-button>
      <el-button @click="resetOrders" v-loading.fullscreen.lock="fullscreenLoading">reset conti</el-button>
      <el-button @click="resetStats" v-loading.fullscreen.lock="fullscreenLoading">reset dati</el-button>
   </div>
</template>

<script>
import Order from "../../data/Conto.js"
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
                  //console.log('resetOrders', utils.toDate(floor[key].order.createdAt));
                  if(floor[key].order.orderList.length > 0) {
                     var docRef = Firebase.db.collection('park').doc(docId);
                     var place = "places." + key + ".order";
                     docRef.update({
                        [place]: Object.assign({}, new Order)
                     })
                     .then(() => {
                       console.log("Document successfully written!");
                     })
                     .catch((error) => {
                       console.error("Error writing document: ", error);
                     });
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
      generate: function() {
        var tablesNum = [50, 20, 15, 10];
        for(var j=0; j<4; j++) {
          var roomObj = {
            id: Number(j+1),
            name: "Area " + (j+1),
            places: {}
          };
          for(var i=0; i<tablesNum[j]; i++) {
            var obj = {
              id: Number(i+1),
              name: (i+1),
              places: 2,
              order: Object.assign({},new Order)
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
      }
   },
}
</script>

<style scoped>

</style>