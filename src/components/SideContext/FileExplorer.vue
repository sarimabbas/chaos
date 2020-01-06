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
          children: [
            {
              title: "Byefwefwwefwgfwgwgwegewgewgew",
              children: [{ title: "No" }]
            }
          ]
        }
      ]
    };
  }
};
</script>

<template>
  <div>
    <!-- heading -->
    <div
      class="mt-1 text-xs font-bold tracking-widest text-center text-gray-600 uppercase"
    >Explorer Context</div>
    <!-- controls -->
    <div class="p-4">
      <p class="mb-1 text-xs font-bold tracking-widest text-gray-300 uppercase">Choose mode</p>

      <button
        class="inline-flex items-center px-2 py-1 text-sm text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
      >
        <span>File Tree</span>
      </button>

      <button
        class="inline-flex items-center px-2 py-1 ml-2 text-sm text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
      >
        <span>Tag Tree</span>
      </button>
    </div>

    <TreeView :roots="roots" />
  </div>
</template>

<style></style>
