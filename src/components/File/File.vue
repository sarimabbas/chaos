<script>
import Card from "../primitives/Card/Card";
import ListItem from "../primitives/ListItem/ListItem";
import { get as lGet } from "lodash";
import { fs as nodeFs, path as nodePath } from "../../backend/common";

// the purpose of this component is to
// 1. use its path to detect whether it is a Chaos file type, and extract more information
// this can then be passed onto the card and list types
export default {
  components: {
    ListItem,
    Card,
  },
  props: ["node", "renderAs"],
  methods: {
    handleClick(node) {
      this.$events.$emit("explorerNodeClick", node);
    },
  },
  computed: {
    title() {
      const manifestTitle = lGet(
        this.node.atom,
        "shared.title",
        this.node.name
      );
      return this.node.isAtom ? manifestTitle : this.node.name;
    },
    description() {
      const description = lGet(this.node.atom, "shared.description", "");
      return this.node.isAtom ? description : "";
    },
    image() {
      const image = lGet(this.node.atom, "shared.image", null);
      if (this.node.isAtom && image) {
        const path = nodePath.join(this.node.path, image);
        const ext = nodePath.extname(path);
        const data = nodeFs.readFileSync(path, "base64");
        const URI = `data:image/${ext};base64,${data}`;
        return URI;
      }
      return "";
    },
  },
};
</script>

<template>
  <ListItem
    :title="node.name"
    :description="description"
    :node="node"
    :click="handleClick"
    v-if="renderAs === 'list'"
  />
  <Card
    :title="title"
    :description="description"
    :image="image"
    :node="node"
    :click="handleClick"
    v-else-if="renderAs === 'grid'"
  />
</template>

<style></style>
