
<script>
import SearchIcon from "../../assets/icons/search.svg";
export default {
  components: {
    SearchIcon
  }
};
</script>


<template>
  <div class="h-32">
    <div class="mt-1 text-center ui-help-text">Search Context</div>
    <div class="mx-2 mt-1 mb-2">
      <input
        class="w-full px-2 py-1 text-xs placeholder-gray-700 bg-white border border-gray-300 rounded-sm appearance-none focus:outline-none focus:shadow-outline"
        type="email"
        placeholder="Search for a file or folder..."
      />
    </div>

    <div class="flex items-center justify-between px-1 py-1 bg-gray-800">
      <span class="text-xs font-bold tracking-widest text-gray-400 uppercase">Results</span>
    </div>
  </div>
</template>


<style>
</style>