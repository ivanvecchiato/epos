<template>
  <div class="card">
    <p class="customer-name">
      <span><i class="el-icon-user"></i>&nbsp;{{ data.firstName }}</span>
      <span>&nbsp;</span>
      <span>{{ data.lastName }}</span>
    </p>
    <div class="customer-address">
      <span
        ><i class="el-icon-location-information"></i>&nbsp;{{
          data.address.address
        }}</span
      >
      <span>&nbsp;</span>
      <span>{{ data.address.zip }}</span>
      <span>&nbsp;</span>
      <p>{{ data.address.city }}</p>
    </div>
    <hr />
    <div class="customer-contact">
      <p><i class="el-icon-phone"></i>&nbsp;{{ data.contact.phone }}</p>
      <p>
        <i class="el-icon-chat-line-round"></i>&nbsp;{{ data.contact.email }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomerDetail",
  props: ["data"],
  data() {
    return {
      product: {},
    };
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  border: 1px solid lightgray;
  padding: 1em;
  border-radius: 8px;
}
.customer-name {
  font-size: 15px;
  font-weight: bold;
}
</style>
