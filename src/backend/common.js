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
    const writer = fs.createWriteStream(pathToSave);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
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
