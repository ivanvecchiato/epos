<template>
   <div>
      <el-row>
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
        <header>
          <div class="info-conto-2" v-if="billLoaded == true">
            <el-icon style="vertical-align: middle;" :color="getAttentionColor" size="14">
              <edit />
            </el-icon>
            <span style="vertical-align: middle;">{{billStart()}}</span>
          </div>
          <div class="bottom-header">
            <div class="note">
              <el-icon :size="24" v-on:click.stop :color="getNoteColor" @click="setNote">
                <edit />
              </el-icon>
            </div>
          </div>
        </header>

        <main ref='cart'>
            <div>
              <shopping-cart
                :orderList="groupedList"
                @changeCart="changeCart"
                @deleteItem="removeItem">
              </shopping-cart>
            </div>
        </main>

        <footer>
          <div class="flat-card">

          <div class="subtotale-section">
            <span class="subtotale-label">
              {{$t('bill.subtotal')}}
            </span>
            <span class="subtotale-amount">
              {{subtotale}}
            </span>
          </div>

          <div class="sconto-section" @click="openDiscount">
            <div class="sconto-label">
            <span>
              <el-icon style="vertical-align: middle;">
                <edit />
              </el-icon>
              {{$t('bill.discount')}}
            </span>
            <span v-if="conto.discount.value>0" style="margin-left: 10px">
              {{conto.discount.rate}}%
            </span>
            </div>
            <span class="sconto-amount">
              {{formatAmount(conto.discount.value)}}
            </span>
          </div>

          <div class="totale-section">
            <span class="totale-label">
              {{$t('bill.total')}}
            </span>
            <span class="totale-amount">
              {{totale}}
            </span>
          </div>
          </div>

          <div class="flat-card">
            <div class="buttons">
              <el-button
                type="danger"
                plain
                class="annulla"
                @click="annullaConto">
                {{ $t("bill.clear") }}
              </el-button>
              <el-button
                type="primary"
                class="block"
                plain
                @click="parcheggiaConto">
                {{ $t("bill.save") }}
              </el-button>
            </div>
            <div class="buttons" style="margin-top: 10px">
              <el-button
                type="success"
                class="block bold"
                @click="pagaConto">
                {{ $t("bill.cash") }}
              </el-button>
            </div>
          </div>
        </footer>
      </div>
        </el-col>
      </el-row>

   </div>
</template>

<script>
import docs from '../../data/Documents.js'
import ECRKeypad from '@/components/ECRKeypad.vue'
import Conto from "../../data/Conto.js";
import ShoppingCart from "../../components/ShoppingCart.vue";
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
   components: {ECRKeypad, ShoppingCart},
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
      this.conto = this.data;
      console.log('PaymentDialog', this.conto);
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
   font-family: "Montserrat-Bold", sans-serif;
}
.doc-selector li:active {
   color: var(--success-color);
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