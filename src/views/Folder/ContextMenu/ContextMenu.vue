<template>
  <div class="w-56 mt-2 rounded-md shadow-xl">
    <div class="bg-white rounded-md shadow-xs">
      <div class="py-1">
        <!-- open -->
        <a
          @click="openNode"
          class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        >
          <!-- <ListIcon class="mr-2" width="15" /> -->
          <div class="flex items-center">
            <MousePointerIcon class="mr-2" width="15" />
            <span>Open</span>
          </div>
        </a>
        <!-- trash -->
        <a
          @click="trashNode"
          class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        >
          <div class="flex items-center">
            <TrashIcon class="mr-2" width="15" />
            <span>Trash</span>
          </div>
        </a>
        <!-- show in finder -->
        <a
          @click="showNode"
          class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        >
          <div class="flex items-center">
            <ExternalLinkIcon class="mr-2" width="15" />
            <span>Show in Finder</span>
          </div>
        </a>
      </div>
      <div class="border-t border-gray-300"></div>
      <div class="py-1">
        <div
          href="#"
          class="flex items-center justify-between block px-4 py-2 text-sm leading-5 text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        >
          Rename
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EyeIcon from "../../../assets/icons/eye.svg";
import ListIcon from "../../../assets/icons/list.svg";
import GridIcon from "../../../assets/icons/grid.svg";
import TrashIcon from "../../../assets/icons/trash.svg";
import ExternalLinkIcon from "../../../assets/icons/external-link.svg";
import MousePointerIcon from "../../../assets/icons/mouse-pointer.svg";

import { shell } from "../../../backend/common";

export default {
  props: ["node"],
  components: {
    EyeIcon,
    ListIcon,
    GridIcon,
    TrashIcon,
    ExternalLinkIcon,
    MousePointerIcon,
  },
  methods: {
    trashNode() {
      shell.moveItemToTrash(this.node.path);
    },
    showNode() {
      shell.showItemInFolder(this.node.path);
    },
    openNode() {
      this.$events.$emit("explorerNodeClick", this.node);
    },
  },
};
</script>

<style></style>
