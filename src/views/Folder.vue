<script>
import { get as lGet } from "lodash";
import Add from "../components/Add/Add";
import CrossIcon from "../assets/icons/cross.svg";
import ChevronDownIcon from "../assets/icons/chevron-down.svg";
import PlusIcon from "../assets/icons/plus.svg";
import FilterIcon from "../assets/icons/filter.svg";
import EyeIcon from "../assets/icons/eye.svg";
import ArrowDownIcon from "../assets/icons/arrow-down.svg";
import Dropdown from "../components/Dropdown/Dropdown";
import DropdownItem from "../components/Dropdown/DropdownItem";
import store from "../store";
export default {
  components: {
    CrossIcon,
    ArrowDownIcon,
    Dropdown,
    DropdownItem,
    ChevronDownIcon,
    PlusIcon,
    FilterIcon,
    EyeIcon,
    Add
  },
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
    handleClick(node) {
      this.$events.$emit("explorerNodeClick", node);
    },
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
    showAddModal() {
      this.$modal.show("add-modal");
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
          Folder:
          <h2 class="inline text-xl text-gray-200">{{ currentWorkingNode.name }}</h2>
        </h1>
        <CrossIcon class="ui-option-button" width="24" @click="close" />
      </div>
      <!-- toolbar -->
      <div class="flex items-baseline justify-between mb-4">
        <div class="flex items-baseline">
          <Dropdown text="View" class="mr-2">
            <template v-slot:icon>
              <EyeIcon width="15" />
            </template>
          </Dropdown>
          <Dropdown text="Filter" class="mr-2">
            <template v-slot:icon>
              <FilterIcon width="15" />
            </template>
          </Dropdown>
          <Dropdown text="Sort" class="mr-2">
            <template v-slot:icon>
              <ChevronDownIcon width="15" />
            </template>
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
        <button
          class="relative z-10 flex items-center justify-between block px-2 bg-gray-200 rounded-sm hover:bg-gray-400"
          type="button"
          @click="showAddModal"
        >
          <span>Add</span>
          <div class="ml-1">
            <PlusIcon width="15" />
          </div>
        </button>
        <modal name="add-modal" height="auto" :scrollable="true" :adaptive="true">
          <Add />
        </modal>
      </div>
      <!-- immediate children list -->
      <ul v-if="isFolderImmediateMode">
        <li
          v-for="child in immediateChildren"
          @click="handleClick(child)"
          :key="child.path"
          class="px-2 py-1 my-1 truncate bg-white border-gray-600 rounded-sm cursor-pointer"
        >{{ child.name }}</li>
      </ul>
      <ul v-else>
        <li
          v-for="child in nestedChildren"
          @click="handleClick(child)"
          :key="child.path"
          class="px-2 py-1 my-1 truncate bg-white border-gray-600 rounded-sm cursor-pointer"
        >{{ child.name }}</li>
      </ul>
    </div>
  </div>
</template>

<style></style>
