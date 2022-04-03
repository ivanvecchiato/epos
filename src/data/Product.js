export default class Product {
  constructor() {
    this.id = '';
    this.code = 0;
    this.category = {id: 0, name: 'none' };
    this.name = '';
    this.price = 0.0;
    this.cost = 0.0;    // prezzo di acquisto
    this.type = 0,    // 0: normal; 1: bundle; 2: measure; 3:to complete ; -1: variant; -2: ingrediente
    this.properties = {
      short_description: '',
      long_description: '',
      measure: 'unit',    // 'unit', 'g', 'm', 'l'
      price_to_be_confirmed: false,   // per i prezzi a zero da sistemare all'emissione del conto
      add_note: false,
      add_variant: false,
      takeaway: false,
      remote_order: false,
      variable_price: false,
      imgUrl: '',
      color: "#FFFFFF"
    }
    this.vat = { vatIndex: 1, vatRate: 10.00 };
    this.barcodes = [];   // String array
    this.inventory = {
      enabled: false,
      availability: 0,
      alarm: 0
    },
    this.components = [];
    this.productionAreas = [];
    this.status = 1;  // 1=active, 0=inactive; -1 deleted
  }

  fillData(data) {
    var keys = Object.keys(this);
    keys.forEach(element => {
      if(data[element] == undefined) data[element] = '';
      this[element] = data[element];
    });
  }

  subset(prod) {
    let tmp = JSON.stringify(prod, this.replacer);
    return JSON.parse(tmp);
  }

  replacer(key, value) {
    if (key=="barcodes") return undefined;
    else if (key=="properties") return undefined;
    else if (key=="inventory") return undefined;
    else if (key=="long_description") return undefined;
    else if (key=="short_description") return undefined;
    else if (key=="cost") return undefined;
    else return value;
  }
}
