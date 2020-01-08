<script>
import Node from "./Node";
import MinusSquareIcon from "../../assets/icons/minus-square.svg";
export default {
  components: {
    Node,
    MinusSquareIcon
  },
  props: ["roots"]
};
</script>

<template>
  <div class="h-full cursor-pointer">
    <ul>
      <node v-for="(node, index) in roots" :node="node" :key="index" :handleNodeClick="() => {}" />
    </ul>
  </div>
</template>


