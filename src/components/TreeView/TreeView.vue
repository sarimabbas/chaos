<script>
import Node from "./Node";
export default {
  components: {
    Node,
  },
  props: ["roots", "handleNodeClick", "handleNodeRightClick"],
};
</script>

<template>
  <div class="h-full cursor-pointer">
    <ul>
      <node
        v-for="(node, index) in roots"
        :node="node"
        :key="index"
        :handleNodeClick="handleNodeClick"
        :handleNodeRightClick="handleNodeRightClick"
      />
    </ul>
  </div>
</template>
