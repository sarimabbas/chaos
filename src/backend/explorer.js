import { dialog, fs, path } from "./common";
import Node from "./node";
import Atom from "./atom";

export const filePicker = () => {
  const filePaths = dialog.showOpenDialogSync({
    properties: ["openFile", "openDirectory", "createDirectory"],
  });
  if (filePaths.length > 0) {
    return filePaths[0];
  } else {
    return "";
  }
};

export const recursivelyGetNodes = (curPath) => {
  // first get the stat result
  const stat = fs.lstatSync(curPath);
  const parsePath = path.parse(curPath);

  // compile the common properties
  const node = new Node();
  node.update({
    path: curPath,
    name: parsePath.base,
    show: true,
    selected: false,
  });

  // if leaf node, return
  const atom = new Atom();
  const isAtom = atom.load(curPath);
  if (stat.isFile() || isAtom) {
    node.update({
      type: "file",
      children: [],
    });
    if (isAtom) {
      node.update({
        isAtom: true,
        atom: atom.toObj(),
      });
    }
    return node.toObj();
  }

  // if parent node, recurse
  if (stat.isDirectory()) {
    const fsDir = fs.opendirSync(curPath);
    let x;
    const dirents = [];
    while ((x = fsDir.readSync()) !== null) {
      dirents.push(x);
    }
    fsDir.closeSync();

    // iterate over the children
    const childrenNodes = [];
    for (let p of dirents) {
      childrenNodes.push(recursivelyGetNodes(path.join(fsDir.path, p.name)));
    }

    // add as children of current node
    node.update({
      type: "directory",
      showChildren: false,
      children: childrenNodes,
    });

    return node.toObj();
  }
};
