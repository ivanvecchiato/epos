
export default class Payment {
  constructor(index, description) {
    this.index = index;
    this.description = description;
    this.cash = true;
    this.credito = false;
    this.non_riscosso = false;
    this.apri_cassetto = false;
    this.bancomat = false;
    this.credit_card = false;
  }
}
