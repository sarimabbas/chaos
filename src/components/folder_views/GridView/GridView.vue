<script>
import Card from "../../primitives/Card/Card";
import mixin from "../mixin";
export default {
  components: {
    Card,
  },
  mixins: [mixin],
};
</script>

<template>
  <div class="grid">
    <Card
      v-for="node in nodes"
      :key="node.path"
      :title="title(node)"
      :description="description(node)"
      :image="image(node)"
      @click.native="handleClick(node)"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
}
</style>
