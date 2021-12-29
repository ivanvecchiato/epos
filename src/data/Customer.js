
var faker = require('faker');

export default class Customer {
  constructor() {
    this.id = 0;
    this.firstName = '';
    this.lastName = '';
    this.type = 1;    // 1=privato 2=corporate
    this.address = {
      city: '',
      zip: '',
      address: '',
      state: ''
    };
    this.contact = {
      email: '',
      phone: '',
      other: ''
    }
    this.fidelity = {
      code: '',
      credits: ''
    };
    this.notes = '';
  }

randomize() {
    faker.locale = "it";
    this.firstName = faker.name.firstName();
    this.lastName = faker.name.lastName();
    this.contact.email = faker.internet.email();
    this.contact.phone = faker.phone.phoneNumber();
    this.address.city = faker.address.city();
    this.address.city = faker.address.city();
    this.address.zip = faker.address.zipCode();
    this.address.address = faker.address.streetAddress();
  }
}
