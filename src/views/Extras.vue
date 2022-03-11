<template>
   <div class="extras">
      <input
         class="entry"
         v-model="entry"
         placeholder="posto"/>

      <qr-code
      :text="qrUrl"
      :size="160"></qr-code>

      <el-button size="medium" round
         style="margin:5px">{{$t('qrcode.print')}}</el-button>

   </div>
</template>

<script>
export default {
   name: 'Extras',
   data() {
      return {
         entry: ''
      }
   },
   computed: {
      qrUrl: function() {
         var url = 'http://192.168.1.136:8081/#/' + this.entry;
         console.log('qrUrl', url)
         return url;
      }
   },
   methods: {
   },
   mounted() {
      
   },
}
</script>

<style scoped>
.extras {
   padding: 12px;
   text-align: left;
}
.entry {
   width: 160px;
   font-size: 1.3em;
   margin: 10px 0px 10px 0px;
   padding: 5px;
}
</style>