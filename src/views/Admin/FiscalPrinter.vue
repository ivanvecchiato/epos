<template>
<div style="padding:20px">
   <el-row :gutter="20">
     <el-col :span="6">
         <el-input v-model="ipaddress" placeholder="IP"></el-input>
     </el-col>
     <el-col :span="2">
        <el-button @click="setPrintfIP">{{$t('generic.save')}}</el-button>
     </el-col>
     <el-col :span="2">
        <el-button @click="getPrintfConfig">{{$t('generic.test')}}</el-button>
     </el-col>
   </el-row>

   <div>
      <p>IVA</p>
      <ul>
         <li v-for="item, index in VAT" :key="index">
            {{item.$.id}} - {{item.value[0]}}
         </li>
      </ul>
   </div>

   <div>
      <p>REPARTI</p>
      <ul>
         <li v-for="item, index in depts" :key="index">
            {{item.$.id}} - {{item.txt[0]}} - {{item.vatCode[0].value[0]}}
         </li>
      </ul>
   </div>

   <div>
      <p>PAGAMENTI</p>
      <ul>
         <li v-for="item, index in tenders" :key="index">
            {{item.$.id}} -  {{item.txt[0]}}
         </li>
      </ul>
   </div>

   <!--
  <el-container>
    <el-aside width="200px">
       <ul>
          <li>
             <el-button type="text" @click="showPaymentsConfig()">{{$t('config.payments')}}</el-button>
          </li>
       </ul>
    </el-aside>
    <el-main>Main</el-main>
  </el-container>
  -->
</div>
</template>

<script>
import printf from "../../fiscalprinter/printf.js";

export default {
   data() {
      return {
         ipaddress: '',
         VAT: [],
         depts: [],
         tenders: []
      }
   },
   methods: {
      showPaymentsConfig() {
         
      },
      initPrintf() {
         printf.getStatus((resp) => {
            if(resp.result == 'ok') {
               var data = resp.data;
               console.log('testPrintf', data)
               if(data.Service.ECRStatus.mode == 'R') {
                  printf.setKey('REG');
               }
            } else {
               this.error(resp.error)
            }
         });
      },
      error(err) {
         alert(err);
      },
      setPrintfIP() {
         printf.setIP(this.ipaddress);
      },
      isValid(vatCode) {
         for(var i=0; i<this.VAT.length; i++) {
            if(vatCode == this.VAT[i].$.id) return true;
         }
         return false;
      },
      getPrintfConfig() {
         var self = this;
         printf.getConfig((resp) => {
            if(resp.result == 'ok') {
               console.log('getPrintfConfig', resp);
               var root = resp.data.Service
               for(var i=0; i<root.Prg[0].VAT.length; i++) {
                  if(root.Prg[0].VAT[i].value != undefined && Number(root.Prg[0].VAT[i].value[0]) > 0)
                     self.VAT.push(root.Prg[0].VAT[i]);
               }

               for(i=0; i<root.Prg[0].Department.length; i++) {
                  if(Number(root.Prg[0].Department[i].vatCode[0].value[0]) > 0 &&
                     this.isValid(root.Prg[0].Department[i].vatCode[0].value[0]))
                     self.depts.push(root.Prg[0].Department[i]);
               }

               for(i=0; i<root.Prg[0].Payment.length; i++) {
                  self.tenders.push(root.Prg[0].Payment[i]);
               }
            }
         });
      }
   },
   mounted() {
      this.ipaddress = printf.getIP();
      this.initPrintf();
   },
}
</script>

<style scoped>
ul {
  list-style-type: none;
	list-style: none;
	padding: 0;
	width: 100%;
}
ul li {
   margin: 15px;
	padding: .5em 0;
	border-bottom: 1px solid #CCC;
   text-align: left;
}
ul li:last-child {
	border-bottom: 0;
}

</style>