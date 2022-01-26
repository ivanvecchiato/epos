<template>
   <div class="produzione">
    <el-row :gutter="20">
      <el-col :span="4">
         Nome
      </el-col>
      <el-col :span="4">
        IP stampante
      </el-col>
    </el-row>
      <ul>
         <li v-for="area in aree" :key="area.id">
            <parametri-area
               :data="area"
               @saveArea="saveArea"
               @deleteArea="deleteArea"></parametri-area>
         </li>
      </ul>
      <parametri-area
         @saveArea="saveArea"
         @deleteArea="deleteArea"
         v-if="editingNew">
      </parametri-area>
      <el-button size="small" type="primary" plain @click="newArea">+ Aggiungi</el-button>

   </div>
</template>

<script>
import Firebase from "../../firebase.js";
import ParametriArea from "./ParametriArea.vue"

export default {
   data() {
      return {
         aree: [],
         editingNew: false
      }
   },
   components: {ParametriArea},
   methods: {
      loadAreas() {
         Firebase.db
           .collection("aree")
           .orderBy("id")
           .onSnapshot((snapshotChange) => {
             this.aree = [];
             snapshotChange.forEach((doc) => {
               var record = doc.data();
               record.id = doc.id;
               this.aree.push(record);
             });
            });
      },
      saveArea(area) {
         if(area.id == 0) {
            Firebase.db.collection('aree')
               .add(Object.assign({}, area))
               .then((docRef) => {
                  console.log("Document written with ID: ", docRef.id);
                  this.editingNew = false;
               })
               .catch((error) => {
                  console.error("Error adding document: ", error);
               });
         } else {
            var ref = Firebase.db.collection("aree").doc(area.id);
            ref.update({
               name: area.name,
               printerAddress: area.printerAddress
            })
         }
      },
      newArea() {
         this.editingNew = true;
      }
   },
   mounted() {
      this.loadAreas();
   },
}
</script>

<style scoped>
.produzione {
   text-align: left;
}
ul {
  list-style-type: none;
	list-style: none;
	padding: 0;
}
ul li {
   margin: 10px;
	border-left: 4px solid rgb(216, 43, 43);
   text-align: left;
}
</style>