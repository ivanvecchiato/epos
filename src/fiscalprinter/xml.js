const xml_header = '<?xml version="1.0" encoding="UTF-8"?>';
//const xml_service = '<Service>';

export default {
   xml_enquiry: '',
   start() {
      this.xml_enquiry = xml_header;
   },
   service(content) {
      var str = '<Service>';
      str += content;
      str += '</Service>';
      return xml_header + str;
   },
   getCommands(cmds, close) {
      var str = '';
      for(var i=0; i<cmds.length; i++) {
         str += "<cmd>" + cmds[i] + "</cmd>";
      }
      if(close) {
         str += "<cmd>=c</cmd>";
      }
      return this.service(str);
   },
   command(cmd) {
      var command = "<cmd>" + cmd + "</cmd>";
      return this.service(command)
   },
   buildCmd(cmd) {
      return this.command(cmd)
   },
   closeDoc() {
      return "<cmd>=c</cmd>";
   }
}