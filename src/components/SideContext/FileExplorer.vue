<script>
import TreeView from "../TreeView/TreeView";
export default {
  components: {
    TreeView
  },
  data() {
    return {
      roots: [
        {
          title: "Hello",
          children: [{ title: "Bye", children: [{ title: "No" }] }]
        }
      ]
    };
  }
};
</script>

<template>
  <div class="p-4">
    <p class="mb-1 text-xs font-bold tracking-widest text-gray-300 uppercase">Choose mode</p>
    <!-- file tree mode -->
    <button
      class="inline-flex items-center px-2 py-1 text-sm text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
    >
      <span>File Tree</span>
    </button>
    <!-- tag tree mode -->
    <button
      class="inline-flex items-center px-2 py-1 ml-2 text-sm text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
    >
      <span>Tag Tree</span>
    </button>
    <!-- file tree mode -->
    <br />
    <TreeView :roots="roots" />
  </div>
</template>

<style></style>
