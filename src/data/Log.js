import Firebase from "../firebase.js";
import user from "../store/user.js"

export default class Log {
  static EVENT_MODIFY_BOOKING = 101;
  static EVENT_NEW_BOOKING = 102;
  static EVENT_LOGIN = 201;
  static EVENT_LOGOUT = 202;

  constructor(event, bookingId) {
    this.time = new Date(),
    this.operator = {
      id: user.getId(),
      name: user.getName()
    },
    this.event = event,
    this.bookingId = bookingId     // se applicabile
  }

  writeLog() {
    Firebase.db.collection("logs").add(Object.assign({}, this))
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  }

  getType() {
    return this.event.type;
  }

  static isLoggable(type) {
    if(type == this.EVENT_MODIFY_BOOKING || type == this.EVENT_NEW_BOOKING)
      return true;
    return false;
  }

  isLoggable() {
    if(this.type == this.EVENT_MODIFY_BOOKING || this.type == this.EVENT_NEW_BOOKING)
      return true;
    return false;
  }
}