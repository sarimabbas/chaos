<script>
export default {};
</script>

<template>
  <div class="p-4">
    <p class="mb-1 text-xs font-bold tracking-widest text-gray-300 uppercase">
      Choose mode
    </p>
    <!-- traditional mode -->
    <button
      class="inline-flex items-center px-2 py-1 text-sm text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
    >
      <!-- <svg
        class="w-4 h-4 mr-2 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
      </svg> -->
      <span>File Tree</span>
    </button>
    <!-- tag tree mode -->
    <button
      class="inline-flex items-center px-2 py-1 ml-2 text-sm text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
    >
      <!-- <svg
        class="w-4 h-4 mr-2 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
      </svg> -->
      <span>Tag Tree</span>
    </button>
  </div>
</template>

<style></style>
