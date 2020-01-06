<template>
  <div class="flex items-center justify-center w-full h-full bg-gray-700">
    <div class="text-center text-gray-900 select-none">
      <ButterflyIcon width="100" class="mx-auto fill-current" />
      <h1 class="text-6xl">Chaos</h1>
      <p class="text-sm">
        Open file or folder
        <span class="px-1 ml-2 text-xs bg-gray-400 rounded-sm">CMD + O</span>
      </p>
      <p class="mt-2 text-sm">
        New file with default module
        <span class="px-1 ml-2 text-xs bg-gray-400 rounded-sm">CMD + N</span>
      </p>
    </div>
  </div>
</template>

<script>
import ButterflyIcon from "../assets/icons/butterfly-fill.svg";
export default {
  components: {
    ButterflyIcon
  }
};
</script>

<style>
</style>