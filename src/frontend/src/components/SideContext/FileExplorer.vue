<script>
import TreeView from "../TreeView/TreeView";
import MinusSquareIcon from "../../assets/icons/minus-square.svg";
import LayersIcon from "../../assets/icons/layers.svg";
import LoaderIcon from "../../assets/icons/loader.svg";
import api from "../../api";
export default {
  components: {
    TreeView,
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
    this.getPaths();
  },
  methods: {
    async getPaths() {
      this.loading = true;
      const res = await api.get("/paths");
      const paths = await res.data;
      this.roots = [await paths];
      this.loading = await false;
    },
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
        <div class="flex items-center justify-between" v-if="roots.length">
          <LayersIcon @click="changeMode" class="mx-1 ml-auto ui-option-button" width="20" />
          <MinusSquareIcon @click="collapse" class="ml-auto ui-option-button" width="20" />
        </div>
      </div>
    </div>
    <!-- rest -->
    <TreeView
      :roots="roots"
      v-if="roots.length"
      class="overflow-x-hidden overflow-y-auto"
      ref="treeview"
    />
    <div v-else-if="loading" class="m-auto text-center text-gray-400">
      <LoaderIcon width="24" class="spin" />
    </div>
    <div v-else class="m-auto text-center">
      <input type="file" id="file" class="file-input" />
      <label
        for="file"
        class="px-2 py-1 m-auto text-base cursor-pointer keystroke hover:bg-gray-500"
      >Open file or folder</label>
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
