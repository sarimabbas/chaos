<script>
import { get as lGet } from "lodash";
import { remote } from "electron";
const { shell } = remote;

export default {
  props: ["manifest"],
  computed: {
    currentURL() {
      return lGet(this.manifest, "module.url", "");
    },
    currentNode() {
      const node = this.$store.state.views.currentWorkingNode;
      return node;
    },
    currentPathToHTML() {
      return (
        "file://" + this.$chaos.path.join(this.currentNode.path, "page.html")
      );
    },
    currentPathToImage() {
      return (
        "file://" + this.$chaos.path.join(this.currentNode.path, "page.png")
      );
    },
    currentPathToPDF() {
      return this.$chaos.path.join(this.currentNode.path, "page.pdf");
    },
  },
  methods: {
    openPDF() {
      shell.openItem(this.currentPathToPDF);
    },
    openHTML() {
      shell.openExternal(this.currentPathToHTML);
    },
  },
};
</script>

<template>
  <div class="h-full">
    <!-- <h1 class="text-xl">Website View</h1> -->
    <div class="h-full p-4">
      <!-- controls -->
      <div class="flex mb-2">
        <button
          class="relative z-10 flex items-center justify-between block px-2 bg-gray-200 rounded-sm hover:bg-gray-400"
          @click="openPDF"
        >
          Open PDF
        </button>
        <button
          class="relative z-10 flex items-center justify-between block px-2 ml-2 bg-gray-200 rounded-sm hover:bg-gray-400"
          @click="openHTML"
        >
          Open archived web page
        </button>
      </div>
      <!-- live view -->
      <div class="relative w-full h-full overflow-hidden rounded-sm">
        <!-- there seems to be a bug in vue. If i put the first iframe in a DIV
        as well, vue cannot seem to distinguish between both sets and does not
        patch the dom appropriately -->
        <webview
          :src="currentURL"
          class="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>
      <br />
    </div>
  </div>
</template>

<style scoped></style>
