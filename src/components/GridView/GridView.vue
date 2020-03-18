<script>
import Card from "../Card/Card";
export default {
  components: {
    Card
  },
  props: ["items", "handleClick"]
};
</script>

<template>
  <div class="grid">
    <Card
      v-for="item in items"
      :key="item.path"
      @click.native="handleClick(item)"
      :description="item.name"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
}
</style>
