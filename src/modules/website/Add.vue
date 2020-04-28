<script>
import CheckIcon from "../../assets/icons/check.svg";
import LoaderIcon from "../../assets/icons/loader.svg";
import Status from "./components/Status";

import mixin from "./mixin";

export default {
  mixins: [mixin],
  components: {
    CheckIcon,
    LoaderIcon,
    Status,
  },
  methods: {
    async fetchButtonClicked() {
      await this.fetchURL(this.$store.state.views.currentWorkingPath);
    },
  },
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl">Add website</h1>
    <p class="mt-1 mb-2 text-sm text-gray-600">
      The URL, if it exists, will be fetched and stored in the Chaos file
      format.
    </p>
    <div class="flex justify-between">
      <input
        class="w-full px-2 py-2 placeholder-gray-800 border border-gray-300 rounded-lg appearance-none text-md focus:outline-none focus:shadow-outline"
        type="url"
        placeholder="Enter URL e.g. https://google.com"
        v-model="url"
      />
      <button
        class="px-2 ml-2 bg-gray-400 rounded-lg hover:bg-gray-500"
        @click="fetchButtonClicked"
      >
        <span v-if="statuses.global === 'loading'">
          <LoaderIcon width="24" class="spin" />
        </span>
        <span v-else-if="statuses.global === 'success'">
          <CheckIcon width="24" />
        </span>
        <span v-else>Fetch</span>
      </button>
    </div>
    <div class="mt-2 statuses">
      <Status name="Metadata" :status="statuses.metadata" />
      <Status name="HTML" :status="statuses.html" />
      <Status name="MHTML" :status="statuses.mhtml" />
      <Status name="Screenshot" :status="statuses.screenshot" />
    </div>
  </div>
</template>

<style></style>
