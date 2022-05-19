<template>
   <div class="note-form">
      <label class="form-label" for="title">title</label>
      <input id="title" class="form-input" size="40" v-model="title"/>
      <label class="form-label" for="body">title</label>
      <textarea id="body" class="text-area" cols="40" rows="5" v-model="body"/>
      <el-divider></el-divider>
      <el-button type="success" block plain @click="saveNote()">{{$t('generic.save')}}</el-button>
   </div>   
</template>

<script>
import Firebase from "@/firebase.js";

export default {
   name: 'Note',
   props: ['nota'],
   data() {
      return {
         title: '',
         body: ''
      }
   },
   methods: {
      saveNote: function() {
         var nota = {
            title: this.title,
            body: this.body
         };
         Firebase.db.collection('notes').add(Object.assign({}, nota))
         .then((docRef) => {
           console.log("Document written with ID: ", docRef.id);
         })
         .catch((error) => {
           console.error("Error adding document: ", error)
         })
      }
   },
   mounted() {
      
   },
}
</script>

<style scoped>
.note-form {
   display:flex;
   flex-direction:column;
}
</style>