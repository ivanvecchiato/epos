import defaultSettings from "@/data/settings.js"

export default class Settings {
   conf = {}

   constructor() {
      this.conf = JSON.parse(localStorage.getItem('settings'));
   }

   save() {
      localStorage.setItem('settings', JSON.stringify(this.conf))
   }

   setSettingValue(option, value) {
      this.conf[option].value.value = value;
      this.save();
   }

   getSettingValue(option) {
      if(option in this.conf) {
         return this.conf[option].value.value;
      } else {
         return defaultSettings[option].value.value;
      }
   }
}
