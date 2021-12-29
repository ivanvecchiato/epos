<template>
  <div style="text-align: center">
    <span class="input">{{input}}</span>
  <div class="keypad">
    <el-button
      v-for="key in keys"
      :key="key"
      @click="press(key)"
      type="primary" plain>
        {{ key }}
    </el-button>
  </div>
  </div>
</template>

<script>

export default {
  name: "NumericKeypad",
  props: {
    showInput: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      input: '',
      keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.', 'C'],
    };
  },
  components: { },
  computed: {
  },
  methods: {
    press: function(key) {
      if(key == 'C')
        this.input = ''
      else
        this.input += key;
      this.$emit('inputChange', this.input);
    }
  },
  mounted() {
  },
};
</script>

<style scoped>
.keypad {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-gap: 10px;
  margin: 10px;
}
.input {
  border: 1px solid lightgray;
  display: block;
  width: 200px;
  height: 25px;
  font-weight: bold;
  font-size: 1.2em;
  border-radius: 8px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
