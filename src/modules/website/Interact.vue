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
      const manifestHTML = lGet(this.manifest, "module.html", "");
      return manifestHTML
        ? "file://" + this.$chaos.path.join(this.currentNode.path, manifestHTML)
        : null;
    },
    currentPathToMHTML() {
      const manifestMHTML = lGet(this.manifest, "module.mhtml", "");
      return manifestMHTML
        ? "file://" +
            this.$chaos.path.join(this.currentNode.path, manifestMHTML)
        : null;
    },
    title() {
      return lGet(this.manifest, "shared.title", "");
    },
    description() {
      return lGet(this.manifest, "shared.description", "");
    },
    favicon() {
      const faviconPath = lGet(this.manifest, "module.favicon", "");
      if (faviconPath) {
        const fullPath = this.$chaos.path.join(
          this.currentNode.path,
          faviconPath
        );
        return this.$chaos.utils.loadToBase64(fullPath);
      }
    }
  },
  methods: {
    openHTML() {
      shell.openExternal(this.currentPathToHTML);
    },
    openMHTML() {
      shell.openExternal(this.currentPathToMHTML);
    },
    openURL() {
      shell.openExternal(this.manifest.module.url);
    }
  }
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
          @click="openMHTML"
          v-if="currentPathToMHTML"
        >
          Open archived web page
        </button>
      </div>
      <!-- info card -->
      <div class="p-4 mb-2 bg-white rounded-md">
        <div class="flex items-center">
          <img :src="favicon" alt="favicon" class="h-5 mr-2" />
          <h1
            class="text-lg cursor-pointer hover:text-gray-700"
            @click="openURL"
          >
            {{ title }}
          </h1>
        </div>
        <p>{{ description }}</p>
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
