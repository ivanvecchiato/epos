<template>
  <div style="text-align: center">

  <div class="discount">
    <div class="starting-amount">
      {{$t('bill.total')}} &nbsp; {{amount}}
    </div>
    <div class="discount-type">
      <el-radio-group v-model="discount.type" size="medium" @change="changeDiscountType">
        <el-radio-button :label="$t('generic.cash')"></el-radio-button>
        <el-radio-button :label="$t('generic.percent')"></el-radio-button>
      </el-radio-group>
    </div>

    <numeric-keypad
      :amount="amount"
      @inputChange="inputChange">
    </numeric-keypad>

    <div class="result">
      {{$t('bill.discount')}} &nbsp; {{discount.value}}
    </div>

    <el-button type="success" class="block" @click="applyDiscount">
      {{$t('bill.apply_discount')}}
    </el-button>
  </div>
  </div>
</template>

<script>
import NumericKeypad from "./NumericKeypad.vue";

export default {
  name: "DiscountWidget",
  props: ["amount"],
  data() {
    return {
      discount: {
        type: this.$t('generic.cash'),
        value: 0
      },
    }
  },
  components: { NumericKeypad },
  computed: {
  },
  methods: {
    inputChange: function (inp) {
      if(this.discount.type == this.$t('generic.percent')) {
        var rate = Number(inp);
        this.discount.rate = rate;
        this.discount.value = this.amount * rate /100;
      } else {
        this.discount.value = Number(inp);
        this.discount.rate = (this.discount.value * 100 / this.amount).toFixed(2);
      }
    },
    applyDiscount: function() {
      this.$emit("applyDiscount", this.discount);
    },
    changeDiscountType: function(newValue) {
      console.log('changeDiscountType', newValue);
    }
  },
  mounted() {
  },
};
</script>

<style scoped>
.discount {
  text-align: left;
}
.starting-amount {
  margin: 10px;
  font-size: 1.4em;
  font-weight: bold;
  color: var(--info-color);
}
.discount-type {
  margin: 10px;
}
.result {
  font-size: 2.0em;
  margin: 10px;
  font-weight: bold;
}
.block {
  width: 100%;
  font-weight: bold;
}
</style>
