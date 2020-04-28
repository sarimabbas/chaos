import store from "./store";
import events from "./events";

// electron APIs
import { remote, ipcRenderer, shell } from "electron";
const { dialog, BrowserWindow } = remote;
const fs = remote.require("fs");
const path = remote.require("path");
const Joi = remote.require("@hapi/joi");
const axios = remote.require("axios");

// backend APIs
import { utils } from "./backend/common";
import Atom from "./backend/atom";

const api = {
  fs,
  path,
  Joi,
  events,
  dialog,
  BrowserWindow,
  axios,
  Atom,
  utils,
};

export default api;
