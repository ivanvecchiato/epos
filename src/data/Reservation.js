import Guest from "./Guest";

export default class Reservation {
   id = '';
   datetime = '';
   modifications = [];
   origin = 0;    // TBD
   status = 0;    // TBD
   checkin = '';
   checkout = '';
   board = 'BB';
   pax = 2;
   room = {
      id: '',
      name: ''
   };
   pricelist = 'standard';
   price_per_room = 0;
   price_per_day = [
      /*{
      day: 1,
      date: '01/01/1970',
      price_per_room: 0,
      adults: [
         {
            board: 'BB',
            price: 0,
            discount: 0
         }
      ],
      kids: [
         {
            board: 'BB',
            price: 0,
            discount: 0,
            fixed_price: 0,
            age: 1
         }
      ]
   }*/];
   deposits = [
      /*{
         "amount": 550,
         "payment_mode": "Carta di Credito",
         "payment_date": "2023-06-26",
         "invoice_progressive": 984,
       }*/
   ];
   notes = [''];
   housekeeping = [''];
   guests = [];   //Guest array
   accountholder = new Guest;
   extra = {
      services: [],
      bar: [],
      restaurant: [],
      hotel: []
   }

   constructor() {
     this.id = '';
   }
}