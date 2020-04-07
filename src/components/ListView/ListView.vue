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
  <ul>
    <File v-for="node in nodes" :key="node.path" renderAs="list" :node="node" />
  </ul>
</template>

<style></style>
