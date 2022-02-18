<template>
   <div>
      <el-row :gutter="10">
        <el-col :span="6">
            <div class="doc-types">
               <div class="doc-header">{{$t('docs.document')}}</div>
               <div class="doc-selector">
                  <ul>
                     <li v-for="doc in documenti" :key="doc.id">
                        {{$t(doc.type)}}
                     </li>
                  </ul>
               </div>
            </div>
            <div class="keypad">
               <ECRKeypad></ECRKeypad>
            </div>
        </el-col>

        <el-col :span="6">
           center
        </el-col>
        <el-col :span="6">
           cr
        </el-col>
        <el-col :span="6">
          <div class="side">
            <conto-management
              ref="contoMgmt"
              :currentPlace="currentPlace"
              @annullaConto="annullaConto"
              @reassignedConto="reassignedConto"
              @pagaConto="pagaConto">
            </conto-management>
          </div>
        </el-col>
      </el-row>

   </div>
</template>

<script>
import docs from '../../data/Documents.js'
import ECRKeypad from '@/components/ECRKeypad.vue'
import Conto from "../../data/Conto.js";
import ContoManagement from '../Frontend/ContoManagement.vue';
import utils from "../../utils.js";

export default {
   name: "PaymentDialog",
   props: ['data'],
   data() {
      return {
         conto: new Conto,
         documenti: [],
         pagamenti: [
            {
               id: 1,
               name: 'contanti'
            },
            {
               id: 2,
               name: 'carta di credito'
            },
            {
               id: 3,
               name: 'bancomat'
            },
            {
               id: 4,
               name: 'credito'
            },
         ]
      }
   },
   watch: {
      conto: {
     // eslint-disable-next-line no-unused-vars
         handler(newConto, oldConto) {
            console.log('watch', newConto);
         },
         deep:true
      }
   },
   components: {ECRKeypad, ContoManagement},
   methods: {
      formatAmount: function(amount) {
         return utils.formatPrice(amount);
      },
      getPzs: function() {
         return this.conto.getQuantity();
      },
   },
   mounted() {
      this.documenti = docs.documents;
      this.$bus.on('setConto', (e) => {
         this.conto = e;
         this.$bus.trigger('loadCart', this.conto);
      });
   },
}
</script>

<style scoped>
.doc-types {
   height: 250px;
   border: solid 1.5px var(--primary-color);
   border-radius: 12px;
}
.doc-header {
   width: 100%;
   text-align: center;
   border-bottom: solid 1.5px var(--primary-color);
   border-top-left-radius: 12px;
   border-top-right-radius: 12px;
}
.doc-selector {
   padding: 5px;
   height: 100%;
   overflow: scroll;
   font-weight: bold;
}
.doc-selector li:active {
   color: var(--success-color);
}
.side {
  height: 100%;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  background: #fff;
}
ul {
  list-style-type: none;
	list-style: none;
	padding: 0;
	width: 100%;
}
ul li {
   margin: 5px;
	padding: .5em 0;
	border-bottom: 1px solid #CCC;
   text-align: left;
}
ul li:last-child {
	border-bottom: 0;
}

</style>