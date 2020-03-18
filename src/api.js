import store from "./store";
import events from "./events";

// electron APIs
import { remote, ipcRenderer, shell } from "electron";
const { dialog, BrowserWindow } = remote;
const fs = remote.require("fs");
const path = remote.require("path");
const Joi = remote.require("@hapi/joi");
const axios = remote.require("axios");
const inline = remote.require("web-resource-inliner");

// backend APIs
import Atom from "./backend/atom";

const refreshExplorer = () => {
  store.dispatch("refreshFileExplorer");
};

const api = {
  fs,
  path,
  Joi,
  refreshExplorer,
  events,
  dialog,
  BrowserWindow,
  axios,
  Atom,
  inline
};

export default api;
