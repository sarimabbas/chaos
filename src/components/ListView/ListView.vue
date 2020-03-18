<script>
export default {
  props: ["items", "handleClick"]
};
</script>

<template>
  <ul>
    <li
      v-for="item in items"
      @click="handleClick(item)"
      :key="item.path"
      class="px-2 py-1 my-1 truncate bg-white border-gray-600 rounded-sm cursor-pointer"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<style></style>
