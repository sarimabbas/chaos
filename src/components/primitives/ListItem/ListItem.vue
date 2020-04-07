<script>
export default {
  props: ["click", "node", "title", "description"],
};
</script>

<template>
  <li
    @click="click(node)"
    class="px-2 py-1 my-1 truncate bg-white border-gray-600 rounded-sm cursor-pointer"
  >
    {{ title }}
  </li>
</template>

<style></style>
