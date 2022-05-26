<template>
   <div class="wizard">
      <div class="wizard-page">
         <div v-if="ending == false">
            <ul>
               <li v-for="item in currentOptions" :key="item.id" @click="next(item)">
                  {{item.name}}
               </li>
            </ul>
         </div>
         <div v-else>
            <p for="wizardnote">Nota</p>
            <textarea v-model="note" id="wizardnote" rows="4" cols="60" class="text-area"></textarea>
            <div style="margin-top:20px">
               <el-button type="danger" plain big @click="undo()">annulla</el-button>
               <el-button type="success" big @click="insert()">Inserisci</el-button>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   name: 'ProductWizard',
   props: ['prod'],
   data() {
      return {
         step: 1,
         currentOptions: [],
         ending: false,
         steps: 2,
         components: [],
         note: ''
      }
   },
   methods: {
      undo: function() {
         this.$emit('undoWizard');
      },
      insert: function() {
         this.$emit('finalizeWizard', this.components, this.note);
      },
      loadOptions: function() {
         this.options = this.prod.options;
         this.steps = Object.keys(this.options).length;
         this.currentOptions = this.options[this.step]
      },
      next: function(item) {
         this.components.push(item);
         this.step++;
         if(this.step > this.steps) {
            this.ending = true;
         } else {
            this.currentOptions = this.options[this.step];
         }
      }
   },
   mounted() {
      this.loadOptions();
   },
}
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 10px;
  padding: 10px;
  overflow: scroll;
}
ul li {
   margin: 15px;
	padding: .5em;
   font-size: 2em;
   background: var(--light-main-color);
   border-radius: 10px;
   text-align: left;
   color: var(--info2-color);
   font-weight: bold;
}
ul li:last-child {
	border-bottom: 0;
}
</style>