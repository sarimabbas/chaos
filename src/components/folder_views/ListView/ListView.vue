<script>
import mixin from "../mixin";
import ListItem from "../../primitives/ListItem/ListItem";
export default {
  components: {
    ListItem,
  },
  props: ["nodes"],
  mixins: [mixin],
};
</script>

<template>
  <ul>
    <ListItem
      v-for="node in nodes"
      :key="node.path"
      :title="title(node)"
      :description="description(node)"
      :node="node"
      :click="handleClick"
    />
  </ul>
</template>

<style></style>
