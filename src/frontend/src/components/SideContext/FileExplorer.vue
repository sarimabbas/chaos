<script>
import TreeView from "../TreeView/TreeView";
import MinusSquareIcon from "../../assets/icons/minus-square.svg";
export default {
  components: {
    TreeView,
    MinusSquareIcon
  },
  data() {
    return {
      roots: []
    };
  },
  mounted() {
    this.getPaths();
  },
  methods: {
    async getPaths() {
      const paths = await pywebview.api.recursivelyGetPaths(
        "~/Developer/chaos"
      );
      this.roots = [await paths];
    },
    collapse() {
      this.collapseHelper(this.roots[0]);
    },
    collapseHelper(curObj) {
      // leaf
      if (!curObj.children.length || !"showChildren" in curObj) {
        return;
      }

      // internal
      if (curObj.children.length && "showChildren" in curObj) {
        curObj.showChildren = false;
        curObj.children.forEach(child => {
          this.collapseHelper(child);
        });
      }
    }
  }
};
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- top -->
    <div>
      <!-- heading -->
      <div class="mt-1 text-center ui-help-text">Explorer Context</div>
      <!-- controls -->
      <div class="p-4">
        <p class="mb-1 ui-help-text">Choose mode</p>

        <button class="ui-option-button">
          <span>File Tree</span>
        </button>
        <button class="ui-option-button">
          <span>Tag Tree</span>
        </button>
      </div>
      <!-- more controls -->
      <div class="flex items-center justify-between flex-shrink-0 px-1 py-1 bg-gray-800">
        <span class="text-xs font-bold tracking-widest text-gray-400 uppercase">Tree View</span>
        <MinusSquareIcon
          @click="collapse"
          class="ml-auto text-gray-300 cursor-pointer hover:text-gray-500"
          width="20"
        />
      </div>
    </div>
    <!-- rest -->
    <TreeView :roots="roots" class="overflow-y-auto" ref="treeview" />
  </div>
</template>

<style></style>
