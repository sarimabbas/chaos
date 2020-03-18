import { fs, path, Joi } from "./common";

class Atom {
  constructor() {
    this.spec = Joi.object({
      // system metadata
      system: {
        st_size: Joi.number(),
        st_mtime: Joi.date().timestamp(),
        st_ctime: Joi.date().timestamp()
      },
      // shared metadata for all atoms, where possible
      shared: {
        // general organization (e.g. Kanban board)
        category: Joi.string().allow(""),
        tags: Joi.array().items(Joi.string().allow("")),
        // for todo functionality
        completed: Joi.boolean(),
        deadline: Joi.date().timestamp() // integer UNIX time
      },
      module: {
        id: Joi.string().required(),
        name: Joi.string().required()
        // module specific properties:
        // assetsPath: "",
        // apiToken: ""
      }
    });
    this.state = {};
  }

  update(rep) {
    // save the original state
    const save = JSON.parse(JSON.stringify(this.state));
    // apply changes to the state
    const changedState = Object.assign(this.state, rep);
    // check if the update parses correctly
    if (this.validate(changedState)) {
      return true;
    } else {
      this.state = save;
      return false;
    }
  }

  toString() {
    return JSON.stringify(this.state);
  }

  toObj() {
    return JSON.parse(JSON.stringify(this.state));
  }

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
    // the bundle must exist
    if (!fs.existsSync(pathToBundle)) {
      return false;
    }
    // the atom must be a directory, not a file
    if (fs.lstatSync(pathToBundle).isFile()) {
      return false;
    }
    // the bundle must have a manifest.json
    const pathToManifest = path.join(pathToBundle, "manifest.json");
    if (!fs.existsSync(pathToManifest)) {
      return false;
    }
    // the next thing is to parse the manifest to JSON
    const rawFileData = fs.readFileSync(pathToManifest);
    const jsonData = JSON.parse(rawFileData);
    // parse the representation
    if (!this.validate(jsonData)) {
      return false;
    }
    // once all checks are done, update state
    this.state = jsonData;
    return true;
  }

  validate(rep) {
    const { error, value } = this.spec.validate(rep, {
      allowUnknown: true
    });
    if (error) {
      return false;
      console.log(error);
    }
    return true;
  }
}

export default Atom;
