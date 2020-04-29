<template>
  <modal name="edit-modal" height="auto" :scrollable="true" :adaptive="true">
    <div class="p-4">
      <h1 class="mb-2 text-xl">Edit node</h1>
      <hr class="mb-2" />
      <div v-if="node">
        <!-- properties -->
        <!-- name -->
        <div class="mb-2">
          <span class="text-xs">Name</span>
          <input
            type="text"
            v-model="node.name"
            class="block w-full p-2 text-sm border border-gray-400 border-solid rounded-md"
            style="max-width: 300px;"
          />
        </div>

        <!-- atom specific properties -->
        <!-- category -->
        <div class="mb-2">
          <span class="text-xs">Category</span>
        </div>
        <!-- tags -->
        <div class="mb-2">
          <span class="text-xs">Tags</span>
        </div>
        <!-- save button -->
        <div class="flex mt-4">
          <button
            @click="saveChanges"
            class="p-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-400"
          >Save</button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { path, fs } from "@/backend/common.js";
export default {
  data() {
    return {
      node: null
    };
  },
  mounted() {
    this.$events.$on("showEditModal", node => {
      this.$modal.show("edit-modal");
      this.node = node;
    });
  },
  methods: {
    saveChanges() {
      // save rename changes
      const dirname = path.dirname(this.node.path);
      fs.renameSync(this.node.path, path.join(dirname, this.node.name));
      //
    }
  }
};
</script>

<style></style>
