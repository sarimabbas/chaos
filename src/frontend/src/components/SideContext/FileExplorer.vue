<script>
import TreeView from "../TreeView/TreeView";
import MinusSquareIcon from "../../assets/icons/minus-square.svg";
import LayersIcon from "../../assets/icons/layers.svg";
import LoaderIcon from "../../assets/icons/loader.svg";
import XSquareIcon from "../../assets/icons/x-square.svg";
import api from "../../api";
export default {
  components: {
    TreeView,
    XSquareIcon,
    MinusSquareIcon,
    LayersIcon,
    LoaderIcon
  },
  data() {
    return {
      roots: [],
      loading: false,
      mode: "Traditional View"
    };
  },
  mounted() {
    console.log("File Explorer mounted");
  },
  methods: {
    collapse() {
      if (this.roots.length) {
        this.collapseHelper(this.roots[0]);
      }
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
    },
    changeMode() {
      if (this.mode == "Traditional View") {
        this.mode = "Folder View";
      } else {
        this.mode = "Traditional View";
      }
      if (this.roots.length) {
        this.toggleLeaves(this.roots[0]);
      }
    },
    toggleLeaves(curObj) {
      // leaf
      if (!curObj.children.length || !"showChildren" in curObj) {
        curObj.show = !curObj.show;
        return;
      }
      // internal
      if (curObj.children.length && "showChildren" in curObj) {
        curObj.children.forEach(child => {
          this.toggleLeaves(child);
        });
      }
    },
    async filePicker(pickerType) {
      const pickerRequest = await api.get("/filepicker", {
        params: { type: pickerType || "folder" }
      });
      const pickedPath = await pickerRequest.data;
      this.loading = true;
      const pathRequest = await api.get("/pathfinder", {
        params: { path: pickedPath }
      });
      const paths = await pathRequest.data;
      this.roots = [await paths];
      this.loading = false;
    },
    fileClear() {
      this.roots = [];
    },
    handleNodeClick(node) {
      const oldPath = this.$route.fullPath;
      const newPath = this.$router.resolve({
        name: "folder",
        query: { path: node.path }
      }).resolved.fullPath;

      if (newPath != oldPath) {
        this.$router.push(newPath);
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
      <div class="my-1 text-center ui-help-text">Explorer Context</div>
      <!--  controls -->
      <div class="flex items-center justify-between px-1 py-1 bg-gray-800 f">
        <span class="text-xs font-bold tracking-widest text-gray-400 uppercase">{{ this.mode }}</span>
        <div v-if="roots.length" class="flex items-center justify-between">
          <XSquareIcon @click="fileClear" class="mx-1 ml-auto ui-option-button" width="20" />
          <LayersIcon @click="changeMode" class="mx-1 ml-auto ui-option-button" width="20" />
          <MinusSquareIcon @click="collapse" class="ml-auto ui-option-button" width="20" />
        </div>
      </div>
    </div>
    <!-- rest -->
    <TreeView
      :handleNodeClick="handleNodeClick"
      :roots="roots"
      v-if="roots.length"
      class="overflow-x-hidden overflow-y-auto"
      ref="treeview"
    />
    <div v-else-if="loading" class="m-auto text-center text-gray-400">
      <LoaderIcon width="24" class="spin" />
    </div>
    <div v-else class="flex m-auto text-center">
      <button @click="filePicker('folder')" class="px-2 py-1 mr-2 text-base ui-button">Open folder</button>
      <button @click="filePicker('file')" class="px-2 py-1 mr-2 text-base ui-button">Open file</button>
    </div>
  </div>
</template>

<style>
.file-input {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
}
</style>
