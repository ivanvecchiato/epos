<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-form-item>
          <div style="text-align: left; padding-left: 20px">
            <el-checkbox v-model="searchByRange" @change="rangeChecked">
              {{$t("bill.search_by_range")}}
            </el-checkbox>
          </div>
          <div>
            <el-date-picker
              v-model="daterange"
              type="datetimerange"
              :disabled="searchByRange == false"
              @change="selectRange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-card-title">{{$t('stats.opened_bills')}}</div>
          <div style="position: absolute; left:20px; bottom: 15px">
            <el-icon :size="20"><Document /></el-icon>
            <span class="stats-amount">{{stats.contiAperti.numero}}</span>
          </div>
          <div style="position: absolute; right:20px; bottom: 15px">
            <el-icon :size="20"><Money /></el-icon>
            <span class="stats-amount">{{formatAmount(stats.contiAperti.totale)}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-card-title">{{$t('orders.orders')}}</div>
          <div style="position: absolute; left:20px; bottom: 15px">
            <el-icon :size="20"><Document /></el-icon>
            <span class="stats-amount">{{stats.contiAperti.numero}}</span>
          </div>
          <div style="position: absolute; right:20px; bottom: 15px">
            <el-icon :size="20"><DishDot /></el-icon>
            <span class="stats-amount">{{stats.contiAperti.deleted}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card" shadow="hover">
          <div class="stat-card-title">{{$t('generic.deletions')}}</div>
          <div style="position: absolute; right:20px; bottom: 15px">
            <el-icon :size="20"><Delete /></el-icon>
            <span class="stats-amount">{{stats.contiAperti.deleted}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="stat-card">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="#" width="150">
            <template #default="scope">
              <span class="order-code">{{scope.row.id_order}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('bill.place')" width="150">
            <template #default="scope">
              <span class="place1">{{scope.row.place.area}}</span>
              &nbsp;
              <span class="place2">{{scope.row.place.place}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" :label="$t('bill.createdAt')" width="150">
          </el-table-column>
          <el-table-column prop="lastModified" :label="$t('bill.lastModification')" width="150">
          </el-table-column>
          <el-table-column align="right" :label="$t('bill.amount')" width="120">
            <template #default="scope">
              <span class="amount">{{formatAmount(scope.row.amount)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="" width="100">
            <template #default="scope">
              <el-button
                icon="el-icon-view"
                size="mini"
                @click="handleDetail(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </el-col>
      <div>
        <el-dialog
          :title="$t('bill.details')"
          v-model="detailVisible"
          lock-scroll=false
          destroy-on-close
          width="70%">
          <bill-detail :data="currentBill" :key="randKey" />
        </el-dialog>
      </div>
    </el-row>

    <el-row>

      <el-col :span="12">

        <div class="stat-card">
          <div class="stat-card-header">
            <span>{{$t('stats.most_popular')}}</span>
          </div>
          <ul class="simple-list">
            <li v-for="item in stats.popular" :key="item.id">
              <div class="stat-line">
                <div class="thumbnail-bgnd">
                  <img :src="item.properties.imgUrl" class="thumbnail"/>
                </div>
                <span class="popular-name">{{item.name}}</span>
                <span class="popular-category">{{item.category.name}}</span>
                <span class="popular-quantity">{{item.quantity}}</span>
              </div>
            </li>
          </ul>
        </div>

      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="24">

            <div class="stat-card">
              <div class="stat-card-header">
                <span>{{$t('stats.quantity')}}</span>
              </div>
              <apexchart
                width="500"
                type="line"
                :options="chartOptions"
                :series="vendutoSeries">
              </apexchart>
            </div>

            <div class="stat-card">
              <div class="stat-card-header">
                <span>{{$t('stats.value')}}</span>
              </div>
              <apexchart
                width="500"
                type="line"
                :options="chartOptions"
                :series="incassatoSeries">
              </apexchart>
            </div>
          </el-col>
        </el-row>        
      </el-col>
    </el-row>

  </div>
</template>

<script>
import firebase from '@firebase/app';
import Firebase from "../firebase.js";
import utils from "../utils.js";
import BillDetail from "../components/BillDetail.vue";
import Conto from "../data/Conto"
import VueApexCharts from "vue3-apexcharts";
import { Document, Money, Delete, DishDot } from '@element-plus/icons'

export default {
  name: "ContiParcheggiati",
  components: {
    BillDetail,
    Document,
    Delete,
    Money,
    DishDot,
    apexchart: VueApexCharts,},
  data() {
    return {
      detailVisible: false,
      tableData: [],
      daterange: null,
      searchByRange: false,
      chartOptions: {
        chart: {
          id: "venduto",
        },
        xaxis: {
          categories: [],
        },
        stroke: {
          curve: 'smooth',
        },
      },
      barchartOptions: {
        chart: {
          id: "popular",
        },
        xaxis: {
          categories: []
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
      },
      vendutoSeries: [
        {
          name: "venduto",
          data: [],
        }
      ],
      incassatoSeries: [
        {
          name: "incassato",
          data: [],
        },
      ],
      /*
      popularSeries: [
        {
          name: "popular",
          data: [],
        },
      ],
      */
      stats: {
        contiAperti: {
          numero: 0,
          totale: 0,
          deleted: 0
        },
        collection: {},
        popular: {}
      }
    };
  },
  computed: {
    phasesList: function() {
      var list = this.separateByTimestamp(this.orderList);
      console.log('***', list);
      return list;
    }
  },
  methods: {
    selectRange: function(dates) {
      this.daterange = dates;
      this.loadData(true);
    },
    rangeChecked: function(value) {
      if(value==false) {
        this.loadData(false);
      }
    },
    loadDefaultData: function() {
      this.loadData(false);
    },
    formatAmount: function(amount) {
      return Number(amount).toFixed(2) + ' €';
    },
    loadData: function(range) {
      this.tableData = [];
      if (range) {
        var start = firebase.firestore.Timestamp.fromDate(this.daterange[0]);
        var end = firebase.firestore.Timestamp.fromDate(this.daterange[1]);
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
                  if(record.lastModified >= start && record.lastModified <= end) {
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
              }
            });
            this.handleDocs();
          });
      } else {
        Firebase.db
          .collection("park")
          //.orderBy("id")
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
      }
    },
    getCancellations: function(list) {
      var d=0;
      for(var i=0; i<list.length; i++) {
        if(list[i].status == -100) d++;
      }
      return d;
    },
    handleDocs: function() {
      this.tableData = [];
      this.vendutoSeries[0].data = [];
      this.incassatoSeries[0].data = [];
      //this.popularSeries[0].data = [];
      this.stats.sospeso = 0;
      this.stats.contiAperti.numero = 0;
      this.stats.contiAperti.totale = 0;
      this.stats.contiAperti.deleted = 0;
      this.stats.collection = {};
      this.stats.popular = [];

      for(var j=0; j<=16; j++) {
        this.vendutoSeries[0].data[j] = 0;
        this.incassatoSeries[0].data[j] = 0;
      }

      this.stats.contiAperti.numero = this.docs.length;
      for (var i = 0; i < this.docs.length; i++) {
        this.stats.sospeso += this.docs[i].totale;
        var cancellations = Number(this.getCancellations(this.docs[i].orderList));
        this.tableData.push({
          id_order: this.docs[i].id_order,
          createdAt: utils.toDateTime(this.docs[i].createdAt),
          lastModified: utils.toDateTime(this.docs[i].lastModified),
          place: {
            area: this.docs[i].place.area.name,
            place: this.docs[i].place.name
          },
          amount: this.docs[i].totale.toFixed(2),
          deleted: cancellations
        });
        this.stats.contiAperti.totale += this.docs[i].totale;
        this.stats.contiAperti.deleted += cancellations;
        this.collectData(this.docs[i].orderList);
      }
      console.log('collectData', this.stats.collection)
      var sortedKeys = this.getSortedKeys(this.stats.popular);
      var tmp = [];
      for(i=0; i<Math.min(5, sortedKeys.length); i++) {
        this.barchartOptions.xaxis.categories[i] = sortedKeys[i];
        //this.popularSeries[0].data[i] = this.stats.collection[sortedKeys[i]];
        tmp[i] = this.stats.popular[sortedKeys[i]];
      }
      this.stats.popular = tmp;
    },
    collectData: function(list) {
      for(var i=0; i<list.length; i++) {
        var d = new Date(list[i].insertTime);
        var h = d.getHours();
        this.vendutoSeries[0].data[h-8]++;
        this.incassatoSeries[0].data[h-8] += list[i].price * list[i].quantity;
//        if(list[i].name in this.stats.collection) {
        if(list[i].id in this.stats.popular) {
          this.stats.popular[list[i].id].quantity += list[i].quantity;
        } else {
          this.stats.popular[list[i].id] = list[i];
          this.stats.popular[list[i].id].quantity = 1;
        }
      }
    },
    getSortedKeys: function(obj) {
      var keys = Object.keys(obj);
      return keys.sort(function(a,b){return obj[b].quantity-obj[a].quantity});
    },
    randKey: function() {
      return Math.random();
    },
    handleDetail: function(index) {
      this.currentBill = this.docs[index];
      this.detailVisible = true;
    },
    initGraphOptions: function() {
      for(var i=8; i<=24; i++) {
        this.chartOptions.xaxis.categories[i-8] = i;
      }
    }
  },
  mounted() {
    this.loadDefaultData();
    this.initGraphOptions();
  },
};
</script>

<style scoped>

.amount {
  color: var(--secondary-color);
  font-weight: bold;
  font-size: 1.1em;
}
.place1 {
  color: var(--warning-color);
  font-weight: bold;
  font-size: 1.0em;
  display: inline-block;
  min-width: 70px;
}
.place2 {
  color: var(--success-color);
  font-weight: bold;
  font-size: 1.0em;  border: solid 1px var(--success-color);
  border-radius: 4px;
  padding: 0px 8px 0px 8px;
}
.stat-line {
  margin: 10px;
  position: relative;
  min-height: 70px;
}
.thumbnail-bgnd {
  background: rgb(248, 239, 227);
  border-radius: 12px;
  box-shadow: 3px 8px 8px -4px rgb(151, 114, 114, 0.4);
  width: 60px;
  height: 60px;
  text-align: center;
  position: absolute;
  left: 20px;
}
.thumbnail {
  margin-top: 5px;
  height: 50px;
}
.popular-name {
  position: absolute;
  left: 100px;
  top: 5px;
  font-weight: bold;
}
.popular-category {
  position: absolute;
  left: 100px;
  top: 30px;
  font-weight: light;
  font-size: 0.9em;
  border: solid 1px var(--secondary-color);
  color: var(--secondary-color);
  border-radius: 4px;
  padding: 0px 4px 0px 4px;
}
.popular-quantity {
  position: absolute;
  right: 10px;
  font-weight: bold;
  font-size: 1.2em;
  color: var(--primary-color);
}
.order-code {
  font-weight: bold;
}
</style>
