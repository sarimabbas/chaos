<script>
import Node from "./Node";
import MinusSquareIcon from "../../assets/icons/minus-square.svg";
export default {
  components: {
    Node,
    MinusSquareIcon
  },
  props: ["roots"],
  data() {
    return {
      collapseAll: Date.now()
    };
  },
  methods: {
    collapse() {
      this.collapseAll = Date.now();
    }
  }
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between px-1 py-1 bg-gray-800">
      <span class="text-xs font-bold tracking-widest text-gray-400 uppercase">Tree View</span>
      <MinusSquareIcon
        @click="collapse"
        class="ml-auto text-gray-300 cursor-pointer hover:text-gray-500"
        width="20"
      />
    </div>

    <ul class="overflow-hidden">
      <node
        v-for="(node, index) in roots"
        :node="node"
        :key="index"
        :handleNodeClick="() => {}"
        :collapse="collapseAll"
      />
    </ul>
  </div>
</template>


<style>
</style>