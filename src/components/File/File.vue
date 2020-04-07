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
  props: ["node", "renderAs", "renderAtomOnly"],
  data() {
    return {
      isAtom: false,
      manifest: {},
    };
  },
  mounted() {
    const atom = new this.$chaos.Atom();
    atom.load(this.node.path);
    if (!atom) {
      return;
    }
    this.manifest = atom.toObj();
    this.isAtom = true;
  },
  methods: {
    handleClick(node) {
      this.$events.$emit("explorerNodeClick", node);
    },
  },
  computed: {
    title() {
      const manifestTitle = lGet(this.manifest, "shared.title", this.node.name);
      return this.isAtom ? manifestTitle : this.node.name;
    },
    description() {
      const description = lGet(this.manifest, "shared.description", "");
      return this.isAtom ? description : "";
    },
    image() {
      const image = lGet(this.manifest, "shared.image", null);
      if (this.isAtom && image) {
        const path = nodePath.join(this.node.path, image);
        const ext = nodePath.extname(path);
        const data = nodeFs.readFileSync(path, "base64");
        const URI = `data:image/${ext};base64,${data}`;
        return URI;
      }
      return "";
    },
    shouldIRender() {
      if (this.renderAtomOnly) {
        if (this.isAtom) {
          console.log("render me");
          return true;
        }
        console.log("don't render me");
        return false;
      }
      console.log("render me");
      return true;
    },
  },
  // watch: {
  //   node: {
  //     immediate: true,
  //     deep: true,
  //     handler: async function (newVal, oldVal) {
  //       this.manifest = {};
  //       const atom = new this.$chaos.Atom();
  //       atom.load(newVal.path);
  //       if (!atom) {
  //         return;
  //       }
  //       this.manifest = atom.toObj();
  //     },
  //   },
  // },
};
</script>

<template>
  <ListItem
    :title="title"
    :description="description"
    :node="node"
    :click="handleClick"
    v-if="shouldIRender && renderAs === 'list'"
  />
  <Card
    :title="title"
    :description="description"
    :image="image"
    :node="node"
    :click="handleClick"
    v-else-if="shouldIRender && renderAs === 'grid'"
  />
</template>

<style></style>
