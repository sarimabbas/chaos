import { get as lGet } from "lodash";
import { fs as nodeFs, path as nodePath, utils } from "../../backend/common";

const mixin = {
  props: ["nodes"],
  methods: {
    handleClick(node) {
      this.$events.$emit("explorerNodeClick", node);
    },
    title(node) {
      const manifestTitle = lGet(node.atom, "shared.title", node.name);
      return node.isAtom ? manifestTitle : node.name;
    },
    description(node) {
      const description = lGet(node.atom, "shared.description", "");
      return node.isAtom ? description : "";
    },
    image(node) {
      const image = lGet(node.atom, "shared.image", null);
      if (node.isAtom && image) {
        const path = nodePath.join(node.path, image);
        return utils.loadToBase64(path);
      }
      return "";
    },
    systemIcon(node) {
      const image = lGet(node, "icon", "");
      return image;
    },
  },
};

export default mixin;
