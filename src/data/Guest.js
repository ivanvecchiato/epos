export default class Guest {
   customer_id = 0;
   checkin_date = "2023-08-01";
   checkout_date = "2023-08-08";
   firstname = "Johann-peter";
   lastname = "Ziegler";
   sex = 'M';
   fiscal_code = "";
   vat_number = "";
   email = [""];
   phone = [""];
   address = "";
   zip = "";
   city = "";
   prov = "";
   state = "Germania";
   lang_code = "de";
   document = {
      type: 1,
      desc: "Carta d'Identità",
      id: "ABCD1234",
      released: '',
      expiry: '',
      issued_by: ''
   };
   birth_date = "1961-05-12";
   birth_state = "Germania";
   birth_place = "";
   birth_district = ""
}
