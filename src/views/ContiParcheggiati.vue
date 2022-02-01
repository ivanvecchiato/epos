<template>
  <div>
    <div style="text-align: left">
      <el-form-item>
        <el-checkbox v-model="searchByRange" @change="rangeChecked">{{
          $t("bill.search_by_range")
        }}</el-checkbox>
        &nbsp;&nbsp;
        <el-date-picker
          v-model="daterange"
          type="datetimerange"
          :disabled="searchByRange == false"
          @change="selectRange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date">
        </el-date-picker>
      </el-form-item>
    </div>
    <el-row>
      <el-col :span="12">
      <div class="list">

        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" :label="$t('generic.date')" width="150">
          </el-table-column>
          <el-table-column prop="place" :label="$t('bill.place')" width="150">
          </el-table-column>
          <el-table-column prop="amount" :label="$t('bill.amount')" width="185">
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

      <el-card class="box-card" shadow="hover">
        <template #header>
        <div class="card-header">
          <span>{{$t('stats.most_popular')}}</span>
        </div>
        </template>
        <apexchart
          width="500"
          type="bar"
          :options="barchartOptions"
          :series="popularSeries">
        </apexchart>
      </el-card>

      <div>
        <el-dialog
          :title="$t('bill.details')"
          v-model="detailVisible"
          destroy-on-close
          width="70%">
          <bill-detail :data="currentBill" :key="randKey" />
        </el-dialog>
      </div>

      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="12">
            <el-card class="box-card" shadow="hover">
              <span class="stats-totale">{{$t('stats.total')}}</span>
              <span class="stats-totale stats-amount">{{formatAmount(stats.sospeso)}}</span>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card" shadow="hover">
              <span class="stats-totale">{{$t('stats.opened_bills')}}</span>
              <span class="stats-totale stats-amount">{{stats.contiAperti}}</span>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">

            <el-card class="box-card" shadow="hover">
              <template #header>
              <div class="card-header">
                <span>{{$t('stats.quantity')}}</span>
              </div>
              </template>
              <apexchart
                width="500"
                type="line"
                :options="chartOptions"
                :series="vendutoSeries">
              </apexchart>
            </el-card>

            <el-card class="box-card" shadow="hover">
              <template #header>
              <div class="card-header">
                <span>{{$t('stats.value')}}</span>
              </div>
              </template>
              <apexchart
                width="500"
                type="line"
                :options="chartOptions"
                :series="incassatoSeries">
              </apexchart>
            </el-card>
          </el-col>
        </el-row>        
      </el-col>
    </el-row>

  </div>
</template>

<script>
//import Order from '../data/Order.js';
import Firebase from "../firebase.js";
import utils from "../utils.js";
import BillDetail from "../components/BillDetail.vue";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "ContiParcheggiati",
  components: {
    BillDetail,
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
      popularSeries: [
        {
          name: "popular",
          data: [],
        },
      ],
      stats: {
        sospeso: 0,
        contiAperti: 0,
        collection: {}
      }
    };
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
      return amount.toFixed(2);
    },
    loadData: function(range) {
      this.tableData = [];
      if (range) {
        Firebase.db
          .collection("park")
          .where("order.lastModified", "<=", this.daterange[1])
          .where("order.lastModified", ">=", this.daterange[0])
          .orderBy("order.lastModified", "desc")
          .onSnapshot((snapshotChange) => {
            this.docs = [];
            snapshotChange.forEach((doc) => {
              var record = doc.data().order;
              this.docs.push({ id: doc.id, data: record });
            });
            this.handleDocs();
          });
      } else {
        Firebase.db
          .collection("park")
          .orderBy("id")
          .onSnapshot((snapshotChange) => {            
            this.docs = [];
            snapshotChange.forEach((doc) => {
              var area = doc.data();
              var places = area.places;
              for(var n in places) {
                var record = places[n].order;
                if(record.orderList.length > 0) {
                  record.place = {
                    area: {
                      id: area.id,
                      name: area.name
                    },
                    place: places[n].name
                  }
                  this.docs.push({ id: doc.id, data: record });
                }
              }
            });
            this.handleDocs();
          });
      }
    },
    handleDocs: function() {
      this.tableData = [];
      this.vendutoSeries[0].data = [];
      this.incassatoSeries[0].data = [];
      this.popularSeries[0].data = [];
      this.stats.sospeso = 0;
      this.stats.contiAperti = 0;
      this.stats.collection = {};

      for(var j=0; j<=16; j++) {
        this.vendutoSeries[0].data[j] = 0;
        this.incassatoSeries[0].data[j] = 0;
      }

      this.stats.contiAperti = this.docs.length;
      for (var i = 0; i < this.docs.length; i++) {
        this.stats.sospeso += this.docs[i].data.totale;
        this.tableData.push({
          date: utils.toDateTime(this.docs[i].data.lastModified),
          place: this.docs[i].data.place.area.name + " / " + this.docs[i].data.place.place,
          amount: this.docs[i].data.totale.toFixed(2),
        });
        this.collectData(this.docs[i].data.orderList);
      }
      console.log('collectData', this.stats.collection)
      var sortedKeys = this.getSortedKeys(this.stats.collection);
      for(i=0; i<Math.min(20, sortedKeys.length); i++) {
        this.barchartOptions.xaxis.categories[i] = sortedKeys[i];
        this.popularSeries[0].data[i] = this.stats.collection[sortedKeys[i]];
      }
    },
    collectData: function(list) {
      for(var i=0; i<list.length; i++) {
        var d = new Date(list[i].insertTime);
        var h = d.getHours();
        this.vendutoSeries[0].data[h-8]++;
        this.incassatoSeries[0].data[h-8] += list[i].price * list[i].quantity;
        if(list[i].name in this.stats.collection) {
          this.stats.collection[list[i].name] += list[i].quantity;
        } else {
          this.stats.collection[list[i].name] = list[i].quantity;
        }
      }
    },
    getSortedKeys: function(obj) {
      var keys = Object.keys(obj);
      return keys.sort(function(a,b){return obj[b]-obj[a]});
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
.list {
  text-align: left;
}
.box-card {
  margin: 5px;
}
.card-header {
  font-weight: bold;
  color: var(--primary-color);
  text-align: left;
}
.stats-totale {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 2.0em;
  margin: 5px;
}
.stats-amount {
  color: var(--danger-color);
}
</style>
