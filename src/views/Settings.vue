<template>
  <div>
    <el-button @click="generate">genera</el-button>
  </div>
</template>

<script>
import Order from "../data/Order.js"
import Firebase from "../firebase.js"

export default {
  name: "Settings",
  components: { },
  data() {
    return {
    };
  },
  methods: {
    generate: function() {
      var tablesNum = [50, 20, 15, 10];
      for(var j=0; j<4; j++) {
        var roomObj = {
          id: Number(j+1),
          name: "Area " + (j+1),
          places: []
        };
        for(var i=0; i<tablesNum[j]; i++) {
          var obj = {
            id: Number(i+1),
            name: (i+1),
            places: 2,
            order: Object.assign({},new Order)
          };

          roomObj.places.push(obj);
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
  mounted() {
  },
};
</script>

<style scoped>
</style>
