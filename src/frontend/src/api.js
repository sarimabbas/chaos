import store from "./store";
import events from "./events";

// electron APIs
import { remote, ipcRenderer, shell } from "electron";
const { exec } = remote.require("child_process");
const { dialog, BrowserWindow } = remote;
const fs = remote.require("fs");
const path = remote.require("path");
const Joi = remote.require("@hapi/joi");
const axios = remote.require("axios");
const critical = remote.require("critical");
const inline = remote.require("web-resource-inliner");
const { Parser, Processor } = remote.require("fast-mhtml");
const mhtml2html = remote.require("mhtml2html");
const { JSDOM } = remote.require("jsdom");

// backend APIs
import Atom from "./backend/atom";

const rest = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api"
      : "/api"
});

const refreshExplorer = () => {
  store.dispatch("refreshFileExplorer");
};

const readFile = async path => {
  return rest.get("/read-file", {
    params: {
      path: path
    }
  });
};

const writeFile = async (path, contents) => {
  const response = await rest.post("/write-file", {
    path: path,
    data: contents
  });
  refreshExplorer();
  return response;
};

const renameFile = () => {};

const api = {
  rest,
  fs,
  path,
  Joi,
  refreshExplorer,
  exec,
  events,
  dialog,
  BrowserWindow,
  axios,
  Atom,
  critical,
  inline,
  Parser,
  Processor,
  mhtml2html,
  JSDOM
};

export default api;
