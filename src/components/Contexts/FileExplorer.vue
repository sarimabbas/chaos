<script>
import TreeView from "../TreeView/TreeView";
import MinusSquareIcon from "../../assets/icons/minus-square.svg";
import LayersIcon from "../../assets/icons/layers.svg";
import LoaderIcon from "../../assets/icons/loader.svg";
import XSquareIcon from "../../assets/icons/x-square.svg";
import RotateCwIcon from "../../assets/icons/rotate-cw.svg";

import { recursivelyGetNodes, filePicker } from "../../backend/explorer";

import { remote } from "../../backend/common";
const chokidar = remote.require("chokidar");

// Right click menu
import { VueContext } from "vue-context";
import ContextMenu from "./ContextMenu/ContextMenu";

export default {
  components: {
    TreeView,
    XSquareIcon,
    MinusSquareIcon,
    LayersIcon,
    RotateCwIcon,
    LoaderIcon,

    // right click menu
    VueContext,
    ContextMenu,
  },
  data() {
    return {
      roots: [],
      lastSetPath: "",
      loading: false,
      fileWatcher: null,
    };
  },
  mounted() {
    this.$events.$on("explorerNodeClick", (node) => {
      this.handleNodeClick(node);
    });

    this.$events.$on("showInodeContextMenu", (event, node) => {
      if (this.$refs.menu) {
        this.$refs.menu.open(event, node);
      }
    });
  },
  beforeDestroy() {
    if (this.fileWatcher) {
      this.fileWatcher.close().then(() => {
        this.fileWatcher = null;
        console.log("file watcher closed");
      });
    }
  },
  computed: {
    mode() {
      return this.$store.state.views.folderMode === "immediate"
        ? "Immediate Mode"
        : "Nested Mode";
    },
    refreshFileExplorer() {
      return this.$store.state.hacks.refreshFileExplorer;
    },
  },
  watch: {
    refreshFileExplorer: function(newVal, oldVal) {
      this.refreshTree();
    },
    externalNodeClick: function(newVal, oldVal) {
      this.handleNodeClick(newVal);
    },
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
        curObj.children.forEach((child) => {
          this.collapseHelper(child);
        });
      }
    },
    changeMode() {
      if (this.mode == "Immediate Mode") {
        this.$store.dispatch("setFolderMode", "nested");
      } else {
        this.$store.dispatch("setFolderMode", "immediate");
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
        curObj.children.forEach((child) => {
          this.toggleLeaves(child);
        });
      }
    },
    async filePicker() {
      const pickerRequest = filePicker();
      this.lastSetPath = pickerRequest;
      if (pickerRequest === "") {
        return;
      }
      this.loading = true;
      const pathRequest = await recursivelyGetNodes(pickerRequest);
      this.roots = await [pathRequest];
      this.$store.dispatch("setWorkspaceRootNode", await this.roots[0]);
      this.fileWatcher = chokidar
        .watch(pathRequest.path, { ignoreInitial: true })
        .on("all", (event, path) => {
          console.log(event, path);
          console.log("refreshing tree");
          this.refreshTree();
        });
      this.loading = false;
    },
    async refreshTree() {
      if (this.lastSetPath !== "") {
        // fetch the directory again
        this.loading = true;
        const pathRequest = await recursivelyGetNodes(this.lastSetPath);
        // patch the new tree with the old tree's toggles
        this.refreshTreeHelper(this.roots[0], await pathRequest);
        this.roots = await [pathRequest];
        this.loading = false;
        // refresh the folder views if the root is the same
        if (
          this.$store.state.views.currentWorkingNode.path ===
          (await this.roots[0].path)
        ) {
          this.$store.dispatch("setCurrentWorkingNode", await this.roots[0]);
          this.$store.dispatch("setWorkspaceRootNode", await this.roots[0]);
        }
      }
    },
    refreshTreeHelper(oldTree, newTree) {
      // compare current node paths and path
      if (newTree.children.length && newTree.path == oldTree.path) {
        newTree.showChildren = oldTree.showChildren;
      }

      // compare children
      if (newTree.children.length && oldTree.children.length) {
        let n_children = newTree.children.concat().sort();
        let o_children = oldTree.children.concat().sort();
        n_children = n_children.filter((nc) => {
          let keep = false;
          o_children.forEach((oc) => {
            if (nc.path == oc.path) {
              keep = true;
            }
          });
          return keep;
        });

        n_children.forEach((child, index) => {
          this.refreshTreeHelper(child, o_children[index]);
        });
      }
    },
    fileClear() {
      this.roots = [];
    },
    selectedHelper(tree) {
      tree.selected = false;
      tree.children.forEach((c) => {
        this.selectedHelper(c);
      });
    },
    handleNodeRightClick(event, node) {
      this.$events.$emit("showInodeContextMenu", event, node);
    },
    handleNodeClick(node) {
      if (!node) {
        return;
      }

      let oldPath = this.$route.fullPath;
      let newPath = this.$route.fullPath;

      // navigate to folder view
      if (node.type === "directory") {
        newPath = this.$router.resolve({
          name: "folder",
          // query: { path: node.path }
        }).resolved.fullPath;
        // navigate to file views
      } else if (node.type === "file") {
        newPath = this.$router.resolve({
          name: "file",
          // query: { path: node.path }
        }).resolved.fullPath;
      }

      // set node as selected, and all the others as not
      this.selectedHelper(this.roots[0]);
      node.selected = true;

      // set node in the store
      this.$store.dispatch("setCurrentWorkingNode", node);

      // only push new path if not on it already
      if (newPath != oldPath) {
        this.$router.push(newPath);
      }
    },
  },
};
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <!-- top -->
    <div>
      <!-- heading -->
      <div class="my-1 text-center ui-help-text">Explorer Context</div>
      <!--  controls -->
      <div class="flex items-center justify-between px-1 py-1 bg-gray-800 f">
        <span
          class="text-xs font-bold tracking-widest text-gray-400 uppercase"
          >{{ this.mode }}</span
        >
        <div v-if="roots.length" class="flex items-center justify-between">
          <RotateCwIcon
            @click="refreshTree"
            class="mx-1 ml-auto ui-option-button"
            width="15"
          />
          <XSquareIcon
            @click="fileClear"
            class="mx-1 ml-auto ui-option-button"
            width="15"
          />
          <LayersIcon
            @click="changeMode"
            class="mx-1 ml-auto ui-option-button"
            width="15"
          />
          <MinusSquareIcon
            @click="collapse"
            class="ml-auto ui-option-button"
            width="15"
          />
        </div>
      </div>
    </div>
    <!-- rest -->
    <TreeView
      :handleNodeClick="handleNodeClick"
      :handleNodeRightClick="handleNodeRightClick"
      :roots="roots"
      v-if="roots.length"
      class="overflow-x-hidden overflow-y-auto"
    />
    <div v-else-if="loading" class="m-auto text-center text-gray-400">
      <LoaderIcon width="24" class="spin" />
    </div>
    <div v-else class="flex m-auto text-center">
      <button @click="filePicker" class="px-2 py-1 mr-2 text-base ui-button">
        Open file or folder
      </button>
    </div>
    <!-- context menu -->
    <vue-context ref="menu" class="contextmenu">
      <template slot-scope="child">
        <ContextMenu :node="child.data" />
      </template>
    </vue-context>
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

.contextmenu {
  display: block;
  z-index: 1500;
  position: fixed;
  box-sizing: border-box;
  outline: none;
}
</style>
