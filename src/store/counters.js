var counters = {
   progressivoScontrino: 1,
   progressivoProforma: 1,
   numeroChiusura: 1,

   load() {
      var data = JSON.parse(localStorage.getItem('counters'));
      this.progressivoScontrino = data.progressivoScontrino;
      this.progressivoProforma = data.progressivoProforma;
      this.numeroChiusura = data.numeroChiusura;
   },

   getProgressivoScontrino(increment) {
      var p = this.progressivoScontrino;
      if(increment == true) {
         this.progressivoScontrino++;
      }
      return p;
   },

   getZNum() {
      return this.numeroChiusura;
   },

   incrementZnum() {
      this.numeroChiusura++;
   }

};

export default counters;