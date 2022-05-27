var counters = {
   progressivoScontrino: 1,
   progressivoProforma: 1,
   progressivoComanda: 1,
   progressivoTicket: 1,
   numeroChiusura: 1,

   load() {
      var data = JSON.parse(localStorage.getItem('counters'));
      if(data != null) {
         this.progressivoScontrino = data.progressivoScontrino;
         this.progressivoProforma = data.progressivoProforma;
         this.numeroChiusura = data.numeroChiusura;   
      }
   },

   resetProgressivi() {
      this.progressivoScontrino = 1;
      this.progressivoProforma = 1;
      this.progressivoComanda = 1;
      this.progressivoTicket = 1;
   },

   getProgressivoScontrino(increment) {
      var p = this.progressivoScontrino;
      if(increment == true) {
         this.incrementProgressivoScontrino();
      }
      return p;
   },

   getZNum() {
      return this.numeroChiusura;
   },

   incrementProgressivoScontrino() {
      this.progressivoScontrino++;
      this.save();
   },

   incrementZnum() {
      this.numeroChiusura++;
      this.save();
   },

   save() {
      localStorage.setItem('counters', JSON.stringify(this))
   }
};

export default counters;