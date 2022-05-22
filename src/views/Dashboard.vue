<template>
  <div class="dashboard">
    <span class="title">{{getWelcome()}}</span>
    <div class="container">
      <div class="dash-card purple">
      <span class="card-head">{{$t('config.fiscal-printer')}}</span>
      <div class="settings">
        <el-dropdown trigger="click">
          <el-icon  :size="20" v-on:click.stop color="#6f788d"><more-filled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="el-icon-link" @click="testPrintf()">
                <span class="dropdown-item">
                  {{$t('general.test')}}
                </span>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-setting" @click="gotoPrintfConfig()">
                <span class="dropdown-item">
                  {{$t('general.config')}}
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="card-divider"></div>
      <span class="card-info-bottom">{{printerStatusLabel}}</span>
      </div>

      <div class="dash-card blue" @click="gotoBills()">
      <span class="card-head">{{$t('stats.opened_bills')}}</span>
      <div class="settings">
        <el-dropdown trigger="click">
          <el-icon  :size="20" v-on:click.stop color="#6f788d"><more-filled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="el-icon-money" @click="gotoBills()">
                <span class="dropdown-item">
                  {{$t('general.view')}}
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="card-divider"></div>
      <span class="card-info-bottom">{{contiAperti + " " + $t('bill.bills')}}</span>
      </div>

      <div class="dash-card yellow">
      <span class="card-head">{{$t('notes.notes')}}</span>
      <div class="settings">
        <el-dropdown trigger="click">
          <el-icon  :size="20" v-on:click.stop color="#6f788d"><more-filled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="note in notes" :key="note.id" icon="el-icon-check" @click="showNote(note)">
                <span class="dropdown-item">
                  {{note.title}}
                </span>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-document-add" @click="newNote()">
                <span class="dropdown-item">
                  {{$t('notes.new-note')}}
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="card-divider"></div>
      <span class="card-info-bottom">{{notesLabel}}</span>
      </div>

      <div class="dash-card red">
      <span class="card-head">{{$t('wharehouse.wharehouse')}}</span>
      <div class="settings">
        <el-dropdown trigger="click">
          <el-icon  :size="20" v-on:click.stop color="#6f788d"><more-filled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="el-icon-box">
                <span class="dropdown-item">{{$t('wharehouse.load')}}</span>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-data-analysis">
                <span class="dropdown-item">{{$t('stats.report')}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="card-divider"></div>
      <span class="card-info-bottom">{{$t('wharehouse.inventory_alarm')}}:&nbsp;{{giacenze}}</span>
      </div>
    </div>

    <el-dialog
      :title="$t('notes.new-note')"
      v-model="showNewNote"
      :center="false"
      width="40%"
      destroy-on-close>
      <note></note>
    </el-dialog>
  </div>
</template>

<script>
import Firebase from "../firebase.js";
import printf from "../fiscalprinter/printf.js";
import Conto from "@/data/Conto"
import operator from "../store/user.js"
import { MoreFilled } from '@element-plus/icons'
import Note from './Dashboard/Note.vue'
import { ElMessageBox } from 'element-plus'

export default {
  name: 'Dashboard',
  components: {
    MoreFilled,
    Note
  },
  data() {
    return {
      printerStatusLabel: 'connessa',
      note: 'nessuna',
      giacenze: 3,
      docs: [],
      notes: [],
      showNewNote: false
    }
  },
  computed: {
    operatorName: function() {
      return operator.getName();
    },
    contiAperti: function() {
      return this.docs.length;
    },
    notesLabel: function() {
      if(this.notes.length == 0) {
        return this.$t('notes.no-notes');
      } else {
        return this.notes.length + " " + (this.notes.length>1 ?  this.$t('notes.notes') : this.$t('notes.note'))
      }
    }
  },
  methods: {
    showNote: function(note) {
      ElMessageBox.alert(note.body, note.title, {
        confirmButtonText: 'OK',
        callback: () => {
        },
      })
    },
    newNote: function() {
      this.showNewNote = true;
    },
    gotoBills: function() {
      this.$router.push('./conti')
    },
    gotoPrintfConfig: function() {

    },
    getPrinterStatus: function() {
      if(printf.getConnectedStatus() == true) {
        return this.$t('config.connected');
      } else {
        return this.$t('config.not-connected');
      }
    },
    getNotes: function() {
      Firebase.db
        .collection("notes")
        .onSnapshot((snapshotChange) => {            
          this.notes = [];
          snapshotChange.forEach((doc) => {
            var item = {};
            item.id = doc.id;
            item.title = doc.data().title;
            item.body = doc.data().body;
            this.notes.push(item)
          });
        });    },
    getContiAperti: function() {
      Firebase.db
        .collection("park")
        .onSnapshot((snapshotChange) => {            
          this.docs = [];
          snapshotChange.forEach((doc) => {
            var area = doc.data();
            var places = area.places;
            for(var n in places) {
              if(places[n].conto != null) {
                var record = places[n].conto;
                if(record.orderList != undefined) {
                  if(record.orderList.length > 0) {
                    var conto = new Conto;
                    conto.fillData(places[n].conto);
                    places[n].conto = conto;
                    record.place = {
                      area: {
                        id: area.id,
                        name: area.name
                      },
                      name: places[n].name
                    }
                    record.id = doc.id;
                    this.docs.push(record);
                  }
                }
              }
            }
          });
        });
    },
    getWelcome: function() {
      var now = new Date();
      var hours = now.getHours();
      var message = hours < 13 ? this.$t('general.good-morning') : hours < 18 ? this.$t('general.good-afternoon') : this.$t('general.good-evening');
      message += " " + this.operatorName;
      return message;
    },
    testPrintf: function() {

    }
  },
  mounted() {
    this.printerStatusLabel = this.getPrinterStatus();
    this.$bus.on('changePrintf', (e) => {
      this.printerStatusLabel = this.getPrinterStatus(e);
    });

    this.getContiAperti();
    this.getNotes();
  },
}
</script>

<style scoped>
.dashboard {
  text-align: left;
  padding: 10px;
}
.container {
  display: grid;
  grid-template-columns: 250px 250px 250px;
  grid-template-rows: auto;
  grid-gap: 25px;
  padding: 18px;
  margin: auto;
}
.dash-card {
  border-radius: 8px;
  border: 0px solid rgb(227, 227, 227);
  box-shadow: 3px 8px 8px -4px rgb(151, 114, 114, 0.4);
  padding: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
  height: 100px;
  text-align: left;
  background: white;
  position:relative;
}
.dash-card:hover{ -webkit-transform: scale(1.05); }
.card-head {
  top: 12px;
  left: 12px;
  font-weight: bold;
  font-size: 1.4em;
  display: block;
  max-width: 180px;
}
.card-info-bottom {
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-weight: 500;
  font-size: 1.0em;
  padding-left: 20px;
  padding-right: 20px;
  color: var(--primary-color);
}
.card-divider {
  position: absolute;
  background: var(--info-color);
  height: 1px;
  bottom: 35px;
  right: 0px;
  left: 0px;
  margin-right: 15px;
  margin-left: 15px;
}
.amber {
  /*background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);*/
  /*background: #FFAB91;*/
  color: #FF5722;
}
.bgnd-amber {
  background: #FF5722;
}
.purple {
  /*background: #E1BEE7;*/
  /*background-image: linear-gradient(to left, #E1BEE7 0%, #BA68C8 100%);*/
  color: #7B1FA2;
}
.bgnd-purple {
  background: #7B1FA2;
}
.blue {
  /*background: #c2e9fb;*/
  /*background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);*/
  color: #0D47A1;
}
.bgnd-blue {
  background: #0D47A1;
}
.green {
  /*background: #d4fc79;*/
  /*background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);*/
  color: #4CAF50;
}
.bgnd-green {
  background: #4CAF50;
}
.red {
  /*background: #EF9A9A;*/
  /*background-image: linear-gradient(to left, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%);*/
  color: #D32F2F;
}
.bgnd-red {
  background: #D32F2F;
}
.yellow {
  /*background: #FFEE58;*/
  color: #F9A825;
}
.bgnd-yellow {
  background: #F9A825;
}
.title {
  font-size: 3.0em;
  font-family: "Montserrat";
  font-weight: 900;
  color: var(--info-color);
}
.settings {
  position: absolute;
  top: 12px;
  right: 12px;
}
.dropdown-item {
  font-family: "Montserrat";
  font-weight: 500;
}
</style>
