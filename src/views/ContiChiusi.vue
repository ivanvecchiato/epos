<template>
  <div>
    <el-row>
      <el-col :span="12">

        <div class="stat-card">
          <el-table :data="tableData" height="400" style="width: 100%">
            <el-table-column prop="progr" :label="$t('docs.document')" width="150">
            </el-table-column>
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

        <div class="stat-card">
          <div class="stat-card-title">
            <span>{{$t('stats.most_popular')}}</span>
          </div>
          <apexchart
            width="500"
            type="bar"
            :options="barchartOptions"
            :series="docsPopularSeries">
          </apexchart>
        </div>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="12">
            <div class="stat-card">
              <span class="stats-totale">{{$t('stats.docs')}}</span>
              <span class="stats-totale stats-amount">{{docsStats.docEmessi.numero}}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="stat-card">
              <span class="stats-totale">{{$t('stats.total')}}</span>
              <span class="stats-totale stats-amount">{{formatAmount(docsStats.docEmessi.totale)}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">

            <div class="stat-card">
              <div class="stat-card-title">
                <span>{{$t('stats.quantity')}}</span>
              </div>
              <apexchart
                width="500"
                type="line"
                :options="docsChartOptions"
                :series="docsVendutoSeries">
              </apexchart>
            </div>

            <div class="stat-card">
              <div class="stat-card-title">
                <span>{{$t('stats.value')}}</span>
              </div>
              <apexchart
                width="500"
                type="line"
                :options="docsChartOptions"
                :series="docsIncassatoSeries">
              </apexchart>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog
      :title="$t('bill.details')"
      v-model="detailVisible"
      destroy-on-close
      width="70%">
      <bill-detail :data="currentBill" :key="randKey" />
    </el-dialog>

  </div>
</template>

<script>
//import Conto from '../data/Conto.js';
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
        docEmessi: {
          numero: 0,
          totale: 0
        },
        collection: {},
        popular: {}
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
            record.id = doc.id;
            this.docs.push(record);
          });
          this.handleDocs();
        });
    },
    handleDocs: function() {
      this.tableData = [];
      this.docsPopularSeries[0].data = [];
      this.docsVendutoSeries[0].data = [];
      this.docsIncassatoSeries[0].data = [];
      this.docsStats.docEmessi.numero = this.docs.length;
      this.docsStats.docEmessi.totale = 0;
      this.docsStats.collection = {};

      for(var j=0; j<=16; j++) {
        this.docsVendutoSeries[0].data[j] = 0;
        this.docsIncassatoSeries[0].data[j] = 0;
      }

      for (var i = 0; i < this.docs.length; i++) {
        var source = "cassa";
        if(this.docs[i].place != undefined) {
          source = this.docs[i].place.area.name + " / " + this.docs[i].place.name;
        }
        this.tableData.push({
          progr: this.docs[i].progressivoFiscale + "/" + this.docs[i].chiusuraFiscale,
          date: utils.toDateTime(this.docs[i].lastModified),
          place: source,
          amount: this.docs[i].totale.toFixed(2),
        });
        this.docsStats.docEmessi.totale += this.docs[i].totale;
        this.collectData(this.docs[i].orderList);
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
        if(list[i].id in this.docsStats.popular) {
          this.docsStats.popular[list[i].id].quantity += list[i].quantity;
        } else {
          this.docsStats.popular[list[i].id] = list[i];
          this.docsStats.popular[list[i].id].quantity = 1;
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
</style>
