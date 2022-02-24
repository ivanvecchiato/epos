<template>
  <div class="selector" v-if="loaded == true">
    <div
      class="color-button"
      :style="getBgc(item)"
      v-for="item, index in colors" :key="index"
      :class="{ active : active_el == index }"
      @click="selectColor(item, index)"
    />
  </div>
</template>

<script>

export default {
  name: "ColorSelector",
  props: ['initialColor'],
  data() {
    return {
      colors: ['#00AAE6','#2B73FD','#6F4EFF','#9F41F1','#8D6E63','#DC5CDC','#EA489C','#FF83A8',
      '#D70050','#EB3D34','#F98E2D','#F6CD2D','#93CB00','#61D16F','#39C5AB','#87989F'],
      bgc: {
        backgroundColor: '#fff'
      },
      active_el: -1,
      loaded: false
    };
  },
  methods: {
    getBgc: function(color) {
      if(color != '') {
        this.bgc.backgroundColor = color;
      }
      return this.bgc;
    },
    selectColor: function(color, index) {
      this.active_el = Number(index);
      this.$emit('colorPicked', color);
    }
  },
  mounted() {
    for(var i=0; i<this.colors.length; i++) {
      if(this.initialColor == this.colors[i]) {
        this.active_el = i;
        break;
      }
    }
    this.loaded = true;
  },
};
</script>

<style scoped>
.selector {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-row-gap: 8px;
  grid-column-gap: 2px;
  padding: 10px;
}
.color-button {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  outline: solid 2px #fff;
  outline-offset: 1px;
}
.active {
  outline: solid 2px rgb(109, 109, 109)
}
</style>
