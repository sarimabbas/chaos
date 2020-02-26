import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // SidebarContext
    sidebarContexts: {
      isExplorerShowing: false,
      isSearchShowing: false,
      isExtensionsShowing: false
    },
    // Views
    views: {
      currentWorkingNode: {},
      currentWorkingPath: "",
      folderMode: "immediate" // false: "nested" mode
    },
    hacks: {
      refreshFileExplorer: new Date()
    }
  },
  mutations: {
    toggleIsExplorerShowing(state) {
      state.sidebarContexts.isSearchShowing = false;
      state.sidebarContexts.isExtensionsShowing = false;
      state.sidebarContexts.isExplorerShowing = !state.sidebarContexts
        .isExplorerShowing;
    },
    toggleIsSearchShowing(state) {
      state.sidebarContexts.isExplorerShowing = false;
      state.sidebarContexts.isExtensionsShowing = false;
      state.sidebarContexts.isSearchShowing = !state.sidebarContexts
        .isSearchShowing;
    },
    toggleIsExtensionsShowing(state) {
      state.sidebarContexts.isExplorerShowing = false;
      state.sidebarContexts.isSearchShowing = false;
      state.sidebarContexts.isExtensionsShowing = !state.sidebarContexts
        .isExtensionsShowing;
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
    }
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
    setCurrentWorkingNode(ctx, node) {
      ctx.commit("setCurrentWorkingNode", node);
    },
    setFolderMode(ctx, mode) {
      ctx.commit("setFolderMode", mode);
    },
    refreshFileExplorer(ctx) {
      ctx.commit("refreshFileExplorer");
    }
  },
  modules: {}
});
