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
        <!-- edit -->
        <a
          @click="editNode"
          class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        >
          <div class="flex items-center">
            <EditLineIcon class="mr-2" width="15" />
            <span>Edit</span>
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
        <!-- preview -->
        <a
          @click="previewNode"
          class="flex items-center block px-4 py-2 text-sm leading-5 text-gray-700 cursor-pointer hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
        >
          <div class="flex items-center">
            <EyeIcon class="mr-2" width="15" />
            <span>Preview</span>
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
    </div>
  </div>
</template>

<script>
import TrashIcon from "../../../assets/icons/trash.svg";
import ExternalLinkIcon from "../../../assets/icons/external-link.svg";
import MousePointerIcon from "../../../assets/icons/mouse-pointer.svg";
import EditLineIcon from "../../../assets/icons/edit-line.svg";
import EyeIcon from "../../../assets/icons/eye.svg";

import { shell, remote } from "../../../backend/common";
const currWindow = remote.getCurrentWindow();

export default {
  props: ["node"],
  components: {
    TrashIcon,
    ExternalLinkIcon,
    MousePointerIcon,
    EditLineIcon,
    EyeIcon,
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
    editNode() {
      this.$events.$emit("showEditModal", this.node);
    },
    previewNode() {
      currWindow.previewFile(this.node.path);
    },
  },
};
</script>

<style></style>
