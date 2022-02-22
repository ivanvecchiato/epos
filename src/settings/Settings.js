import defaultSettings from "@/data/settings.js"

export default class Settings {

   constructor() {
      this.conf = JSON.parse(localStorage.getItem('settings'));
   }

   getSettingValue(option) {
      if(option in this.conf) {
         return this.conf[option].value.value;
      } else {
         return defaultSettings[option].value.value;
      }
   }
}
