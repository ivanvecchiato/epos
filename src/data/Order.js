import Firebase from "../firebase.js";
import Payment from "./Payment";

export default class Order {
  constructor() {
    this.id = '';
    this.docId = 0;
    this.operator = {
      id: 0,
      name: ''
    };
    this.orderList = [];
    this.place = '';
    this.note = '';
    this.createdAt = new Date();
    this.lastModified = new Date();
    this.done = false;
    this.id_order = Date.now();
    this.modifiers = [];
    this.payments = [];   // Payment obj
    this.totale = 0;
    this.discount = {
      type: 0,
      rate: 0,
      value: 0
    };
    this.status = 0;    // 0=open, 1=closed, -100=deleted, 100=prebill
    this.chiusura = 0;
    this.source = 0;    //0=frontend, 1000 = takeaway, 2000 = ecommerce, n=tavolo
    this.customer = null;   // class Customer TBD
  }

  getTotale() {
    var amount = 0;
    this.orderList.forEach(item => {
      amount += Number(item.price)/* * item.quantity*/;
    });
    
    this.totale = amount;
    return amount;
  }

  getTotaleNetto() {
    var amount = 0;
    this.orderList.forEach(item => {
      amount += item.price * item.quantity;
    });
    
    this.totale = amount;
    return amount - this.discount.value;
  }

  setDiscount(d) {
    this.discount = d;
    this.saveCache();
  }

  size() {
    if(this.orderList === undefined)
      return 0;
    return this.orderList.length;
  }

  getQuantity() {
    return this.size();
    /*
    var q=0;
    for(var i=0; i<this.size(); i++) {
      q+=this.orderList[i].quantity;
    }
    return q;
    */
  }

  addPayment(index, description, amount) {
    this.payments.push(Object.assign({}, new Payment(index, description, amount)));
  }

  addCustomer(customer) {
    this.customer = (Object.assign({}, customer));
  }

  clear() {
    this.orderList = [];
    this.clearDiscount();
    this.clearPayments();
    localStorage.removeItem('cart');
  }

  clearDiscount() {
    this.discount = {
      type: 0,
      rate: 0,
      value: 0
    }
  }

  clearPayments() {
    this.payments = []
  }

  removeItem(index) {
    this.orderList.splice(index, 1);
    this.saveCache();
  }

  incrementItem(index) {
    this.orderList[index].quantity++;
    this.saveCache();
  }

  decrementItem(index) {
    if(this.orderList[index].quantity == 1)
      this.removeItem(index);
    else
      this.orderList[index].quantity--;
    
    this.saveCache();
  }

  addItem(p) {
    this.orderList.push(Object.assign({}, p));
    this.saveCache();
  }

  groupItem(p, list) {
    var inserted = false;
    for(var i=0; i<list.length; i++) {
      var item = list[i];
      if(item.id === p.id) {
        item.quantity++;
        inserted = true;
        break;
      }
    }
    if(!inserted) {
      p.quantity = 1;
      list.push(Object.assign({}, p));
    }
  }

  groupByItems() {
    var list = [];
    for(var i=0; i<this.size(); i++) {
      var item = this.orderList[i];
      this.groupItem(item, list)
    }

    return list;
  }

  groupByTimestamp() {
    var lists = [];
    var prevTimestamp = 0;
    for(var i=0; i<this.size(); i++) {
      var item = this.orderList[i];
      if(prevTimestamp < item.insertTime) {
        prevTimestamp = item.insertTime;
        lists.push({
          timestamp: prevTimestamp,
          list: []
        });
      }
      this.groupItem(item, lists[lists.length-1].list)
    }

    return lists;
  }

  saveCache() {
    localStorage.setItem('cart', JSON.stringify(this));
  }

  setClosed(status) {
    this.lastModified = new Date();
    this.status = status;
    this.totale = this.getTotale();

    this.writeDoc();
  }

  setTimestamp() {
    var tempo = new Date().getTime();
    this.orderList.forEach(item => {
      if(item.insertTime == undefined) {
        item.insertTime = tempo;
      }
    });
  }

  update() {
    this.setTimestamp();
    this.getTotale();
    this.saveCache();
  }

  writeDoc() {
    if(this.id == '') {
      console.log('writeDoc', Object.assign({}, this));
      Firebase.db.collection('conti').add(Object.assign({}, this))
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
    } else {
      Firebase.db.collection('conti').doc(this.id).set(Object.assign({}, this), { merge: true })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    }
  }

  fillData(data) {
    var keys = Object.keys(this);
    keys.forEach(element => {
        this[element] = data[element];
    });
  }
}
