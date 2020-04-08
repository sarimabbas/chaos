import { fs, path, Joi } from "./common";
import Spec from "./spec";

const VALID_EXTENSIONS = [".crncl", ".chaos", ".sa490"];

class Atom extends Spec {
  constructor() {
    super();
  }

  static spec = Joi.object({
    // shared metadata for all atoms, where possible
    shared: {
      // descriptors (besides the filename)
      title: Joi.string().allow(""),
      description: Joi.string().allow(""),
      image: Joi.string().allow(""),
      // general organization (e.g. Kanban board)
      category: Joi.string().allow(""),
      tags: Joi.array().items(Joi.string().allow("")),
      // for todo functionality
      completed: Joi.boolean(),
      deadline: Joi.date().timestamp(), // integer UNIX time
    },
    module: {
      id: Joi.string().required(),
      name: Joi.string().required(),
      // module specific properties:
      // assetsPath: "",
      // apiToken: ""
    },
  });

  save(pathToBundle) {
    // create the bundle dir if it doesnt exist
    if (!fs.existsSync(pathToBundle)) {
      fs.mkdirSync(pathToBundle, { recursive: true });
    }
    // create a file inside of it
    const pathToManifest = path.join(pathToBundle, "manifest.json");
    try {
      fs.writeFileSync(pathToManifest, this.toString(this.state));
    } catch (e) {
      console.log(e);
    }
  }

  load(pathToBundle) {
    // check valid atom (including manifest check)
    if (!Atom.isAtom(pathToBundle)) {
      return false;
    }
    // get the manifest
    const pathToManifest = path.join(pathToBundle, "manifest.json");
    const rawFileData = fs.readFileSync(pathToManifest);
    const jsonData = JSON.parse(rawFileData);
    // set state
    this.state = jsonData;
    return true;
  }

  static isAtom(pathToBundle) {
    // check exists
    if (!fs.existsSync(pathToBundle)) {
      return false;
    }
    // check is directory
    // the atom must be a directory, not a file
    if (fs.lstatSync(pathToBundle).isFile()) {
      return false;
    }
    // check extension
    if (!VALID_EXTENSIONS.includes(path.extname(pathToBundle))) {
      return false;
    }
    // check manifest.json
    const pathToManifest = path.join(pathToBundle, "manifest.json");
    if (!fs.existsSync(pathToManifest)) {
      return false;
    }
    // parse the representation
    const rawFileData = fs.readFileSync(pathToManifest);
    const jsonData = JSON.parse(rawFileData);
    if (!Atom.validate(jsonData)) {
      return false;
    }
    // if all checks passed, congratulations
    return true;
  }
}

export default Atom;
