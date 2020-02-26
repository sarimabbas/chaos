<script>
import CrossIcon from "../../assets/icons/cross.svg";

// import modules
import WebsiteAdd from "../../modules/website/Add";

export default {
  components: {
    CrossIcon,
    WebsiteAdd
  },
  data() {
    return {
      whichModule: ""
    };
  }
};
</script>

<template>
  <div class="p-4">
    <!-- janky routing module -->
    <div v-if="whichModule">
      <!-- heading -->
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm" @click="whichModule = ''">GO BACK</p>
        <CrossIcon width="20" />
      </div>
      <!-- modules -->
      <div v-if="whichModule === 'website'">
        <WebsiteAdd />
      </div>
    </div>
    <!-- selection -->
    <div v-else>
      <!-- main selection heading -->
      <div class="flex items-center justify-between">
        <h1 class="text-xl">Add content</h1>
        <CrossIcon width="20" />
      </div>
      <!-- selection -->
      <p class="mb-3">Choose from your installed modules:</p>
      <button
        @click="whichModule = 'website'"
        class="w-full px-2 py-1 bg-gray-300 rounded-sm hover:bg-gray-400"
      >
        Website
      </button>
    </div>
  </div>
</template>

<style></style>
