import { dialog, fs, path } from "./common";

export const filePicker = () => {
  const filePaths = dialog.showOpenDialogSync({
    properties: ["openFile", "openDirectory", "createDirectory"]
  });
  if (filePaths.length > 0) {
    return filePaths[0];
  } else {
    return "";
  }
};

export const recursivelyGetPaths = curPath => {
  // first get the stat result
  const stat = fs.lstatSync(curPath);
  const parsePath = path.parse(curPath);

  const commonProp = {
    path: curPath,
    name: parsePath.base,
    show: true,
    selected: false
  };

  // if leaf node, return
  const fileExtensions = [".crncl", ".chaos", ".sa490"];
  if (stat.isFile() || fileExtensions.includes(parsePath.ext)) {
    return {
      ...commonProp,
      type: "file",
      children: []
    };
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

    const childrenPaths = [];
    for (let p of dirents) {
      childrenPaths.push(recursivelyGetPaths(path.join(fsDir.path, p.name)));
    }

    return {
      ...commonProp,
      type: "directory",
      children: childrenPaths,
      showChildren: false
    };
  }
};
