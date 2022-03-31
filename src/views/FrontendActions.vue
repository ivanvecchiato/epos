<template>
  <div class="actions">
    <div>
      <el-button type="danger" @click="zReport">chiusura giornaliera</el-button>
    </div>
  </div>
</template>

<script>
//import Firebase from "../firebase.js";
import printf from "../fiscalprinter/printf.js"

export default {
  name: "FrontendActions",
  components: {},
  data() {
    return {
    };
  },
  methods: {
    testPrintf() {
      printf.getStatus((resp) => {
        if(resp.result == 'ok') {
          console.log('testPrintf', resp.data)
        }
      });
    },
    zReport() {
      this.$confirm(
        this.$t('cashier.zreport-confirm'),
        this.$t('cashier.zreport'),
        {
          confirmButtonText: this.$t("generic.ok"),
          cancelButtonText: this.$t("generic.cancel"),
          type: 'warning',
        }
      )
      .then(() => {
        this.currentPlace = null;
        this.conto.clear();
        this.$message({
          type: 'success',
          message: this.$t('cashier.zreport-done'),
        })
      })
      .catch(() => {
      })
      printf.chiusuraGiornaliera((resp => {
        console.log('chiusuraGiornaliera', resp)
      }));
    }
  },
  mounted() {
    this.testPrintf();
  },
};
</script>

<style scoped>
.actions {
  padding: 4px;
  overflow: scroll;
}
.orders span {
   float: left;
   clear: left;
}
</style>
