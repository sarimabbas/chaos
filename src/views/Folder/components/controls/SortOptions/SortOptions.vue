<template>
  <div
    @keydown.escape="open = false"
    class="relative inline-block text-left"
    v-on-clickaway="away"
  >
    <div>
      <span class="rounded-md shadow-sm">
        <button
          @click="open = !open"
          type="button"
          class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
        >
          Sort
          <ChevronDownIcon width="15" class="ml-2" />
        </button>
      </span>
    </div>
    <div
      v-show="open"
      style=" position: absolute; left: 0"
      class="absolute right-0 w-56 mt-2 origin-top-right rounded-md shadow-xl"
    >
      <div class="bg-white rounded-md shadow-xs">
        <div class="py-1">
          <a
            @click="changeViewHandler('list')"
            class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
          >
            <ListIcon class="mr-2" width="15" />
            <span>List</span>
          </a>
          <a
            @click="changeViewHandler('grid')"
            class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
          >
            <GridIcon class="mr-2" width="15" />
            <span>Grid</span>
          </a>
        </div>
        <div class="border-t border-gray-300"></div>
        <div class="py-1">
          <div
            href="#"
            class="flex items-center justify-between block px-4 py-2 text-sm leading-5 text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
          >
            Separate Chaos
            <toggle-button :width="35" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ListIcon from "@/assets/icons/list.svg";
import GridIcon from "@/assets/icons/grid.svg";
import { ToggleButton } from "vue-js-toggle-button";
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  props: ["changeViewHandler"],
  components: {
    ChevronDownIcon,
    ListIcon,
    GridIcon,
    ToggleButton,
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    away() {
      this.open = false;
    },
  },
};
</script>

<style></style>
