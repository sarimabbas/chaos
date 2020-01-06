<script>
import Node from "./Node";
export default {
  components: {
    Node
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
    <button @click="collapse">Collapse</button>
    <ul>
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