// Class that refers to a file system inode
// Used by the File Explorer when traversing the file tree
import { Joi } from "./common";
import Spec from "./spec";

class Node extends Spec {
  constructor() {
    super();
  }

  static spec = Joi.object({
    // system metadata
    system: {
      st_size: Joi.number(),
      st_mtime: Joi.date().timestamp(),
      st_ctime: Joi.date().timestamp(),
    },
    // explorer-specific properties initialized in advance
    show: Joi.boolean(),
    showChildren: Joi.boolean(),
    selected: Joi.boolean(),
    // other properties
    children: Joi.array().items(Joi.link("#node")),
    path: Joi.string().allow(""),
    name: Joi.string().allow(""),
    type: Joi.string().allow(""),
    isAtom: Joi.boolean(),
  }).id("node");
}

export default Node;
