<template>
  <div class="details">
    <el-row :gutter="20" align="middle">
      <el-col :span="4">
        {{$t('bill.quantity')}}
      </el-col>
      <el-col :span="6">
        <el-input-number
          v-model="item.quantity"
          size="small"
          :min="1"
          :max="99">
        </el-input-number>
      </el-col>
      <el-col :span="2">
        <el-button
          size="small"
          type="danger"
          icon="el-icon-delete"
          circle plain
          @click="deleteItem"></el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" align="middle">
      <el-col :span="4">
        {{$t('product.price')}}
      </el-col>
      <el-col :span="4">
        <el-input v-model="item.price" ></el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20" align="middle">
      <el-col :span="4">
        {{$t('product.note')}}
      </el-col>
      <el-col :span="12">
        <el-input type="textarea" v-model="item.note" ></el-input>
      </el-col>
    </el-row>

    <el-button type="primary" plain round class="block" @click="saveModifications">{{$t('generic.save')}}</el-button>
  </div>
</template>

<script>

export default {
  name: "CartItemDetail",
  props: ["data"],
  data() {
    return {
      item: {}
    };
  },
  computed: {
  },
  methods: {
    deleteItem: function() {
      this.$emit('onDelete');
    },
    saveModifications: function() {
      this.$emit('onChange', this.item);
    }
  },
  mounted() {
    this.item = Object.assign({}, this.data);
  },
};
</script>

<style scoped>
.details {
  text-align: left;
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
.block {
  width: 100%;
  font-weight: bold;
}
</style>
