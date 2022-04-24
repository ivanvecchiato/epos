<template>
  <div class="settings-form">
    <el-form :model="conf" label-width="150px">
      <el-form-item>
        <el-checkbox v-model="allowQuickBill">
          {{ $t("settings.allow-quick-bill") }}
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="printNoteOnBill">
          {{ $t("settings.print-note-bill") }}
        </el-checkbox>
      </el-form-item>

      <el-form-item :label="$t('settings.starting-view')">
        <el-radio-group v-model="startingView">
           <el-radio :label="0">{{$t('settings.starting-view-frontend')}}</el-radio>
           <el-radio :label="1">{{$t('settings.starting-view-bills')}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('settings.product-grid-columns')">
        <el-input-number
           v-model="productGridColumns"
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
import Settings from "@/settings/Settings.js";

export default {
  data() {
    return {
      conf: new Settings()
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
  computed: {
    printNoteOnBill: function() {
      return this.conf.getSettingValue('printNoteOnBill');
    },
    allowQuickBill: function() {
      return this.conf.getSettingValue('allowQuickBill');
    },
    startingView: function() {
      return this.conf.getSettingValue('startingView');
    },
    productGridColumns: function() {
      return this.conf.getSettingValue('productGridColumns');
    },
  },
  methods: {
     handleChangeColumns() {
        console.log(this.conf)
     }
  },
  mounted() {
  },
};
</script>

<style scoped>
.settings-form {
  text-align: left;
}
</style>