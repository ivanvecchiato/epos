<template>
  <div class="rooms">
    <div class="floors-toolbar">
      <div class="rooms-toolbar">
        <input ref="fileInput" type="file" style="display:none;" @change="readFile" />
        <button
          size="small"
          plain
          v-on:click="this.$refs.fileInput.click();">{{ $t("rooms.import") }}
        </button>
        <input ref="bookingsFileInput" type="file" style="display:none;" @change="readBookingsFile" />
        <button
          size="small"
          plain
          v-on:click="this.$refs.bookingsFileInput.click();">{{ $t("rooms.update_tableau") }}
        </button>
        <button
          size="small"
          plain
          @click="addfloor">{{ $t("rooms.new_floor") }}
        </button>
      </div>
      <div class="floor-buttons">
        <el-button
          type="info"
          round
          v-for="floor in floors"
          :key="floor.id"
          :class="getButtonClass(floor.id)"
          @click="selectFloor(floor)">
          {{ floor.name }}
        </el-button>
      </div>
    </div>
    <div class="grid">
      <div v-if="getPlaces(currentFloor) == 0">
        <img src="@/assets/icons/not_found.png" />
      </div>
      <div
        v-else
        v-for="r in currentFloor.rooms"
        :key="r.id"
        class="room"
        @click="selectRoom(r)">

        <div class="room-name">{{ r.name }}</div>
        <div class="room-guest">{{ getRoomGuest(r) }}</div>
        <div class="room-info">
          <span :class="getRoomBoardStyle(r)">{{ getRoomBoard(r) }}</span>
          <span :class="getRoomCheckoutStyle(r)">{{ getRoomCheckout(r) }}</span>
        </div>
        <div class="moving-warning" v-if="isMoving(r)">
          <div>
            <Right style="width: 2em; height: 2em" />
          </div>
          <div>
            {{ $t("modification.move_explain") }}
          </div>
          <button class="danger" @click.stop="undoMove">
            {{ $t("generic.cancel") }}
          </button>
        </div>
        <div v-else class="inner-room">
          <div v-if="roomBusy(r)">
            <div class="room-last-modification">
              <el-icon style="vertical-align: middle" color="#F9A825" :size="18"><clock/></el-icon>
              {{ getLastMod(r) }}
            </div>
            <div class="room-order-amount">
              <el-icon style="vertical-align: middle" color="#FF5621" :size="18">
                <coin />
              </el-icon>
              {{ getAmount(r) }}
            </div>
            <div class="room-order-quantity">
              <el-icon style="vertical-align: middle" color="#102A68" :size="18">
                <shopping-cart-full />
              </el-icon>
              {{ getQuantity(r) }} {{ $t("product.products") }}
            </div>
            <div class="room-show-details" @click.stop="showOrder(r)">
              <el-icon class="button-icon" color="#ffffff" :size="16">
                <MoreFilled />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showContoDetail"
      :center="false"
      custom-class="dialog"
      width="40%"
      destroy-on-close
    >
      <order-list :conto="currentConto" @moveConto="moveConto" @deleteConto="deleteConto">
      </order-list>
    </el-dialog>
  </div>
</template>

<script>
import Status from "../data/Status.js";
import Conto from "../data/Conto.js";
import Firebase from "../firebase.js";
import { ShoppingCartFull, Clock, Coin, MoreFilled, Right } from "@element-plus/icons";
import OrderList from "../components/OrderList.vue";
import utils from "../utils.js";
import repo from "@/db/repo.js";
import Reservation from "@/data/Reservation.js";
import Guest from "@/data/Guest.js";
import axios from 'axios'

export default {
  name: "Rooms",
  components: { ShoppingCartFull, Clock, OrderList, Coin, MoreFilled, Right },
  props: ["order"],
  data() {
    return {
      floors: [],
      currentFloor: {},
      showContoDetail: false,
      currentConto: {},
      searchInput: "",
      contiAperti: [],
      movingTab: null,
      reservations: [],
      bookings: []
    };
  },
  methods: {
    convertRoom(h5s_id) {
      const idmap = {
        '63': '1',
        '1': '2',
        '2': '3',
        '3': '4',
        '4': '5',
        '5': '6',
        '6': '7',
        '7': '8',
        '8': '9',
        '9': '10',
        '10': '11',
        '11': '12',
        '12': '13',
        '13': '14',
        '64': '15',
        '14': '16',
        '15': '17',
        '16': '18',
        '17': '19',
        '18': '20',
        '19': '21',
        '20': '22',
        '21': '23',
        '22': '24',
        '67': '25',
        '23': '26',
        '24': '27',
        '25': '28',
        '65': '29',
        '26': '30',
        '27': '31',
        '28': '32',
        '29': '33',
        '30': '34',
        '31': '35',
        '32': '36',
        '33': '37',
        '34': '38',
        '35': '39',
        '36': '40',
        '37': '41',
        '38': '42',
        '39': '44',
        '40': '45',
        '41': '46',
        '42': '47',
        '43': '48',
        '44': '49',
        '45': '50',
        '46': '51',
        '47': '52',
        '48': '53',
        '49': '54',
        '50': '55',
        '51': '56',
        '68': '57',
        '69': '58',
        '70': '59',
        '71': '60',
        '72': '61',
        '73': '62',
        '53': '101',
        '54': '102',
        '55': '103',
        '56': '104',
        '57': '105',
        '58': '106',
        '59': '107',
        '60': '108',
        '61': '109',
        '62': '110',
        '52': '111',
      };

      return idmap[h5s_id]
    },
    readFile: function(event) {
      var file = event.target.files[0];
      const reader = new FileReader();
      if (file.name.includes(".json")) {
        reader.onload = (res) => {
          var data = JSON.parse(res.target.result)
          this.importRooms(data);
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(file);
      }
    },
    importRooms: function(data) {
      var tableau = data;

      Firebase.db.collection('rooms').get()
        .then(querySnapshot => {
          var size = querySnapshot.size;
          if(size == 0) {
            for(var i=0; i<tableau.length; i++) {
              Firebase.db.collection('rooms').doc(tableau[i].id).set(tableau[i]);
            }            
          } else {
            var count = 0;
            querySnapshot.docs.forEach(snapshot => {
              snapshot.ref.delete();
              count++;
              if(count == size) {
                for(var i=0; i<tableau.length; i++) {
                  Firebase.db.collection('rooms').doc(tableau[i].id).set(tableau[i]);
                }
              }
            })
          }
        })
    },
    undoMove: function () {
      this.movingTab = null;
    },
    moveConto: function () {
      this.showContoDetail = false;
      this.move(this.currentConto);
    },
    deleteConto: function() {
      this.showContoDetail = false;
      this.deleteTab(this.currentConto);
    },
    getBgc: function (t) {
      var style = "background-color: ";
      if(t.status != undefined) {
        if(t.status == Status.locked) {
          style += " var(--danger-color);";
        } else {
          style += "rgb(232, 232, 232)";
        }
      } else {
        style += "rgb(232, 232, 232)";
      }

      return style;
    },
    isMoving: function (t) {
      if (this.movingTab == null) return false;

      if (
        this.movingTab.place.floorDocId == this.currentFloor.docId &&
        this.movingTab.place.placeId == t.key
      ) {
        return true;
      } else return false;
    },
    getPlaces: function (floor) {
      var count = 0;
      for (var key in floor.rooms) {
        if (Object.prototype.hasOwnProperty.call(floor.rooms, key)) count++;
      }
      return count;
    },
    showOrder: function (t) {
      this.showContoDetail = true;
      this.currentConto = t.conto;
    },
    readBookingsFile: function(event) {
      var file = event.target.files[0];
      const reader = new FileReader();
      if (file.name.includes(".json")) {
        reader.onload = (res) => {
          var data = JSON.parse(res.target.result)
          this.handleBookings(data.movements, true);
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(file);
      }
    },
    handleBookings: function(movements, saveRemote) {
      for(var i=0; i<movements.length; i++) {
        var obj = movements[i];
        var booking = new Reservation;
        booking.room = {
          id: this.convertRoom(obj.room_id),
          name: obj.room_number
        };
        booking.datetime = obj.reservation_date_time;
        booking.checkin = obj.checkin_date;
        if(obj.checkin_effective == true) {
          booking.status = 1;
        }
        if(obj.checkout_effective == true) {
          booking.status = 2;
        }
        //board
        if(obj.breakfast == true) {
          booking.board = 'BB'
        }
        if(obj.dinner == true) {
          booking.board = 'HB'
        }
        if(obj.lunch == true) {
          booking.board = 'FB'
        }
        booking.checkout = obj.checkout_date;
        booking.pax = obj.expected_number_of_guests;
        booking.price_per_room = obj.room_price;
        if(obj.deposits != undefined) {
          for(var n=0; n<obj.deposits.length; n++) {
            var deposit = {
              amount: obj.deposits[n].amount,
              payment_mode: obj.deposits[n].payment_mode,
              payment_date: obj.deposits[n].payment_date,
              invoice_progressive: obj.deposits[n].invoice_progressive,
            }
            booking.deposits.push(deposit);
          }
        }
        if(obj.notes != undefined) {
          booking.notes.push(obj.notes);
        }
        if(obj.housekeeper_notes != undefined) {
          booking.housekeeping.push(obj.housekeeper_notes);
        }

        for(var m=0; m<obj.customers.length; m++) {
          var guest = new Guest;
          guest.customer_id = obj.customers[m].pms_customer_id;
          guest.checkin_date = obj.customers[m].checkin_date;
          guest.checkout_date = obj.customers[m].checkout_date;
          guest.firstname = obj.customers[m].name;
          guest.lastname = obj.customers[m].surname;
          guest.sex = obj.customers[m].sex;
          guest.fiscal_code = obj.customers[m].fiscal_code;
          guest.vat_number = obj.customers[m].vat_number;
          guest.email.push(obj.customers[m].email);
          guest.phone.push(obj.customers[m].phone);
          guest.address = obj.customers[m].address;
          guest.zip = obj.customers[m].zip;
          guest.city = obj.customers[m].city;
          guest.prov = obj.customers[m].district;
          guest.state = obj.customers[m].state;
          guest.lang_code = obj.customers[m].lang_code;
          guest.document = {
             type: obj.customers[m].document_type_id,
             desc: obj.customers[m].document_type,
             id: obj.customers[m].document_number,
             released: obj.customers[m].document_release_date,
             expiry: obj.customers[m].expiry_date,
             issued_by: obj.customers[m].document_releaser
          };
          guest.birth_date = obj.customers[m].birth_date;
          guest.birth_state = obj.customers[m].birth_state;
          guest.birth_place = obj.customers[m].birth_place;
          guest.birth_prov = obj.customers[m].birth_district;

          booking.guests.push(guest);
        }

        booking.accountholder.customer_id = obj.reservation_holders[0].pms_customer_id;
        booking.accountholder.checkin_date = obj.reservation_holders[0].checkin_date;
        booking.accountholder.checkout_date = obj.reservation_holders[0].checkout_date;
        booking.accountholder.firstname = obj.reservation_holders[0].name;
        booking.accountholder.lastname = obj.reservation_holders[0].surname;
        booking.accountholder.sex = obj.reservation_holders[0].sex;
        booking.accountholder.fiscal_code = obj.reservation_holders[0].fiscal_code;
        booking.accountholder.vat_number = obj.reservation_holders[0].vat_number;
        booking.accountholder.email.push(obj.reservation_holders[0].email);
        booking.accountholder.phone.push(obj.reservation_holders[0].phone);
        booking.accountholder.address = obj.reservation_holders[0].address;
        booking.accountholder.zip = obj.reservation_holders[0].zip;
        booking.accountholder.city = obj.reservation_holders[0].city;
        booking.accountholder.prov = obj.reservation_holders[0].district;
        booking.accountholder.state = obj.reservation_holders[0].state;
        booking.accountholder.lang_code = obj.reservation_holders[0].lang_code;
        booking.accountholder.document = {
           type: obj.reservation_holders[0].document_type_id,
           desc: obj.reservation_holders[0].document_type,
           id: obj.reservation_holders[0].document_number,
           released: obj.reservation_holders[0].document_release_date,
           expiry: obj.reservation_holders[0].expiry_date,
           issued_by: obj.reservation_holders[0].document_releaser
        };
        booking.accountholder.birth_date = obj.reservation_holders[0].birth_date;
        booking.accountholder.birth_state = obj.reservation_holders[0].birth_state;
        booking.accountholder.birth_place = obj.reservation_holders[0].birth_place;
        booking.accountholder.birth_prov = obj.reservation_holders[0].birth_district;

        booking.checkin_timestamp = (new Date(booking.checkin)).getTime()/1000;
        booking.checkout_timestamp = (new Date(booking.checkout)).getTime()/1000;
        booking.datetime_timestamp = (new Date(booking.datetime)).getTime()/1000;

        this.reservations.push(booking);
        var reservation = Object.assign({}, (booking));
        reservation = this.removeEmpty(reservation);

        if(saveRemote) {
          repo.addDoc('reservations', reservation)
        }
        // local pouch
        //data.movements[i]['_id'] = uuid.v1();
        //this.localDB.put(data.movements[i])
      }
      //console.log(this.reservations);
    },
    removeEmpty: function(obj) {
      let newObj = {};
      Object.keys(obj).forEach((key) => {
        if (obj[key] === Object(obj[key])) newObj[key] = this.removeEmpty(obj[key]);
        else if (obj[key] !== undefined) newObj[key] = obj[key];
      });
      return newObj;
    },
    roomBusy: function (t) {
      if (t.conto == null) return false;
      else return t.conto.size() > 0;
    },
    move: function (tab) {
      this.movingTab = tab;
    },
    deleteTab: function(tab) {
      console.log("deleteTab", tab);
      repo.deleteConto(
        tab.id,
        tab.place,
        function() {
          console.log("Tab Deleted")
        }
      );
    },
    moveTab: function (tab, destination) {
      console.log("moveTab", tab, destination);
      this.movingTab = null;

      var source = {
        floorId: tab.place.floorDocId,
        floorName: tab.place.floorName,
        placeId: tab.place.placeId,
        placeName: tab.place.placeName,
      };

      var docRef = Firebase.db.collection("park").doc(destination.floorId);
      var key = "places." + destination.placeId + ".contoId";
      docRef
        .update({
          [key]: this.currentConto.id,
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      docRef = Firebase.db.collection("park").doc(source.floorId);
      key = "places." + source.placeId + ".contoId";
      docRef
        .update({
          [key]: "",
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      var ref = Firebase.db.collection("conti").doc(tab.id);
      ref.update({
        place: destination,
      });
    },
    setRoomSelected: function(room) {
      room.status = Status.locked;
    },
    selectRoom: function (room) {
      var destination = {
        floorId: this.currentFloor.docId,
        floorName: this.currentFloor.name,
        placeId: room.key,
        placeName: room.name,
      };
      if (this.movingTab != null) {
        this.moveTab(this.movingTab, destination);
      } else {
        this.$bus.trigger("loadConto", {
          place: {
                placeId: room.key,
                placeName: room.name,
                floorDocId: this.currentFloor.docId,
                floorName: this.currentFloor.name,
              },
          billId: room.contoId,
        });
      }
      this.setRoomSelected(room);
    },
    setColor: function (color) {
      return "background-color: " + color;
    },
    getLastMod: function (t) {
      if (t.conto.size() > 0) {
        var now = new Date();
        var h = 0;
        var d = 0;
        var min = Math.floor(
          (now.getTime() / 1000 - t.conto.lastModified.toDate().getTime() / 1000) / 60
        );
        h = Math.floor(min / 60);
        if (h > 0) {
          min = min % 60;
        }
        d = Math.floor(h / 24);
        if (d > 0) {
          h = h % 24;
        }
        var time = "";
        if (d > 0) {
          time = d + " day\u2022";
        }
        if (h > 0) {
          time += h + " h\u2022";
        }
        time += min + " min";
        return time;
      } else {
        return "";
      }
    },
    getQuantity: function (t) {
      return t.conto.getQuantity();
    },
    getAmount: function (t) {
      return utils.formatPriceWithCurrency(t.conto.getTotaleNetto());
    },
    selectFloor: function (c) {
      this.currentFloor = c;
    },
    getNextfloorId: function () {
      var max = 0;
      for (var i = 0; i < this.floors.length; i++) {
        if (this.floors[i].id > max) {
          max = this.floors[i].id;
        }
      }
      return Number(max + 1);
    },
    addfloor: function () {
      this.$prompt("", this.$t("rooms.new_floor"), {
        confirmButtonText: this.$t("generic.ok"),
        cancelButtonText: this.$t("generic.cancel"),
      })
        .then(({ value }) => {
          Firebase.db
            .collection("park")
            .add({
              id: this.getNextfloorId(),
              name: value,
              places: {},
            })
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        })
        .catch(() => {});
    },
    getButtonClass: function (floorId) {
      if (this.currentFloor == null || floorId != this.currentFloor.id) {
        return "button-idle";
      } else {
        return "button-active";
      }
    },
    getConto(id) {
      var selected = null;
      var conto = new Conto();
      for (var i = 0; i < this.contiAperti.length; i++) {
        if (this.contiAperti[i].id == id) {
          selected = this.contiAperti[i];
          break;
        }
      }
      conto.fillData(selected);
      return conto;
    },
    getRoomBoardStyle(room) {
      var style = 'room-board-bb';
      for(var i=0; i<this.bookings.length; i++) {
        var room_name = this.bookings[i].room.name.split('-')[0].trim();
        if(room_name == room.name) {
          if(this.bookings[i].board == 'HB') {
            style = 'room-board-hb'
          } else if(this.bookings[i].board == 'FB') {
            style = 'room-board-fb'
          } else {
            style = 'room-board-bb'    
          }
        }
      } 
      return style;

    },
    getRoomBoard(room) {
      var board = '--';
      for(var i=0; i<this.bookings.length; i++) {
        var room_name = this.bookings[i].room.name.split('-')[0].trim();
        if(room_name == room.name) {
          return this.bookings[i].board;
        }
      }
      return board;
    },
    getRoomGuest(room) {
      for(var i=0; i<this.bookings.length; i++) {
        var room_name = this.bookings[i].room.name.split('-')[0].trim();
        if(room_name == room.name) {
          return this.bookings[i].accountholder.lastname;
        }
      }
      return '-----';
    },
    getRoomCheckout(room) {
      for(var i=0; i<this.bookings.length; i++) {
        var room_name = this.bookings[i].room.name.split('-')[0].trim();
        if(room_name == room.name) {
          //var date = new Date(this.bookings[i].checkout_timestamp * 1000);
          var checkoutString = utils.toLocaleDateString(this.bookings[i].checkout_timestamp) + ' \u279C';
          return checkoutString
        }
      }
      return '';
    },
    getRoomCheckoutStyle(room) {
      var style = 'room-checkout';
      for(var i=0; i<this.bookings.length; i++) {
        var room_name = this.bookings[i].room.name.split('-')[0].trim();
        if(room_name == room.name) {
          if(utils.isToday(this.bookings[i].checkout_timestamp)) {
            style = 'room-checkout-warning';
            break;
          }
        }
      } 
      return style;
    },
    getDefaultTableau: function() {
      var now = new Date();
      var day = now.getDate();
      var month = now.getMonth()+1;
      if(day<10) {
        day = '0'+day;
      }
      if(month<10) {
        month = '0'+month;
      }
      var year = now.getFullYear();

      var from = year + '-' + month + '-' + (day-1);
      var to = year + '-' + month + '-' + day;
      var url = 'http://localhost:1800/api/reservations?';
      url += 'from=' + from;
      url += '&';
      url += 'to=' + to;
      url += '&';
      url += 'checkin=false';

      var self = this;
      axios.get(url)
        .then(function (response) {
          // handle success
          self.handleBookings(response.data, false);
          self.bookings = self.reservations;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    }
  },
  mounted() {
    var self = this;
    this.getDefaultTableau();
    /*
    repo.getBookings({checkin: true}, function(data){
      console.log('getBookings', data);
      self.bookings = data;
    })
    */
    repo.getOpenTabs(function (docs) {
      self.contiAperti = docs;
      //self.getParks();
      repo.getRooms(function (data) {
        self.floors = data;
        self.currentFloor = self.floors[0];

        console.log('currentFloor', self.currentFloor)
      });
    });
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: auto;
  grid-row-gap: 15px;
  grid-column-gap: 15px;
  margin: 10px;
  padding-right: 10px;
  text-align: center;
}
.room {
  min-height: 120px;
  position: relative;
  top: 1px;
  left: 1px;
  background: #fff;
  border: 0px solid rgb(150, 155, 162);
  border-radius: 8px;
  padding: 0px;
}
.inner-room {
  margin-left: 12px;
  padding: 10px;
}

.room-name {
  font-weight: 900;
  font-size: 2.4em;
  position: absolute;
  top: 0px;
  left: 5px;
  border-radius: 8px;
  width: 50px;
  height: 40px;
  padding: 4px;
  color: var(--primary-color);
}
.room-info {
  position: absolute;
  top: 45px;
  left: 5px;
}
.room-guest {
  position: absolute;
  top: 5px;
  right: 5px;
  font-weight: 500;
  font-size: 1.0em;
  border-radius: 4px;
  background: #fff;
  border: solid 1px var(--gray4-color);
  padding: 2px 4px;
  color: var(--gray1-color);
}
.room-checkout {
  font-weight: normal;
  font-size: 0.9em;
  margin-left:2px;
  border-radius: 8px;
  padding: 2px;
  color: var(--secondary-color);
}
.room-checkout-warning {
  font-weight: 500;
  font-size: 0.9em;
  border-radius: 4px;
  padding: 2px;
  margin-left:4px;
  background-color: var(--danger-light-color);
  color: var(--danger-color);
}
.room-board-bb {
  font-weight: 500;
  font-size: 0.9em;
  color: #ff6382;
  background-color: #ff638240;
  border-radius:4px;
  padding: 0px 2px;
}
.room-board-hb {
  font-weight: 500;
  font-size: 0.9em;
  color: #238a3d;
  background-color: #238a3d40;
  border-radius:4px;
  padding: 0px 2px;
}
.room-board-fb {
  font-weight: 500;
  font-size: 0.9em;
  color: #3734a3;
  background-color: #3734a340;
  border-radius:4px;
  padding: 0px 2px;
}
.room-order-quantity {
  position: absolute;
  font-size: 0.9em;
  bottom: 5px;
  left: 14px;
  min-width: 90px;
  text-align: left;
  color: var(--primary-color);
  text-transform: lowercase;
  border: solid 0px var(--primary-color);
  border-radius: 4px;
  background: #667acc30;
  padding: 1px 4px;
  font-weight: 500;
}
.room-order-amount {
  position: absolute;
  font-size: 0.9em;
  bottom: 30px;
  left: 14px;
  text-align: left;
  min-width: 90px;
  color: var(--success-color);
  text-transform: lowercase;
  border: solid 0px var(--success-color);
  border-radius: 4px;
  background: #fc6a8230;
  padding: 1px 4px;
  font-weight: 500;
}
.room-last-modification {
  position: absolute;
  font-size: 0.9em;
  top: 5px;
  left: 14px;
  color: #000;
  font-weight: normal;
}
.room-show-details {
  position: absolute;
  bottom: 5px;
  right: 15px;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(220, 151, 213, 0.473);
}
.button-icon {
  position:relative;
  top: calc(50% - 8px); /* 50% - 3/4 of icon height */
}
.menu-item:hover {
  font-weight: bold;
  vertical-align: middle;
}
.menu-header {
  color: #000;
  font-weight: bold;
}
.floor-buttons {
  display: flex;
  flex: 1;
  overflow-x: auto;
  padding-top: 10px;
  padding-left: 10px;
  flex-flow: row nowrap;
  align-items: center;
}
.floor-buttons::-webkit-scrollbar {
  display: none;
}
.floor-indicator {
  height: 5px;
  margin: 5px;
  width: 70%;
}
.button-active {
  background-color: var(--secondary-color);
  border: 0px;
  font-size: 1.2em;
  font-weight: bold;
  min-width: 150px;
}
.button-idle {
  min-width: 150px;
  background-color: #fff;
  color: var(--primary-color);
  font-weight: bold;
  font-size: 1.2em;
  border: 0px solid var(--primary-color);
}
.button-new {
  min-width: 150px;
  font-weight: bold;
  font-size: 1.2em;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
}
.dialog {
  background: red;
}
.search {
  text-align: left;
  padding: 10px;
}
.search-input {
  border-radius: 30px;
  width: 150px;
  height: 35px;
  border: solid 1px var(--secondary-color);
  color: var(--secondary-color);
  font-weight: bold;
  font-size: 1.2em;
  background: transparent;
  padding-left: 10px;
  padding-right: 10px;
}

.color-indicator {
  width: 12px;
  height: 100%;
  background: rgb(232, 232, 232);
  margin-right: 10px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  position: absolute;
  top: 0px;
  left: 0px;
}
.moving-warning {
  position: absolute;
  text-align: left;
  bottom: 0px;
  margin-left: 12px;
  padding: 10px;
}
.rooms-toolbar {
  padding: 10px;
  text-align: left;
}
</style>
