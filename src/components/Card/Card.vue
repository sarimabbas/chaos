<script>
export default {
  props: ["title", "description"]
};
</script>

<template>
  <div class="max-w-sm overflow-hidden bg-white rounded shadow-lg">
    <!-- <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains" /> -->
    <div class="px-6 py-4">
      <div class="mb-2 text-xl font-bold">{{ title }}</div>
      <p class="text-base text-gray-700">
        {{ description }}
      </p>
    </div>
    <div class="px-6 py-4">
      <span
        class="inline-block px-3 py-1 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
        >#photography</span
      >
      <span
        class="inline-block px-3 py-1 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
        >#travel</span
      >
      <span
        class="inline-block px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
        >#winter</span
      >
    </div>
  </div>
</template>

<style></style>
