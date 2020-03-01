import axios from "axios";
import store from "./store";
import events from "./events";

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
  file: {
    read: readFile,
    write: writeFile,
    rename: renameFile
  },
  refreshExplorer
};

export default api;
