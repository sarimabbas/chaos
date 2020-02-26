<script>
import api from "../../api";
import { get as lGet } from "lodash";
export default {
  props: ["manifest"],
  components: {},
  data() {
    return {};
  },
  computed: {
    currentURL() {
      return lGet(this.manifest, "module.url", "");
    }
  },
  methods: {}
};
</script>

<template>
  <div class="h-full">
    <!-- <h1 class="text-xl">Website View</h1> -->
    <div class="h-full p-4">
      <div class="relative w-full h-full overflow-hidden rounded-sm">
        <iframe :src="currentURL" class="absolute top-0 left-0 w-full h-full border-0" />
      </div>
    </div>
  </div>
</template>

<style></style>
