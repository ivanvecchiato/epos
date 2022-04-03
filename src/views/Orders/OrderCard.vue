<template>
  <el-card class="order-card">
    <template #header>
      <div class="order-header">
        <span class="header-place">{{ place }}</span>
        <span class="header-time">{{ time }}</span>
      </div>
    </template>

    <div class="order-list">
      <span class="order-operator">{{ data.operator.name }}</span>
      <span class="order-quantity">{{ quantity }}&nbsp;{{ $t("product.products") }}</span>
      <ul>
        <li class="item" v-for="item in comandaToBePrinted" :key="item.id">
          <div class="item-name">{{ item.quantity }} {{ item.name }}</div>
          <div v-if="hasDetails(item)" class="item-details">{{ getItemDetails(item) }}</div>
          <div class="item-note">{{ item.note }}</div>
        </li>
      </ul>
    </div>

    <div class="order-footer">
      <el-button
        size="small"
        type=""
        plain
        round
        icon="el-icon-printer"
        @click="printOrder">
        {{ $t("generic.print") }}
      </el-button>
      <el-button
        size="small"
        type="success"
        plain
        round
        icon="el-icon-check"
        @click="checkOrder">
        {{ $t("generic.action") }}
      </el-button>
    </div>
  </el-card>
</template>
<script>
import utils from "../../utils.js";
import Document from "@/documents/Document.js";
import escposprinter from "@/escposprinter/escposprinter.js";

export default {
  props: ["data", "printable"],
  data() {
    return {
      comandaToBePrinted: [],
    };
  },
  computed: {
    place: function () {
      return this.data.place.area.name + " / " + this.data.place.name;
    },
    time: function () {
      return utils.toLocaleDateTimeString(this.data.timestamp);
    },
    quantity: function () {
      return this.data.comanda.length;
    },
  },
  methods: {
    getItemDetails: function(item) {
      if(item.components == undefined) return '';
      if(item.components.length == 0) return '';
      
      var details = ''
      for(var i=0; i<item.components.length; i++) {
        if(i > 0) details += '; ';
        details += item.components[i].name;
      }
      return details;
    },
    hasDetails: function(item) {
      return (item.type == 1 || item.type == 3);
    },
    addToComanda(item) {
      var inserted = false;
      for (var i = 0; i < this.comandaToBePrinted.length; i++) {
        var c = this.comandaToBePrinted[i];

        var noteCriteria = true;
        var variantCriteria = true;
        if (item.note == undefined && c.note == undefined) {
          noteCriteria = true;
        } else {
          noteCriteria = item.note == c.note;
          variantCriteria = utils.arrayCompare(item.modifiers, c.modifiers);
        }

        if (item.id === c.id && noteCriteria && variantCriteria) {
          c.quantity++;
          inserted = true;
          break;
        }
      }

      if (!inserted) {
        item.quantity = 1;
        this.comandaToBePrinted.push(Object.assign({}, item));
      }
    },
    loadOrder: function () {
      console.log("loadOrder", this.data);
      for (var i = 0; i < this.data.comanda.length; i++) {
        var areas = this.data.comanda[i].productionAreas;
        if (areas == undefined) continue;
        for (var j = 0; j < this.data.comanda[i].productionAreas.length; j++) {
          if (this.data.comanda[i].productionAreas[j].id == this.printable) {
            this.addToComanda(this.data.comanda[i]);
          }
        }
      }
      console.log("loadOrder", this.comandaToBePrinted);
    },
    checkOrder: function () {
      this.$emit("checkOrder", this.data.id);
    },
    printOrder: function () {
      var doc = new Document();
      doc.comanda(this.time, this.place, this.data.operator.name, this.comandaToBePrinted);
      escposprinter.stampa(doc);
    },
  },
  mounted() {
    this.loadOrder();
  },
};
</script>

<style scoped>
.order-card {
  overflow: scroll;
  font-size: 1.3em;
}
.order-header {
  text-align: left;
  font-weight: bold;
  padding: 10px;
  color: var(--primary-color);
}
.item-note {
  font-size: 0.7em;
  color: var(--danger-color);
}
.item-details {
  font-size: 0.7em;
  color: var(--danger-color);
}
.header-time {
  float: right;
}
.order-list {
  padding: 10px;
  text-align: left;
}
.order-footer {
  margin-top: 10px;
  line-height: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
ul {
  list-style: circle outside none;
  padding: 0;
  width: 100%;
}
ul li {
  margin: 10px;
  padding: 0 0;
  border-bottom: 1px solid #ccc;
  text-align: left;
}
ul li:last-child {
  border-bottom: 0;
}
.order-operator {
  font-size: 0.7em;
  min-width: 90px;
  color: var(--primary-color);
  border: solid 1px var(--primary-color);
  border-radius: 4px;
  background: #667acc20;
  padding: 1px 4px;
}
.order-quantity {
  font-size: 0.7em;
  min-width: 90px;
  color: var(--danger-color);
  border: solid 1px var(--danger-color);
  border-radius: 4px;
  background: #fc6a8220;
  padding: 1px 4px;
  margin-left: 10px;
}
</style>