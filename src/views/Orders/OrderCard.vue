<template>
   <el-card class="order-card">
      <template #header>
         <div class="order-header">
            <span class="header-place">{{place}}</span>
            <span class="header-time">{{time}}</span>
         </div>
      </template>

      <div class="order-list">
         <ul>
            <li class="item" v-for="item in data.comanda" :key="item.id">
               <div class="item-name">{{item.name}}</div>
               <div class="item-note">{{item.note}}</div>
            </li>
         </ul>
      </div>

      <div class="order-footer">
         <el-button
            size="small"
            type="" plain round
            icon="el-icon-printer"
            @click="printOrder">
            {{$t('generic.print')}}
         </el-button>
         <el-button size="small" type="success" plain round icon="el-icon-check" 
            @click="checkOrder">
            {{$t('generic.action')}}
         </el-button>
      </div>
   </el-card>
</template>
<script>
import utils from "../../utils.js";

export default {
   props: ['data'],
   data() {
      return {
         
      }
   },
   computed: {
      place: function() {
         return this.data.place.area.name + " / " + this.data.place.place;
      },
      time: function() {
         return utils.toLocaleDateTimeString(this.data.timestamp);
      }
   },
   methods: {
      loadOrder: function() {
         console.log(this.data);
      },
      checkOrder: function() {
         this.$emit("checkOrder", this.data.id)
      },
      printOrder: function() {

      },
   },
   mounted() {
      this.loadOrder();
   },
}
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
.header-time {
   float: right;
}
.order-list {
   padding: 10px;
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
	border-bottom: 1px solid #CCC;
   text-align: left;
}
ul li:last-child {
	border-bottom: 0;
}

</style>