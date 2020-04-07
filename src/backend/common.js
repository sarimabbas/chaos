import { remote, ipcRenderer, shell } from "electron";
const { dialog, BrowserWindow } = remote;
const { exec } = remote.require("child_process");
const fs = remote.require("fs");
const path = remote.require("path");
const Joi = remote.require("@hapi/joi");

export {
  remote,
  ipcRenderer,
  shell,
  exec,
  dialog,
  fs,
  path,
  BrowserWindow,
  Joi,
};
