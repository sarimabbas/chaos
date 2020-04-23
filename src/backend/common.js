import { remote, ipcRenderer, shell } from "electron";
const { dialog, BrowserWindow } = remote;
const { exec } = remote.require("child_process");
const fs = remote.require("fs");
const path = remote.require("path");
const Joi = remote.require("@hapi/joi");
const axios = remote.require("axios");

const utils = {
  loadToBase64: (pathToImage) => {
    const extension = path.extname(pathToImage);
    const data = fs.readFileSync(pathToImage);
    return `data:image/${extension};base64,${data.toString("base64")}`;
  },
  saveURLToPath: async (url, pathToSave) => {
    try {
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
      });
      await response.data.pipe(fs.createWriteStream(pathToSave));
    } catch (err) {
      console.log(err);
      throw "could not save URL to path";
    }
  },
  urlExists: async (url) => {
    try {
      await axios.get(url);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

export {
  remote,
  ipcRenderer,
  shell,
  exec,
  dialog,
  fs,
  path,
  utils,
  BrowserWindow,
  Joi,
};
