<template>
  <div class="park">
    <div v-if="loaded">
      <div class="areas-toolbar">
        <div class="area-buttons">
          <el-button
            type="info"
            round
            v-for="area in park"
            :key="area.id"
            class="button-idle"
            @click="selectArea(area)">
            {{ area.name }}
          </el-button>

          <el-button
            round
            class="button-new"
            @click="addArea">
            {{$t('floor.new_area')}}
          </el-button>
        </div>
      </div>

      <div style="margin-left: 10px;">
        <el-row :gutter="20">
          <el-col :span="2"> Nome </el-col>
          <el-col :span="2"> posti </el-col>
        </el-row>
      </div>
      <ul>
        <li v-for="place in currentPlan.places" :key="place.id">
          <accounts-config-item
            :data="place">
          </accounts-config-item>
        </li>
      </ul> 
    </div>

    <accounts-config-item
      @deletePlace="deletePlace"
      v-if="editingNew">
    </accounts-config-item>
    <el-button size="small" type="primary" plain @click="newPlace">+ Aggiungi</el-button>
  </div>
</template>

<script>
import Firebase from "../../firebase.js";
import AccountsConfigItem from "./AccountsConfigItem.vue";

export default {
  name: 'AccountsConfig',
  data() {
    return {
      park: [],
      currentPlan: null,
      loaded: false,
      editingNew: false,
    }
  },
  components: { AccountsConfigItem },
  methods: {
    addArea() {

    },
    loadPark() {
      Firebase.db
        .collection("park")
        .orderBy("order")
        .onSnapshot((snapshotChange) => {
          this.park = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            record.docId = doc.id;
            this.park.push(record);
          });
          this.currentPlan = this.park[0];
          this.loaded = true;
        });
    },
    selectArea(area) {
      this.currentPlan = area;
    },
    saveArea(area) {
      if (area.id == 0) {
        Firebase.db
          .collection("park")
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
          printerAddress: area.printerAddress,
        });
      }
    },
    newPlace() {
      this.editingNew = true;
    },
  },
  mounted() {
    this.loadPark();
  },
};
</script>

<style scoped>
.park {
  text-align: left;
}
ul {
  list-style-type: none;
  list-style: none;
  padding: 0;
}
ul li {
  margin: 10px;
  text-align: left;
}
.area-buttons {
  display: flex;
  flex: 1;
  overflow-x: auto;
  padding-top: 10px;
  padding-left: 10px;
  flex-flow: row nowrap;
  align-items: center;
}
.area-buttons::-webkit-scrollbar {
  display: none;
}
.button-idle {
  min-width: 150px;
  background-color: var(--tertiary-color);
  color: var(--primary-color);
  font-weight: bold;
  font-size: 1.2em;
  border: 0px solid var(--primary-color);
}
</style>