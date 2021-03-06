<script>
import { get as lGet } from "lodash";

import CrossIcon from "@/assets/icons/cross.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import FilterIcon from "@/assets/icons/filter.svg";
import EyeIcon from "@/assets/icons/eye.svg";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg";
import Dropdown from "@/components/Dropdown/Dropdown";
import DropdownItem from "@/components/Dropdown/DropdownItem";

import ListView from "./components/folder_views/ListView/ListView";
import GridView from "./components/folder_views/GridView/GridView";
import ViewOptions from "./components/controls/ViewOptions/ViewOptions";
import FilterOptions from "./components/controls/FilterOptions/FilterOptions";
import SortOptions from "./components/controls/SortOptions/SortOptions";
import AddOptions from "./components/controls/AddOptions/AddOptions";
import EditModal from "./components/EditModal/EditModal";

import { isPackage } from "@/backend/explorer";
import { fs } from "@/backend/common";

import store from "@/store";
export default {
  components: {
    Dropdown,
    DropdownItem,

    // icons
    CrossIcon,
    ArrowDownIcon,
    ChevronDownIcon,
    PlusIcon,
    FilterIcon,
    EyeIcon,

    // views
    ListView,
    GridView,
    ViewOptions,
    FilterOptions,
    SortOptions,
    AddOptions,

    // edit inode
    EditModal,
  },
  data() {
    return {
      nodeSortProperty: "",
      viewProperty: "list",
    };
  },
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
          // add the child to the array if not dir
          if (fs.lstatSync(child.path).isFile() || isPackage(child.path)) {
            children.push(child);
          }
          // also add all of its children
          if (child.children && child.children.length > 0) {
            children = children.concat(this.nestedChildrenHelper(child));
          }
        }
      }
      return children;
    },
    showEditModal() {
      this.$modal.show("edit-modal");
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
    },
    changeViewHandler(input) {
      this.viewProperty = input;
    },
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
    },
  },
  watch: {
    $route(to, from) {
      // react to route changes...
    },
    // currentWorkingPath(value) {
    //   console.log(value);
    // }
  },
};
</script>

<template>
  <div class="w-full h-full overflow-hidden break-words">
    <!-- margins -->
    <div class="mx-4">
      <!-- heading -->
      <div class="flex items-center justify-between my-3">
        <h1 class="text-2xl font-bold tracking-widest text-gray-200 uppercase">
          Folder:
          <h2 class="inline text-xl text-gray-200">
            {{ currentWorkingNode.name }}
          </h2>
        </h1>
        <CrossIcon class="ui-option-button" width="24" @click="close" />
      </div>
      <!-- toolbar -->
      <div class="flex items-baseline justify-between mb-4">
        <div class="flex items-baseline">
          <ViewOptions :changeViewHandler="changeViewHandler" class="mr-2" />
          <FilterOptions :changeViewHandler="changeViewHandler" class="mr-2" />
          <SortOptions :changeViewHandler="changeViewHandler" />

          <!-- <Dropdown text="Filter" class="mr-2">
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
          </Dropdown>-->
        </div>
        <!--  Add button -->
        <AddOptions />
      </div>
      <!-- content -->
      <div class="content-height">
        <div v-if="isFolderImmediateMode">
          <ListView v-if="viewProperty == 'list'" :nodes="immediateChildren" />
          <GridView v-if="viewProperty == 'grid'" :nodes="immediateChildren" />
        </div>
        <div v-else>
          <ListView v-if="viewProperty == 'list'" :nodes="nestedChildren" />
          <GridView v-if="viewProperty == 'grid'" :nodes="nestedChildren" />
        </div>
      </div>

      <!-- edit modal -->
      <EditModal />
    </div>
  </div>
</template>

<style scoped>
.content-height {
  overflow-y: scroll;
  height: calc(100vh - 160px);
}
</style>
