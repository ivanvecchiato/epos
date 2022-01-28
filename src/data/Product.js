var faker = require('faker');
import utils from '../utils';
export default class Product {
  constructor() {
    this.id = '';
    this.code = 0;
    this.category = {id: 0, name: 'none' };
    this.name = '';
    this.description = '';
    this.price = 0.0;
    this.cost = 0.0;    // prezzo di acquisto
    this.type = 0;    // 0: normal; 1: bundle; 2: measure; 3:to complete ; -1: variant; -2: ingrediente
    this.vat = { vatIndex: 1, vatRate: 10.00 };
    this.measure = 'unit';    // 'unit', 'g', 'm', 'l'
    this.price_to_be_confirmed = false;   // per i prezzi a zero da sistemare all'emissione del conto
    this.add_note = false;
    this.add_variant = false;
    this.barcodes = [];   // String array
    this.takeaway = false;
    this.remote_order = false;
    this.inventory = {
      enabled: false,
      availability: 0,
      alarm: 0
    },
    this.productionAreas = [];
    this.imgUrl = '';
    this.status = 1;  // 1=active, 0=inactive; -1 deleted
    this.color = "#FFFFFF";
  }

  randomize() {
    faker.locale = "it";
    this.name = faker.commerce.productName();
    this.id = faker.datatype.uuid();
    this.code = faker.datatype.number();
    this.add_note = (utils.getRandomInt(1, 4) > 1) ? true:false;
    this.add_variant = (utils.getRandomInt(1, 4) > 1) ? true:false;
    this.price = faker.commerce.price();
    this.imgUrl = faker.image.food();
    this.type = utils.getRandomInt(1, 4);
  }
}
