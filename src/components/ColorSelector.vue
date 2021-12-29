<template>
  <div class="selector">
    <div
      class="color-button"
      :style="getBgc(item)"
      v-for="item in colors"
      :key="item"
      @click="selectColor(item)"
    />
  </div>
</template>

<script>

export default {
  name: "ColorSelector",
  props: ["data"],
  data() {
    return {
      colors: ['#00AAE6','#2B73FD','#6F4EFF','#9F41F1','#9E2FBD','#DC5CDC','#EA489C','#FF83A8',
      '#D70050','#EB3D34','#F98E2D','#F6CD2D','#93CB00','#61D16F','#39C5AB','#87989F'],
      colorString: '',
      bgc: {
        backgroundColor: '#fff'
      }
    };
  },
  methods: {
    getBgc: function(color) {
      if(color != '') {
        this.bgc.backgroundColor = color;
      }
      return this.bgc;
    },
    selectColor: function(color) {
      this.colorString = color;
      this.$emit('colorPicked', color);
    }
  },
  mounted() {
  },
};
</script>

<style scoped>
.selector {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-row-gap: 4px;
  grid-column-gap: 2px;
  padding: 10px;
}
.color-button {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}
</style>
