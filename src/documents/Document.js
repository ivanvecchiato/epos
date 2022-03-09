import Settings from "@/settings/Settings.js";
import tags from "./tags";
import i18n from "../i18n"
const { t } = i18n.global;

export default class Document {
   conf = new Settings;
   documentRows = [];
   width = 48;

   constructor() {

   }

   // eslint-disable-next-line no-unused-vars
   preconto(items, amount, callback) {
      var printHeader = this.conf.getSettingValue('printHeaderOnPrebill');
      if (printHeader) {
         this.addIntestazioneScontrino();
         this.addBlankLine();
      }
      this.sellRows(items);
      this.addBlankLine();
      // totale
      this.addAmountRow(amount);
   }

   comanda(time, place, operator, orderToBePrinted) {
      console.log('orderToBePrinted', orderToBePrinted)
      var printNote = this.conf.getSettingValue('printNoteOnBill');
      var pricesOnOrder = this.conf.getSettingValue('printPricesOnOrder');

      this.addLine('COMANDA ' + time, [tags.FORMAT_NORMAL]);
      this.addLine(place, [tags.FORMAT_DOUBLE_H]);
      this.addBlankLine();

      var tot = 0;
      for (var i = 0; i < orderToBePrinted.length; i++) {
         var item = orderToBePrinted[i];
         var left = '';
         var right = '';
         let formats = [];
         formats.push(tags.FORMAT_DOUBLE_H);
         if (item.status != -100) {
            left += item.quantity + " x " + item.name;
            right = Number(item.price).toFixed(2);
            tot += Number(item.quantity) * Number(item.price);
            var line = '';
            if(pricesOnOrder) {
               line = this.leftRight(left, right);
            } else {
               line = left;
            }
            this.addLine(line, formats);

            // NOTA
            if (printNote && item.note != undefined && item.note != null) {
               if (item.note.length > 0)
                  this.addLine(' *' + item.note, formats + '*');
            }
         }
      }
      if(pricesOnOrder) {
         left = t("generic.total").toUpperCase();
         right = Number(tot).toFixed(2);
         this.addLine(this.leftRight(left, right));
      }
      this.addSeparatorLine();
      this.addLine(operator, [tags.FORMAT_NORMAL]);
   }

   addAmountRow(amount) {
      var left = "Totale";
      var right = Number(amount).toFixed(2);
      let formats = [];
      formats.push(tags.FORMAT_DOUBLE_H);
      this.addLine(this.leftRight(left, right), formats);
   }

   addLine(content, format) {
      var obj = {
         row: content
      }
      if (format != undefined) {
         obj['format'] = format
      }
      this.documentRows.push(obj);
   }

   addSeparatorLine() {
      let formats = [];
      formats.push(tags.FORMAT_NORMAL);
      var line = '';
      for(var i=0; i<this.width; i++) {
         line += "-";
      }
      this.addLine(line, formats);
   }

   addBlankLine() {
      let formats = [];
      formats.push(tags.FORMAT_NORMAL);
      this.addLine(' ', formats);
   }

   addIntestazioneScontrino() {
      var intestazione = [];
      intestazione.push(this.center('RIGA 1'));
      intestazione.push(this.center('RIGA 2'));
      intestazione.push(this.center('RIGA 3'));

      for (var i = 0; i < intestazione.length; i++) {
         let formats = [];
         formats.push(tags.FORMAT_DOUBLE_H);
         this.addLine(this.center(intestazione[i]), formats);
      }
   }

   sellRows(items) {
      var printNote = this.conf.getSettingValue('printNoteOnBill');
      for (var i = 0; i < items.length; i++) {
         var item = items[i];
         var left = '';
         var right = '';
         let formats = [];
         formats.push(tags.FORMAT_NORMAL);
         if (item.status != -100) {
            left += item.quantity + " x " + item.name;
            right = Number(item.price).toFixed(2);
            var line = this.leftRight(left, right);
            this.addLine(line, formats);

            // NOTA
            if (printNote && item.note != undefined && item.note != null) {
               if (item.note.length > 0)
                  this.addLine(' *' + item.note, formats + '*');
            }
         }
      }
   }

   leftRight(left, right) {
      var gap = this.width - (left.length + right.length);
      var line = left;
      for (var i = 0; i < gap; i++) {
         line += ' ';
      }
      line += right;
      return line;
   }

   center(content) {
      var line = '';
      var gap = (this.width - content.length) / 2;
      for (var i = 0; i < gap; i++) {
         line += ' ';
      }
      line += content;
      while (line.length < this.width) {
         line += ' ';
      }
      return line;
   }
}