import { get as lGet } from "lodash";
import { fs as nodeFs, path as nodePath } from "../../backend/common";

const mixin = {
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
        const ext = nodePath.extname(path);
        const data = nodeFs.readFileSync(path, "base64");
        const URI = `data:image/${ext};base64,${data}`;
        return URI;
      }
      return "";
    },
  },
};

export default mixin;
