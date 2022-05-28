<template>
   <div class="wizard">
      <span class="product">{{prod.name}}</span>
      <span class="product-price">{{calculatedPrice}}</span>
      <div class="summary">
         <ul>
            <li v-for="item in components" :key="item.id">
               <el-tag>{{item.name}}</el-tag>
            </li>
         </ul>
      </div>
      <div class="wizard-page">
         <div v-if="ending == false">
            <ul>
               <li v-for="item in currentOptions" :key="item.id" @click="next(item)" :style="getColor(step)">
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
      <el-steps :active="step" align-center style="margin-top: 20px">
         <el-step v-for="step in steps+1" :key="step" :title="stepDescription"/>
      </el-steps>
   </div>
</template>

<script>
import colors from '@/colors.js'
import utils from '@/utils.js'

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
   computed: {
      stepDescription: function() {
         return "Step " + this.step;
      },
      calculatedPrice: function() {
         var p = this.prod.price;
         for(var i=0; i<this.components.length; i++) {
            p += Number(this.components[i].delta_price);
         }
         return utils.formatPrice(p);
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
      },
      getColor(step) {
         return "background-color: " + colors[step-1].code;
      }
   },
   mounted() {
      this.loadOptions();
   },
}
</script>

<style scoped>
.product {
   font-size: 1.5em;
   font-weight: 900;
}
.product-price {
   font-size: 1.5em;
   margin-left: 20px;
   font-weight: 900;
   color: var(--secondary-color);
}
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
   border-radius: 10px;
   text-align: left;
   color: var(--info2-color);
   font-weight: bold;
}
ul li:last-child {
	border-bottom: 0;
}
.summary {
}
.summary ul {
   margin: 0px;
   padding: 0px;
}
.summary ul li {
   float: left;
}
</style>