<template>
<div style="padding:20px">
   <el-row :gutter="20">
     <el-col :span="6">
         <input class="form-input" v-model="ipaddress" placeholder="IP">
     </el-col>
     <el-col :span="2">
        <el-button @click="setPrintfIP">{{$t('generic.save')}}</el-button>
     </el-col>
     <el-col :span="2">
        <el-button @click="getPrintfConfig">{{$t('generic.test')}}</el-button>
     </el-col>
   </el-row>

   <div>
      <p>Intestazione</p>
      <ul>
         <li v-for="row, index in headers" :key="index" style="border-bottom: none; margin:5px">
            <span class="index">{{index+1}}</span> <input size=60 class="form-input header" v-model="row.value"/>
         </li>
      </ul>
      <el-button @click="saveHeaders()">Salva</el-button>
   </div>

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
import { ElLoading } from 'element-plus'

export default {
   data() {
      return {
         ipaddress: '',
         VAT: [],
         depts: [],
         tenders: [],
         headers: [],
         MAX_HEADERS: 6
      }
   },
   methods: {
      showPaymentsConfig() {
         
      },
      getHeaders() {
         var headersString = localStorage.getItem("headers");
         this.headers = [];
         if (headersString != null && headersString.length > 0) {
           var rows = JSON.parse(headersString);
           for(var i=0; i<rows.length; i++) {
              this.headers.push(rows[i])
           }
           for(i=rows.length; i<this.MAX_HEADERS; i++) {
              var item = {};
              item.id = i+1;
              item.value = '';
              this.headers.push(item);
           }
         } else {
           for(i=0; i<this.MAX_HEADERS; i++) {
              item = {};
              item.id = i+1;
              item.value = '';
              this.headers.push(item);
           }
         }
      },
      saveHeaders() {
         localStorage.setItem('headers', JSON.stringify(this.headers));
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
               //this.error(resp.error)
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
         var options = {
            text: "attendere, prego...",
            fullscreen: false
         }
         const loadingInstance = ElLoading.service(options);

         printf.getConfig((resp) => {
            this.$nextTick(() => {
               loadingInstance.close()
            })

            if(resp.result == 'ok') {
               console.log('getPrintfConfig', resp);
               var root = resp.data.Service;

               for(var i=0; i<root.Prg[0].Header.length; i++) {
                  if(root.Prg[0].Header[i].txt != undefined && root.Prg[0].Header[i].txt[0].length > 0)
                     self.headers.push(root.Prg[0].txt[i]);
               }

               for(i=0; i<root.Prg[0].VAT.length; i++) {
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
      },
   },
   mounted() {
      this.ipaddress = printf.getIP();
      this.initPrintf();
      this.getHeaders();
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
.index {
   margin-left: 10px;
   margin-right: 10px;
}
.header {
   text-align: center;
}
</style>