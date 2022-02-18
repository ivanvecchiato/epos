<template>
  <el-container>
    <el-aside width="200px">
       <ul>
         <li>
            <span @click="showPaymentsConfig()">{{$t('config.payments')}}</span>
         </li>
         <li>
            <span @click="showOverallConfig()">{{$t('config.settings')}}</span>
         </li>
       </ul>
    </el-aside>
    <el-main>
      <component
         :is="currentContent"
         v-bind="currentProperties"
         :key="randKey()">
      </component>
    </el-main>
  </el-container>   
</template>

<script>
import Payments from './Payments.vue';
import Settings from './Settings.vue';

export default {
   name: 'Configs',
   components: {Payments, Settings},
   data() {
      return {
         currentContent: Payments,
      }
   },
   computed: {
      currentProperties: function() {
        if (this.currentContent == Payments) {
          return null
        } else {
          return null;
        }
      }
   },
   methods: {
      randKey: function () {
         return Number(Math.ceil(Math.random()*100));
      },
      showPaymentsConfig() {
         this.currentContent = Payments;
      },
      showOverallConfig() {
         this.currentContent = Settings;
      }
   },
   mounted() {
      
   },
}
</script>

<style scoped>
ul {
  list-style-type: none;
	list-style: none;
	padding: 0;
	width: 100%;
}
ul li {
   margin: 15px;
	padding: .5em 0;
	border-bottom: 1px solid #CCC;
   text-align: left;
}
ul li:last-child {
	border-bottom: 0;
}

</style>