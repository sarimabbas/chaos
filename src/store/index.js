import Vue from "vue";
import Vuex from "vuex";
import { setAllExcept } from "../utilities";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // left and right sidebar
    contexts: {
      isExplorerShowing: false,
      isSearchShowing: false,
      isExtensionsShowing: false,
      isChatShowing: false,
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
      setAllExcept(
        state.contexts,
        false,
        "isExplorerShowing",
        !state.contexts.isExplorerShowing
      );
    },
    toggleIsSearchShowing(state) {
      setAllExcept(
        state.contexts,
        false,
        "isSearchShowing",
        !state.contexts.isSearchShowing
      );
    },
    toggleIsExtensionsShowing(state) {
      setAllExcept(
        state.contexts,
        false,
        "isExtensionsShowing",
        !state.contexts.isExtensionsShowing
      );
    },
    toggleIsChatShowing(state) {
      setAllExcept(
        state.contexts,
        false,
        "isChatShowing",
        !state.contexts.isChatShowing
      );
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
