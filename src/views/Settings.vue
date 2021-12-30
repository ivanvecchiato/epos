<template>
  <div>
<el-tabs type="card" @tab-click="handleClick">
    <el-tab-pane :label="$t('config.operators')">
      <operators></operators>
    </el-tab-pane>
    <el-tab-pane label="Config">Config</el-tab-pane>
    <el-tab-pane label="Role">Role</el-tab-pane>
    <el-tab-pane :label="$t('config.demo_data')">
      <el-button @click="generate">genera</el-button>
    </el-tab-pane>
  </el-tabs>
      
  </div>
</template>

<script>
import Order from "../data/Order.js"
import Firebase from "../firebase.js"
import Operators from "./Operators/Operators.vue"

export default {
  name: "Settings",
  components: { Operators },
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
