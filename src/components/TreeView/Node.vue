<script>
import ChevronRightIcon from "../../assets/icons/chevron-right.svg";
import ChevronDownIcon from "../../assets/icons/chevron-down.svg";
export default {
  name: "node",
  components: {
    ChevronRightIcon,
    ChevronDownIcon
  },
  props: ["node", "handleNodeClick"],
  methods: {
    toggleChildren() {
      this.node.showChildren = !this.node.showChildren;
    }
  },
  computed: {
    someChildrenVisible() {
      return this.node.children.some(child => child.show);
    },
    haveLeftPadding() {
      if (this.node.children && !this.node.children.length) {
        return true;
      }
      if (!this.someChildrenVisible) {
        return true;
      }
    }
  }
};
</script>

<template>
  <li class="pr-1" v-if="node.show">
    <!-- the single item -->
    <div
      :class="['flex items-center justify-between h-6 bg-transparent hover:bg-gray-600 extend-for-hover', node.selected ? 'bg-gray-600' : '']"
    >
      <!-- the chevron -->
      <span
        class="flex items-center ml-1"
        @click="toggleChildren"
        v-if="node.children && node.children.length && someChildrenVisible"
      >
        <chevron-down-icon v-if="node.showChildren" width="20" class="text-gray-400" />
        <chevron-right-icon v-else width="20" class="text-gray-400" />
      </span>
      <!-- <span class="node-level" @click="handleNodeClick(node)">H{{ node.data.level }}</span> -->
      <span
        :class="['inline-block w-full text-sm text-gray-400 truncate ml-1 select-none', { 'pl-6' : this.haveLeftPadding }]"
        @click="handleNodeClick(node)"
      >{{ node.name }}</span>
    </div>
    <!-- nested items (if any) -->
    <ul v-if="node.children && node.children.length && node.showChildren">
      <node
        class="pl-5"
        v-for="(child, index) in node.children"
        :key="index"
        :node="child"
        :handleNodeClick="handleNodeClick"
      ></node>
    </ul>
  </li>
</template>


<style scoped>
.extend-for-hover {
  padding-left: 100%;
  margin-left: -100%;
  padding-right: 100%;
  margin-right: -100%;
}

.node-level {
  margin-left: 5px;
  margin-right: 5px;
  font-size: 0.6rem;
  font-weight: 700;
}
</style>
