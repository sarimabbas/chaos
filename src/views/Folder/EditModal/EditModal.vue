<template>
  <div class="p-4">
    <h1 class="text-xl">Edit File</h1>
    <input type="text" v-model="node.name" />
  </div>
</template>

<script>
export default {
  props: ["node"],
};
</script>

<style></style>
