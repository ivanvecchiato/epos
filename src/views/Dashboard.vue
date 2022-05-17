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
              <el-dropdown-item icon="el-icon-star-off" @click="heartProduct(item)">
                <span class="dropdown-item">{{$t('product.favorite')}}</span>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-edit" @click="editProduct(item)">
                <span class="dropdown-item">{{$t('product.edit')}}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="card-divider"></div>
      <span class="card-info-bottom">{{printerStatus}}</span>
    </div>

    <div class="dash-card blue">
      <span class="card-head">{{$t('stats.opened_bills')}}</span>
      <div class="settings">
        <el-dropdown trigger="click">
          <el-icon  :size="20" v-on:click.stop color="#6f788d"><more-filled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="el-icon-star-off" @click="heartProduct(item)">{{$t('product.favorite')}}</el-dropdown-item>
              <el-dropdown-item icon="el-icon-edit" @click="editProduct(item)">{{$t('product.edit')}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="card-divider"></div>
      <span class="card-info-bottom">{{contiAperti + " " + $t('bill.bills')}}</span>
    </div>

    <div class="dash-card yellow">
      <span class="card-head">{{$t('general.notes')}}</span>
      <div class="settings">
        <el-dropdown trigger="click">
          <el-icon  :size="20" v-on:click.stop color="#6f788d"><more-filled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="el-icon-box">{{$t('product.favorite')}}</el-dropdown-item>
              <el-dropdown-item icon="el-icon-edit">{{$t('product.edit')}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="card-divider"></div>
      <span class="card-info-bottom">{{notes}}</span>
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

  </div>
</template>

<script>
import Firebase from "../firebase.js";
import printf from "../fiscalprinter/printf.js";
import Conto from "@/data/Conto"
import operator from "../store/user.js"
import { MoreFilled } from '@element-plus/icons'

export default {
  name: 'Dashboard',
  components: {
    MoreFilled
  },
  data() {
    return {
      printerStatus: 'connessa',
      note: 'nessuna',
      giacenze: 3,
      docs: [],
      numberOfNotes: 0
    }
  },
  computed: {
    operatorName: function() {
      return operator.getName();
    },
    contiAperti: function() {
      return this.docs.length;
    },
    notes: function() {
      if(this.numberOfNotes == 0) {
        return this.$t('general.no-notes');
      } else {
        return this.numberOfNotes + this.$t('general.notes')
      }
    }
  },
  methods: {
    getPrinterStatus: function() {
      if(printf.getConnectedStatus() == true) return this.$t("config.connected");
      else return this.$t("config.not-connected");
    },
    getNotes: function() {

    },
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
          this.handleDocs();
        });
    },
    getWelcome: function() {
      var now = new Date();
      var hours = now.getHours();
      var message = hours < 13 ? this.$t('general.good-morning') : hours < 18 ? this.$t('general.good-afternoon') : this.$t('general.good-evening');
      message += " " + this.operatorName;
      return message;
    }
  },
  mounted() {
    this.printerStatus = this.getPrinterStatus();
    this.getContiAperti();
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
  font-weight: normal;
  font-size: 1.0em;
  padding-left: 20px;
  padding-right: 20px;
  color: var(--info-color);
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
  font-size: 2.0em;
}
.settings {
  position: absolute;
  top: 12px;
  right: 12px;
}
.dropdown-item {
  font-family: "Montserrat-Regular";
}
</style>
