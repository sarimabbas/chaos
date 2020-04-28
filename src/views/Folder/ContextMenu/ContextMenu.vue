<template>
  <div class="w-56 mt-2 rounded-md shadow-xl">
    <div class="bg-white rounded-md shadow-xs">
      <div class="py-1">
        <a
          class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        >
          <!-- <ListIcon class="mr-2" width="15" /> -->
          <span>Delete</span>
        </a>
        <a
          class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        >
          <!-- <GridIcon class="mr-2" width="15" /> -->
          <span>Duplicate</span>
        </a>
      </div>
      <div class="border-t border-gray-300"></div>
      <div class="py-1">
        <div
          href="#"
          class="flex items-center justify-between block px-4 py-2 text-sm leading-5 text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        >Rename</div>
      </div>
    </div>
  </div>
</template>

<script>
import EyeIcon from "../../../assets/icons/eye.svg";
import ListIcon from "../../../assets/icons/list.svg";
import GridIcon from "../../../assets/icons/grid.svg";

export default {
  components: {
    EyeIcon,
    ListIcon,
    GridIcon
  }
};
</script>

<style>
</style>
