<template>
  <div class="details">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="bill-details">
          <h2 class="intestazione">
            {{getIntestazioneConto()}}
          </h2>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column
              prop="quantity"
              :label="$t('bill.quantity')"
              width="100">
            </el-table-column>
            <el-table-column
              prop="product"
              :label="$t('bill.product')"
              width="300">
              <template #default="scope">
                <div class="product">{{scope.row.product}}</div>
                <div class="note">{{scope.row.note}}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('bill.amount')"
              width="150">
              <template #default="scope">
                <div class="amount">{{scope.row.amount}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="totale">{{ getTotale }}</div>
      </el-col>
      <el-col :span="8" v-if="data.customer != null">
        <customer-detail :data="data.customer"></customer-detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CustomerDetail from "./CustomerDetail.vue";
import Conto from '../data/Conto.js';

export default {
  name: "BillDetail",
  props: ["data"],
  data() {
    return {
      bill: null,
      tableData: [],
    };
  },
  components: { CustomerDetail },
  computed: {
    getTotale() {
      return this.$t("bill.total") + ": " + this.data.totale.toFixed(2);
    },
  },
  methods: {
    getIntestazioneConto() {
      var intest = this.$t('bill.bill') + " ";
      console.log('getIntestazioneConto', this.data);
      if(this.data.place == undefined) {
        intest += "Cassa";
      } else {
        intest += this.data.place.area.name + " / " + this.data.place.name
      }
      return intest;
    },
    handleDetails: function() {
      this.tableData = [];
      this.bill = new Conto;
      this.bill.fillData(this.data);
      var items = this.bill.groupByItems();

      for (var i = 0; i < items.length; i++) {
        if(items[i].status != -100) {
          this.tableData.push({
            quantity: items[i].quantity,
            product: items[i].name,
            note: items[i].note,
            amount: (items[i].quantity * items[i].price).toFixed(2),
          });
        }
      }
    },
  },
  mounted() {
    this.handleDetails();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.details {
  text-align: left;
}
.bill-details {
  padding: 0.5rem;
  overflow: scroll;
}
.totale {
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.2em;
}
.product {
  color: var(--primary-color);
  font-weight: bold;
}
.product-null {
  color: var(--info-color);
  text-decoration: line-through;
  font-weight: bold;
}
.note {
  font-size: 0.8em;
}
.amount {
  color: var(--secondary-color);
  font-weight: bold;
}
.intestazione {
  color: var(--primary-color);
}
</style>
