<template>
  <el-container>
    <el-aside width="200px">
       <ul>
          <li>
             <el-button type="text" @click="showPaymentsConfig()">{{$t('config.payments')}}</el-button>
          </li>
       </ul>
    </el-aside>
    <el-main>Main</el-main>
  </el-container>   
</template>

<script>
export default {
   data() {
      return {
         
      }
   },
   methods: {
      showPaymentsConfig() {
         
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