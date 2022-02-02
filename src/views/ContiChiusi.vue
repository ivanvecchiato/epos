<template>
  <div>
    <el-row>
      <el-col :span="12">

        <div class="list">
          <el-table :data="tableData" height="400" style="width: 100%">
            <el-table-column prop="date" :label="$t('generic.date')" width="150">
            </el-table-column>
            <el-table-column prop="place" :label="$t('bill.source')" width="150">
            </el-table-column>
            <el-table-column prop="amount" :label="$t('bill.amount')" width="150">
            </el-table-column>
            <el-table-column label="" width="100">
              <template #default="scope">
                <el-button
                  icon="el-icon-view"
                  size="mini"
                  @click="handleDetail(scope.$index, scope.row)">
                </el-button>
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
            :series="docsPopularSeries">
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
              <span class="stats-totale stats-amount">{{formatAmount(docsStats.sospeso)}}</span>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card" shadow="hover">
              <span class="stats-totale">{{$t('stats.opened_bills')}}</span>
              <span class="stats-totale stats-amount">{{docsStats.contiAperti}}</span>
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
                :options="docsChartOptions"
                :series="docsVendutoSeries">
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
                :options="docsChartOptions"
                :series="docsIncassatoSeries">
              </apexchart>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Conto from '../data/Conto.js';
import Firebase from "../firebase.js";
import utils from "../utils.js";
import BillDetail from "../components/BillDetail.vue";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "ContiChiusi",
  components: { BillDetail,
    apexchart: VueApexCharts, },
  data() {
    return {
      detailVisible: false,
      tableData: [],
      currentBill: null,
      docs: [],
      docsChartOptions: {
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
      docsVendutoSeries: [
        {
          name: "venduto",
          data: [],
        }
      ],
      docsIncassatoSeries: [
        {
          name: "incassato",
          data: [],
        },
      ],
      docsPopularSeries: [
        {
          name: "popular",
          data: [],
        },
      ],
      docsStats: {
        sospeso: 0,
        contiAperti: 0,
        collection: {}
      }
    };
  },
  methods: {
    formatAmount: function(amount) {
      return amount.toFixed(2);
    },
    loadDefaultData: function() {
      Firebase.db
        .collection("conti")
        //.where("chiusura", "==", 0)
        .orderBy("lastModified", "desc")
        .onSnapshot((snapshotChange) => {
          this.docs = [];
          snapshotChange.forEach((doc) => {
            var record = doc.data();
            this.docs.push({ id: doc.id, data: record });
          });
          this.handleDocs();
        });
    },
    handleDocs: function() {
      this.tableData = [];
      this.docsPopularSeries[0].data = [];
      this.docsVendutoSeries[0].data = [];
      this.docsIncassatoSeries[0].data = [];
      this.docsStats.sospeso = 0;
      this.docsStats.contiAperti = 0;
      this.docsStats.collection = {};

      for(var j=0; j<=16; j++) {
        this.docsVendutoSeries[0].data[j] = 0;
        this.docsIncassatoSeries[0].data[j] = 0;
      }

      for (var i = 0; i < this.docs.length; i++) {
        var source = "cassa";
        if(this.docs[i].data.place != undefined) {
          source = this.docs[i].data.place.area.name + " / " + this.docs[i].data.place.place;
        }
        this.tableData.push({
          date: utils.toDateTime(this.docs[i].data.lastModified),
          place: source,
          amount: this.docs[i].data.totale.toFixed(2),
        });
        this.collectData(this.docs[i].data.orderList);
      }
      console.log('collectData', this.docsStats.collection)
      var sortedKeys = this.getSortedKeys(this.docsStats.collection);
      for(i=0; i<Math.min(20, sortedKeys.length); i++) {
        this.barchartOptions.xaxis.categories[i] = sortedKeys[i];
        this.docsPopularSeries[0].data[i] = this.docsStats.collection[sortedKeys[i]];
      }
    },
    collectData: function(list) {
      for(var i=0; i<list.length; i++) {
        var d = new Date(list[i].insertTime);
        var h = d.getHours();
        this.docsVendutoSeries[0].data[h-8]++;
        this.docsIncassatoSeries[0].data[h-8] += list[i].price * list[i].quantity;
        if(list[i].name in this.docsStats.collection) {
          this.docsStats.collection[list[i].name] += list[i].quantity;
        } else {
          this.docsStats.collection[list[i].name] = list[i].quantity;
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
      this.currentBill = new Conto;
      this.currentBill.fillData(this.docs[index]);
      this.currentBill.groupByItems();
      this.detailVisible = true;
    },
    initGraphOptions: function() {
      for(var i=8; i<=24; i++) {
        this.docsChartOptions.xaxis.categories[i-8] = i;
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
