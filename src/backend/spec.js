import { merge as lMerge } from "lodash";
import { Joi } from "./common";

class Spec {
  constructor() {
    this.state = {};
  }

  static spec = Joi.object({});

  update(rep) {
    // save the original state
    const save = JSON.parse(JSON.stringify(this.state));
    // apply changes to the state
    this.state = lMerge(this.state, rep);
    // check if the update parses correctly
    if (Spec.validate(this.state)) {
      return true;
    } else {
      console.log("Failed spec update!");
      this.state = save;
      return false;
    }
  }

  static validate(rep) {
    const { error, value } = Spec.spec.validate(rep, {
      allowUnknown: true,
    });
    if (error) {
      return false;
      console.log(error);
    }
    return true;
  }

  toString() {
    return JSON.stringify(this.state);
  }

  toObj() {
    return JSON.parse(JSON.stringify(this.state));
  }
}

export default Spec;
