<script>
import { get as lGet } from "lodash";
import Toggle from "./components/Toggle/Toggle";
export default {
  props: ["manifest"],
  components: {
    Toggle
  },
  data() {
    return {
      offlineDom: "",
      liveToggleState: false
    };
  },
  watch: {
    currentPath: {
      immediate: true,
      handler: async function(newVal, oldVal) {
        // reset local props (just in case)
        this.offlineDom = "";
        this.liveToggleState = false;
        // reload the dom
        this.loadOfflineDom();
      }
    }
  },
  computed: {
    currentURL() {
      return lGet(this.manifest, "module.url", "");
    },
    currentNode() {
      const node = this.$store.state.views.currentWorkingNode;
      return node;
    },
    currentPath() {
      return this.currentNode.path;
    }
  },
  methods: {
    async loadOfflineDom() {
      const pathToOfflineDom =
        this.currentPath + this.manifest.module.page.slice(1);
      const response = await this.$chaos.file.read(pathToOfflineDom);
      this.offlineDom = await response.data;
    },
    toggleHandler(event) {
      this.liveToggleState = !this.liveToggleState;
    }
  }
};
</script>

<template>
  <div class="h-full">
    <!-- <h1 class="text-xl">Website View</h1> -->
    <div class="h-full p-4">
      <Toggle
        label-left="Archived"
        label-right="Live"
        class="mb-2"
        :handler="toggleHandler"
        :checked="liveToggleState"
      />
      <div class="relative w-full h-full overflow-hidden rounded-sm">
        <!-- there seems to be a bug in vue. If i put the first iframe in a DIV
        as well, vue cannot seem to distinguish between both sets and does not
        patch the dom appropriately -->
        <iframe
          v-if="liveToggleState"
          :src="currentURL"
          class="absolute top-0 left-0 w-full h-full border-0"
        />
        <div v-else>
          <iframe
            :srcdoc="offlineDom"
            sandbox
            class="absolute top-0 left-0 w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
