<script>
import mixin from "../mixin";
import ListItem from "../../primitives/ListItem/ListItem";
export default {
  components: {
    ListItem
  },
  mixins: [mixin]
};
</script>

<template>
  <ul>
    <ListItem
      v-for="node in nodes"
      :key="node.path"
      :title="title(node)"
      :description="description(node)"
      :icon="systemIcon(node)"
      :node="node"
      :click="handleClick"
      @contextmenu.native.prevent="event => showInodeContextMenu(event, node)"
    />
  </ul>
</template>

<style></style>
