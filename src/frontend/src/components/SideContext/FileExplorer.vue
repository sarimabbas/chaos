<script>
import TreeView from "../TreeView/TreeView";
import MinusSquareIcon from "../../assets/icons/minus-square.svg";
import LayersIcon from "../../assets/icons/layers.svg";
import api from "../../api";
export default {
  components: {
    TreeView,
    MinusSquareIcon,
    LayersIcon
  },
  data() {
    return {
      roots: [],
      mode: "Traditional View"
    };
  },
  mounted() {
    this.getPaths();
  },
  methods: {
    async getPaths() {
      const res = await api.get("/paths");
      const paths = await res.data;
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
    },
    changeMode() {
      if (this.mode == "Traditional View") {
        this.mode = "Folder View";
      } else {
        this.mode = "Traditional View";
      }
      this.toggleLeaves(this.roots[0]);
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
        <span
          class="text-xs font-bold tracking-widest text-gray-400 uppercase"
          >{{ this.mode }}</span
        >
        <div class="flex items-center justify-between">
          <LayersIcon
            @click="changeMode"
            class="mx-1 ml-auto text-gray-300 cursor-pointer hover:text-gray-500"
            width="20"
          />
          <MinusSquareIcon
            @click="collapse"
            class="ml-auto text-gray-300 cursor-pointer hover:text-gray-500"
            width="20"
          />
        </div>
      </div>
    </div>
    <!-- rest -->
    <TreeView
      :roots="roots"
      class="overflow-x-hidden overflow-y-auto"
      ref="treeview"
    />
  </div>
</template>

<style></style>
