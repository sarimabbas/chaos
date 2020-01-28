<script>
import api from "../api";
import { get as lGet } from "lodash";
import CrossIcon from "../assets/icons/cross.svg";
import ArrowDownIcon from "../assets/icons/arrow-down.svg";
import Dropdown from "../components/Dropdown/Dropdown";
import DropdownItem from "../components/Dropdown/DropdownItem";
import { mapState } from "vuex";
export default {
  components: { CrossIcon, ArrowDownIcon, Dropdown, DropdownItem },
  data() {
    return {
      nodeSortProperty: ""
    };
  },
  mounted() {},
  methods: {
    close() {
      this.$router.push("splash");
    },
    fetchFiles() {},
    nestedChildrenHelper(node) {
      let children = [];
      if (node.children && node.children.length > 0) {
        for (let child of node.children) {
          // add the child to the array
          children.push(child);
          // also add all of its children
          if (child.children && child.children.length > 0) {
            children = children.concat(this.nestedChildrenHelper(child));
          }
        }
      }
      return children;
    },
    sortByProperty(nodeArray) {
      if (this.nodeSortProperty && nodeArray && nodeArray.length) {
        const sorted = nodeArray.concat().sort((first, second) => {
          return (
            lGet(second, this.nodeSortProperty) -
            lGet(first, this.nodeSortProperty)
          );
        });
        return sorted;
      }
      return nodeArray;
    }
  },
  computed: {
    currentWorkingPath() {
      return this.$store.state.views.currentWorkingPath;
    },
    currentWorkingNode() {
      return this.$store.state.views.currentWorkingNode;
    },
    immediateChildren() {
      const nodes = this.$store.state.views.currentWorkingNode.children;
      return this.sortByProperty(nodes);
    },
    nestedChildren() {
      const nodes = this.nestedChildrenHelper(
        this.$store.state.views.currentWorkingNode
      );
      return this.sortByProperty(nodes);
    },
    isFolderImmediateMode() {
      return this.$store.state.views.folderMode === "immediate";
    }
  },
  watch: {
    $route(to, from) {
      // react to route changes...
    }
    // currentWorkingPath(value) {
    //   console.log(value);
    // }
  }
};
</script>

<template>
  <div class="w-full h-full overflow-y-scroll break-words bg-gray-700">
    <!-- margins -->
    <div class="mx-4">
      <!-- heading -->
      <div class="flex items-center justify-between my-3">
        <h1 class="text-2xl font-bold tracking-widest text-gray-200 uppercase">
          Folder View
        </h1>
        <CrossIcon class="ui-option-button" width="24" @click="close" />
      </div>
      <!-- folder name -->
      <div class="flex items-baseline justify-between">
        <h2 class="text-xl text-gray-200">{{ currentWorkingNode.name }}</h2>
        <Dropdown text="Sort by">
          <DropdownItem
            text="Modified Time"
            :onClick="
              () => {
                nodeSortProperty = 'system.st_mtime';
              }
            "
            :active="nodeSortProperty === 'system.st_mtime'"
          />
          <DropdownItem
            text="Created Time"
            :onClick="
              () => {
                nodeSortProperty = 'system.st_ctime';
              }
            "
            :active="nodeSortProperty === 'system.st_ctime'"
          />
          <DropdownItem
            text="Size"
            :onClick="
              () => {
                nodeSortProperty = 'system.st_size';
              }
            "
            :active="nodeSortProperty === 'system.st_size'"
          />
        </Dropdown>
      </div>
      <!-- immediate children list -->
      <ul v-if="isFolderImmediateMode">
        <li
          v-for="child in immediateChildren"
          :key="child.path"
          class="p-3 my-1 truncate bg-white border-gray-600 rounded-sm"
        >
          {{ child.name }}
        </li>
      </ul>
      <ul v-else>
        <li
          v-for="child in nestedChildren"
          :key="child.path"
          class="p-3 my-1 truncate bg-white border-gray-600 rounded-sm"
        >
          {{ child.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>
