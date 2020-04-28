<script>
import EyeIcon from "../../../assets/icons/eye.svg";
import { remote } from "electron";
const currWindow = remote.getCurrentWindow();
export default {
  components: {
    EyeIcon,
  },
  props: ["click", "node", "title", "description", "icon"],
  methods: {
    quickLook(path) {
      currWindow.previewFile(path);
    },
  },
};
</script>

<template>
  <li
    class="flex items-center justify-between px-2 py-2 my-1 truncate bg-white border-gray-600 rounded-sm "
  >
    <div class="flex items-center cursor-pointer" @click="click(node)">
      <img :src="icon" class="h-6" />
      <span class="ml-2">{{ node.name }}</span>
    </div>
    <div class="flex items-center">
      <EyeIcon
        width="20"
        @click="quickLook(node.path)"
        class="cursor-pointer"
      />
    </div>
  </li>
</template>

<style></style>
