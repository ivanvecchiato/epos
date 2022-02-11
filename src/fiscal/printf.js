
import xml from "./xml.js";
import axios from 'axios';
var parseString = require('xml2js').parseString;

//var cfg = require('../data/cfg.json');

const clearCmd = "=K";
const keyCmd = "=C";
const statusCmd = "<</?s";
const getCfgCmd = "<</?C";
//const sellCmd = "=R";

export default {
   address: '192.168.0.9:80',

   setIP(ip) {
      this.address = ip;
      localStorage.setItem('printf', ip);
   },
   getIP() {
      var param = localStorage.getItem('printf');
      if(param != null) {
         this.address = param;
      }
      return this.address;
   },
   sendCommand(cmdBuffer, callback) {
      console.log('sendCommand', cmdBuffer)
      let responseData = '';
      var self = this;

      axios.post('http://' + this.address+'/service.cgi', cmdBuffer)
      .then(function (response) {
         responseData = response.data;
         //console.log(response);
         self.processResponse(responseData, callback)
       })
       .catch(function (error) {
         console.log(error);
       });
   },
   processResponse(response, callback) {
      parseString(response, function (err, result) {
         console.log(result);
         callback(result)
       }); 
   },
   clear() {
      return this.sendCommand(xml.buildCmd(clearCmd));
   },
   getStatus(callback) {
      this.sendCommand(xml.buildCmd(statusCmd), callback);
   },
   getConfig(callback) {
      //callback(cfg);
      this.sendCommand(xml.buildCmd(getCfgCmd), callback);
   },
   setKey(key) {
      var index = 1;
      if(key == 'REG') {
         index = '1';
      } else if(key == 'X') {
         index = '2';
      } else if(key == 'Z') {
         index = '3';
      } else if(key == 'PRG') {
         index = '4';
      } else if(key == 'SRV') {
         index = '5';
      }
      return this.sendCommand(xml.buildCmd(keyCmd+index));
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