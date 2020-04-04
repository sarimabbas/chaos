import Vue from "vue";
import Vuex from "vuex";
import { setAllExcept } from "../utilities";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // left and right sidebar
    contexts: {
      explorer: {
        isShowing: false,
        side: "left",
      },
      search: {
        isShowing: false,
        side: "left",
      },
      extensions: {
        isShowing: false,
        side: "left",
      },
      chat: {
        isShowing: false,
        side: "right",
      },
    },
    // Views
    views: {
      currentWorkingNode: {},
      currentWorkingPath: "",
      folderMode: "immediate", // false: "nested" mode
    },
    hacks: {
      refreshFileExplorer: new Date(),
    },
  },
  mutations: {
    toggleIsExplorerShowing(state) {
      const contexts = state.contexts;
      const initVal = contexts["explorer"].isShowing;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].side == contexts["explorer"].side) {
          contexts[key].isShowing = false;
        }
      });
      contexts["explorer"].isShowing = !initVal;
    },
    toggleIsSearchShowing(state) {
      const contexts = state.contexts;
      const initVal = contexts["search"].isShowing;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].side == contexts["search"].side) {
          contexts[key].isShowing = false;
        }
      });
      contexts["search"].isShowing = !initVal;
    },
    toggleIsExtensionsShowing(state) {
      const contexts = state.contexts;
      const initVal = contexts["extensions"].isShowing;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].side == contexts["extensions"].side) {
          contexts[key].isShowing = false;
        }
      });
      contexts.extensions.isShowing = !contexts.extensions.isShowing;
      contexts["extensions"].isShowing = !initVal;
    },
    toggleIsChatShowing(state) {
      const contexts = state.contexts;
      const initVal = contexts["chat"].isShowing;
      Object.keys(contexts).forEach(function (key) {
        if (contexts[key].side == contexts["chat"].side) {
          contexts[key].isShowing = false;
        }
      });
      contexts["chat"].isShowing = !initVal;
    },
    setCurrentWorkingNode(state, node) {
      state.views.currentWorkingNode = node;
      state.views.currentWorkingPath = node.path;
    },
    setFolderMode(state, mode) {
      state.views.folderMode = mode;
    },
    refreshFileExplorer(state) {
      state.hacks.refreshFileExplorer = new Date();
    },
  },
  actions: {
    toggleIsExplorerShowing(ctx) {
      ctx.commit("toggleIsExplorerShowing");
    },
    toggleIsSearchShowing(ctx) {
      ctx.commit("toggleIsSearchShowing");
    },
    toggleIsExtensionsShowing(ctx) {
      ctx.commit("toggleIsExtensionsShowing");
    },
    toggleIsChatShowing(ctx) {
      ctx.commit("toggleIsChatShowing");
    },
    setCurrentWorkingNode(ctx, node) {
      ctx.commit("setCurrentWorkingNode", node);
    },
    setFolderMode(ctx, mode) {
      ctx.commit("setFolderMode", mode);
    },
    refreshFileExplorer(ctx) {
      ctx.commit("refreshFileExplorer");
    },
  },
  modules: {},
});
