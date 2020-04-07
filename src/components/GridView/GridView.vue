<script>
import File from "../File/File";
export default {
  components: {
    File,
  },
  props: ["nodes"],
};
</script>

<template>
  <div class="grid">
    <File
      v-for="node in nodes"
      :key="node.path"
      :node="node"
      renderAs="grid"
      :renderAtomOnly="true"
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
