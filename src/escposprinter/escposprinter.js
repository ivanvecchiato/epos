//import xml from "./xml.js";
import axios from 'axios';
//var parseString = require('xml2js').parseString;
import Settings from "@/settings/Settings.js";

//var cfg = require('../data/cfg.json');

// eslint-disable-next-line no-unused-vars
var conf = new Settings;

const EscposCodes = {
   esc: '\x1B',
   gs: '\x1D',
   'cut': '\x1D\x56\x42\x14',
   'beep': '\x1B\x42\x01\x04',
   'feed': '\x1B\x64\x05',
   'normal': '\x1B\x21\x00',
   'dblH': '\x1B\x21\x18',
}

export default {
   address: '127.0.0.1:8088',

   sendBuffer(api, buffer, callback) {
      console.log('sendBuffer', buffer)
      let responseData = '';
      var self = this;

      axios.post('http://' + this.address + '/' + api, buffer)
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
      console.log(response)
      var res = JSON.parse(response)
      if (callback) callback(res);
   },
   stampa(doc) {
      var buffer = '';
      console.log(doc);
      doc.documentRows.forEach(row => {
         console.log(row);
         if (row.format != undefined) {
            for (var f = 0; f < row.format.length; f++) {
               buffer += EscposCodes[row.format[f]];
            }
         }
         buffer += row.row + "\r\n";
      });

      buffer += EscposCodes['cut'];

      this.sendBuffer(
         'print',
         {"printable": buffer}
      )
   },
   scontrino(doc, callback) {
      var buffer = '';
      console.log(doc);
      doc.documentRows.forEach(row => {
         console.log(row);
         if (row.format != undefined) {
            for (var f = 0; f < row.format.length; f++) {
               buffer += EscposCodes[row.format[f]];
            }
         }
         buffer += row.row + "\r\n";
      });

      buffer += EscposCodes['cut'];

      this.sendBuffer(
         'bill',
         {"printable": buffer},
         callback
      )
   },
   appendCmd(buffer, cmd) {
      for (var i = 0; i < cmd.length; i++) {
         buffer += cmd[i];
      }
   },
   hex2bin(hex) {
      return (parseInt(hex, 16).toString(2));
   }
};