<template>
  <div class="settings-form">
    <el-form :model="conf" label-width="150px">
      <el-form-item>
        <el-checkbox v-model="conf.allowQuickBill.value.value">
          {{ $t("settings.allow-quick-bill") }}
        </el-checkbox>
      </el-form-item>

      <el-form-item :label="$t('settings.starting-view')">
        <el-radio-group v-model="conf.startingView.value.value">
           <el-radio :label="0">{{$t('settings.starting-view-frontend')}}</el-radio>
           <el-radio :label="1">{{$t('settings.starting-view-bills')}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('settings.product-grid-columns')">
        <el-input-number
           v-model="conf.productGridColumns.value.value"
           @change="handleChangeColumns"
           :min="2"
           :max="10">
        </el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//import Firebase from "../../firebase";
import settings from './settings'

export default {
  data() {
    return {
       conf: settings
    };
  },
  watch: {
    conf: {
     // eslint-disable-next-line no-unused-vars
      handler(newConf, oldConf) {
         localStorage.setItem('settings', JSON.stringify(newConf))
      },
      deep: true
    }
  },
  methods: {
     handleChangeColumns() {
        console.log(this.conf)
     }
  },
  mounted() {
     var param = JSON.parse(localStorage.getItem('settings'));
     if(param != null) {
        this.conf = param;
     }
  },
};
</script>

<style scoped>
.settings-form {
  text-align: left;
}
</style>