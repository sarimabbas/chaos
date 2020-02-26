<script>
import api from "../../api";
import CheckIcon from "../../assets/icons/check.svg";
import LoaderIcon from "../../assets/icons/loader.svg";
export default {
  components: {
    CheckIcon,
    LoaderIcon
  },
  data() {
    return {
      url: "",
      loading: false,
      success: false
    };
  },
  methods: {
    async fetchURL() {
      this.loading = true;
      const request = await api.get("/modules/website/create", {
        params: { url: this.url }
      });
      const data = await request.data;
      this.loading = false;
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, 2000);
      if (data) {
        const hostname = new URL(this.url).hostname;
        await api.post("/write-json-to-file", {
          path: this.$store.state.views.currentWorkingPath + "/" + hostname + ".chaos",
          data: data
        });
        this.$store.dispatch("refreshFileExplorer");
      }
    }
  }
};
</script>

<template>
  <div>
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
      <button class="px-2 ml-2 bg-gray-400 rounded-lg hover:bg-gray-500" @click="fetchURL">
        <span v-if="loading">
          <LoaderIcon width="24" class="spin" />
        </span>
        <span v-else-if="success">
          <CheckIcon width="24" />
        </span>
        <span v-else>Fetch</span>
      </button>
    </div>
  </div>
</template>

<style></style>
