<template>
  <li class="bg-gray-700">
    <!-- the single item -->
    <div
      class="flex items-center justify-between h-6 bg-transparent hover:bg-gray-600"
      style=" padding-left: 100%; margin-left: -100%;"
    >
      <span
        class="flex items-center ml-1"
        v-if="node.children && node.children.length"
        @click="toggleChildren"
      >
        <chevron-down-icon v-if="showChildren" width="20" />
        <chevron-right-icon v-else width="20" />
      </span>
      <!-- <span class="node-level" @click="handleNodeClick(node)">H{{ node.data.level }}</span> -->
      <span
        :class="['inline-block w-full text-sm text-gray-400 truncate ml-1 select-none', { 'pl-5' : !node.children.length }]"
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
  data() {
    return {
      showChildren: false
    };
  },
  methods: {
    toggleChildren() {
      this.node.showChildren = !this.node.showChildren;
    }
  }
};
</script>


<style scoped>
.node-level {
  margin-left: 5px;
  margin-right: 5px;
  font-size: 0.6rem;
  font-weight: 700;
}
</style>
