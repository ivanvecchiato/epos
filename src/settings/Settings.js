export default class Settings {

   constructor() {
      this.conf = JSON.parse(localStorage.getItem('settings'));
   }

   getSettingValue(option) {
      return this.conf[option].value.value;
   }
}
