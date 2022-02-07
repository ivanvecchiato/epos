
import xml from "./xml.js";
import axios from 'axios';

const clearCmd = "=K";
//const sellCmd = "=R";

export default {
   address: 'http://192.168.1.9:80',

   async sendCommand(cmdBuffer) {
      console.log('sendCommand', cmdBuffer)
      let responseData = '';
      try{
         let response =  await axios.post(this.address+'/service.cgi', cmdBuffer)
         responseData = response.data;
      } catch(error) {
         console.log(error);
      }
      return responseData
   },
   processResponse(response) {
      console.log(response);
   },
   clear() {
      this.sendCommand(xml.buildCmd(clearCmd));
   },
   document(items, payments,customer){
      console.log("PRINTF", items, payments,customer);
      var rows = this.sellCmds(items);
      var payRows = this.paymentRows(payments);

      var buffer = xml.getCommands(rows.concat(payRows), true);
      this.sendCommand(buffer);
   },
   sellCmds(items) {
      var rows = [];
      for(var i=0; i<items.length; i++) {
         var item = items[i];
         rows.push("=R" + item.category.code + "/" +
            "$" + (Number(item.price) * 100) +
            "/" + "(" + item.name + ")");
      }
      return rows;
   },
   paymentRows(payments) {
      var lines = [];
      if(payments.length == 0) {
         lines.push("=T");
      } else {
         for(var i=0; i<payments.length; i++) {
            lines.push("=T1");
         }
      }
      return lines;
   }
};