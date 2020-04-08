<script>
export default {
  props: ["click", "node", "title", "description", "icon"],
};
</script>

<template>
  <li
    @click="click(node)"
    class="flex items-center px-2 py-1 my-1 truncate bg-white border-gray-600 rounded-sm cursor-pointer"
  >
    <img :src="icon" /><span class="ml-2">{{ title }}</span>
  </li>
</template>

<style></style>
