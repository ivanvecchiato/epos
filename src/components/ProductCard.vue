<template>
  <div class="card red">
    <span class="product-name">{{prod.name}}</span>
  </div>

</template>

<script>

export default {
  name: 'ProductCard',
  props: ['prod'],
  data() {
    return {
      product: {}
    }
  },
  mounted() {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  border: 1px solid lightgray;
  padding: .5rem;
  border-radius: 0px;
  max-height: 80px;
  transition: 0.4s;
  justify-content: center;
}
.product-name {
  font-size: 12px;
  margin: auto;
}
.card:hover {
  box-shadow: 3px 3px 16px 0 rgba(0,0,0,0.1);
  transform: scale(1.02);
}
.cyan {
    border-top: 3px solid var(--cyan);
}
.red {
    border-top: 3px solid var(--red);
}
.blue {
    border-top: 3px solid var(--blue);
}
.orange {
    border-top: 3px solid var(--orange);
}

</style>
