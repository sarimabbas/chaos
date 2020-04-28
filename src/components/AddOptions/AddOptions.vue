<template>
  <div @keydown.escape="open = false" class="relative inline-block text-left">
    <div>
      <span class="rounded-md shadow-sm">
        <button
          @click="open = !open"
          type="button"
          class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
        >
          Add
          <PlusIcon width="15" class="ml-2" />
        </button>
      </span>
    </div>
    <div
      v-show="open"
      style="z-index: 2; position: absolute;"
      class="absolute right-0 w-40 mt-2 origin-top-right rounded-md shadow-xl"
    >
      <div class="bg-white rounded-md shadow-xs">
        <div class="py-1">
          <a
            @click="showWebsiteAdd"
            class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
          >
            <CloudIcon class="mr-2" width="15" />
            <span>Website</span>
          </a>
          <a
            class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
          >
            <PenIcon class="mr-2" width="15" />
            <span>Note</span>
          </a>
          <a
            class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
          >
            <FolderIcon class="mr-2" width="15" />
            <span>Folder</span>
          </a>
        </div>
      </div>
    </div>
    <modal name="add-modal" height="auto" :scrollable="true" :adaptive="true">
      <WebsiteAdd />
    </modal>
  </div>
</template>

<script>
import PlusIcon from "../../assets/icons/plus.svg";
import FolderIcon from "../../assets/icons/folder.svg";
import CloudIcon from "../../assets/icons/cloud.svg";
import PenIcon from "../../assets/icons/pen.svg";
import WebsiteAdd from "../../modules/website/Add";
import { ToggleButton } from "vue-js-toggle-button";
export default {
  components: {
    FolderIcon,
    PlusIcon,
    CloudIcon,
    PenIcon,
    ToggleButton,
    WebsiteAdd,
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    showWebsiteAdd() {
      this.$modal.show("add-modal");
    },
  },
};
</script>

<style></style>
