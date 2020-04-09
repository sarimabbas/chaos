import { dialog, fs, path, remote } from "./common";
const fileIcon = remote.require("file-icon");
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

const systemIconMap = {
  ext: {},
  type: {},
};

const getSystemIcon = async (pathToNode) => {
  const getData = async () => {
    const buffer = await fileIcon.buffer(pathToNode, { size: 64 });
    const uri = await buffer.toString("base64");
    return `data:image/png;base64,${uri}`;
  };

  // check if directory
  const stat = fs.lstatSync(pathToNode);
  if (stat.isDirectory()) {
    if ("directory" in systemIconMap.type) {
      return systemIconMap.type["directory"];
    }
    const data = await getData(pathToNode);
    systemIconMap.type["directory"] = await data;
    return data;
  }
  // for all other cases, check if extension meets criteria
  const ext = path.extname(pathToNode);
  if (ext in systemIconMap.ext) {
    return systemIconMap.ext[ext];
  }
  const data = await getData(pathToNode);
  systemIconMap.ext[ext] = await data;
  return data;
};

export const recursivelyGetNodes = async (curPath) => {
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
    icon: await getSystemIcon(curPath),
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
      childrenNodes.push(
        await recursivelyGetNodes(path.join(fsDir.path, p.name))
      );
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
